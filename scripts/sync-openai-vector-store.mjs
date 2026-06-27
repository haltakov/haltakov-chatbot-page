#!/usr/bin/env node

import { createHash } from "node:crypto"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const DEFAULT_EXTENSIONS = [
  ".md",
  ".mdx",
  ".txt",
  ".json",
  ".jsonl",
  ".pdf",
  ".docx",
  ".pptx",
]
const SKIPPED_DIRS = new Set([".git", ".next", "node_modules"])
const DEFAULT_EXCLUDED_PATHS = ["x/tweetsForStore.jsonl"]
const TERMINAL_STATUSES = new Set(["completed", "failed", "cancelled", "expired"])

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run") || process.env.OPENAI_VECTOR_STORE_DRY_RUN === "1"
const docsDir = path.resolve(
  process.cwd(),
  getArgValue("--docs-dir") ?? process.env.OPENAI_VECTOR_STORE_DOCS_DIR ?? "docs",
)
const baseUrl = trimTrailingSlash(
  process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
)
const apiKey = process.env.OPENAI_API_KEY
const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID
const syncMarker =
  process.env.OPENAI_VECTOR_STORE_SYNC_MARKER ?? (await readPackageName()) ?? "docs-sync"
const deleteOpenAIFiles = process.env.OPENAI_SYNC_DELETE_FILES !== "false"
const batchSize = parsePositiveInt(process.env.OPENAI_VECTOR_STORE_BATCH_SIZE, 500)
const pollIntervalMs = parsePositiveInt(
  process.env.OPENAI_VECTOR_STORE_POLL_INTERVAL_MS,
  2_000,
)
const pollTimeoutMs = parsePositiveInt(
  process.env.OPENAI_VECTOR_STORE_POLL_TIMEOUT_MS,
  10 * 60_000,
)
const supportedExtensions = new Set(
  (process.env.OPENAI_VECTOR_STORE_EXTENSIONS ?? DEFAULT_EXTENSIONS.join(","))
    .split(",")
    .map((extension) => extension.trim().toLowerCase())
    .filter(Boolean)
    .map((extension) => (extension.startsWith(".") ? extension : `.${extension}`)),
)
const excludedPaths = (
  process.env.OPENAI_VECTOR_STORE_EXCLUDED_PATHS ??
  DEFAULT_EXCLUDED_PATHS.join(",")
)
  .split(",")
  .map(normalizeExcludedPath)
  .filter(Boolean)

if (!apiKey) fail("OPENAI_API_KEY is required.")
if (!vectorStoreId) fail("OPENAI_VECTOR_STORE_ID is required.")

const localDocuments = await collectLocalDocuments(docsDir)
const remoteFiles = await listVectorStoreFiles()
const managedRemoteFiles = remoteFiles.filter(isManagedRemoteFile)
const remoteByPath = groupRemoteFilesByPath(managedRemoteFiles)
const localPaths = new Set(localDocuments.map((document) => document.relativePath))
const uploads = []
const deletions = new Map()
let unchanged = 0

for (const document of localDocuments) {
  const remotes = remoteByPath.get(document.relativePath) ?? []
  const current = remotes.find((remote) => {
    const attributes = getAttributes(remote)
    return attributes.sha256 === document.sha256 && remote.status !== "failed"
  })

  if (current) {
    unchanged += 1
    for (const remote of remotes) {
      if (getRemoteFileId(remote) !== getRemoteFileId(current)) {
        deletions.set(getRemoteFileId(remote), remote)
      }
    }
  } else {
    uploads.push(document)
    for (const remote of remotes) {
      deletions.set(getRemoteFileId(remote), remote)
    }
  }
}

for (const remote of managedRemoteFiles) {
  const sourcePath = getStringAttribute(remote, "source_path")
  if (sourcePath && !localPaths.has(sourcePath)) {
    deletions.set(getRemoteFileId(remote), remote)
  }
}

console.log(`Docs directory: ${path.relative(process.cwd(), docsDir) || "."}`)
if (excludedPaths.length > 0) {
  console.log(`Excluded paths: ${excludedPaths.join(", ")}`)
}
console.log(`Local documents: ${localDocuments.length}`)
console.log(`Managed vector-store files: ${managedRemoteFiles.length}`)
console.log(`Unchanged: ${unchanged}`)
console.log(`To upload: ${uploads.length}`)
console.log(`To delete: ${deletions.size}`)

if (dryRun) {
  console.log("Dry run enabled; no remote changes were made.")
  process.exit(0)
}

const uploadedFiles = []

for (const document of uploads) {
  const file = await uploadFile(document)
  uploadedFiles.push({ document, fileId: file.id })
  console.log(`Uploaded ${document.relativePath} -> ${file.id}`)
}

for (const chunk of chunkArray(uploadedFiles, batchSize)) {
  if (chunk.length === 0) continue
  const batch = await createVectorStoreFileBatch(chunk)
  console.log(`Attached batch ${batch.id} (${chunk.length} files)`)
  await waitForVectorStoreBatch(batch.id)
}

for (const remote of deletions.values()) {
  const fileId = getRemoteFileId(remote)
  await deleteVectorStoreFile(fileId)
  console.log(`Removed ${getStringAttribute(remote, "source_path") ?? fileId}`)
}

console.log("Vector store sync complete.")

async function collectLocalDocuments(directory) {
  const documents = []
  await walk(directory)
  return documents.sort((a, b) => a.relativePath.localeCompare(b.relativePath))

  async function walk(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.name.startsWith(".") || SKIPPED_DIRS.has(entry.name)) continue

      const absolutePath = path.join(currentDir, entry.name)
      const relativePath = toPosixPath(path.relative(directory, absolutePath))

      if (entry.isDirectory()) {
        if (shouldSkipRelativePath(`${relativePath}/`)) continue
        await walk(absolutePath)
        continue
      }

      if (!entry.isFile()) continue

      const extension = path.extname(entry.name).toLowerCase()
      if (!supportedExtensions.has(extension)) continue

      const buffer = await readFile(absolutePath)
      const fileStat = await stat(absolutePath)
      if (shouldSkipRelativePath(relativePath)) continue

      documents.push({
        absolutePath,
        bytes: buffer.byteLength,
        modifiedAt: fileStat.mtime.toISOString(),
        relativePath,
        sha256: createHash("sha256").update(buffer).digest("hex"),
      })
    }
  }
}

async function listVectorStoreFiles() {
  const files = []
  let after

  while (true) {
    const params = new URLSearchParams({
      limit: "100",
      order: "asc",
    })
    if (after) params.set("after", after)

    const page = await requestJson(
      `/vector_stores/${encodeURIComponent(vectorStoreId)}/files?${params}`,
    )
    const data = Array.isArray(page.data) ? page.data : []

    for (const file of data) {
      files.push(await ensureVectorStoreFileAttributes(file))
    }

    if (!page.has_more || data.length === 0) break
    after = page.last_id ?? data[data.length - 1]?.id
    if (!after) break
  }

  return files
}

async function ensureVectorStoreFileAttributes(file) {
  if (file && typeof file === "object" && "attributes" in file) return file

  try {
    return await requestJson(
      `/vector_stores/${encodeURIComponent(vectorStoreId)}/files/${encodeURIComponent(
        getRemoteFileId(file),
      )}`,
    )
  } catch (error) {
    console.warn(`Could not fetch vector-store file attributes for ${file.id}: ${error.message}`)
    return file
  }
}

async function uploadFile(document) {
  const buffer = await readFile(document.absolutePath)
  const form = new FormData()
  form.append("purpose", "assistants")
  form.append(
    "file",
    new Blob([buffer], { type: contentTypeFor(document.absolutePath) }),
    path.basename(document.relativePath),
  )

  return requestJson("/files", {
    method: "POST",
    body: form,
  })
}

async function createVectorStoreFileBatch(files) {
  return requestJson(
    `/vector_stores/${encodeURIComponent(vectorStoreId)}/file_batches`,
    {
      method: "POST",
      body: {
        files: files.map(({ document, fileId }) => ({
          file_id: fileId,
          attributes: attributesFor(document),
        })),
      },
    },
  )
}

async function waitForVectorStoreBatch(batchId) {
  const deadline = Date.now() + pollTimeoutMs

  while (Date.now() < deadline) {
    const batch = await requestJson(
      `/vector_stores/${encodeURIComponent(vectorStoreId)}/file_batches/${encodeURIComponent(
        batchId,
      )}`,
    )

    if (TERMINAL_STATUSES.has(batch.status)) {
      if (batch.status !== "completed") {
        throw new Error(`Vector store file batch ${batchId} ended with status ${batch.status}.`)
      }
      return batch
    }

    await sleep(pollIntervalMs)
  }

  throw new Error(`Timed out waiting for vector store file batch ${batchId}.`)
}

async function deleteVectorStoreFile(fileId) {
  await requestJson(
    `/vector_stores/${encodeURIComponent(vectorStoreId)}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
    },
  )

  if (!deleteOpenAIFiles) return

  try {
    await requestJson(`/files/${encodeURIComponent(fileId)}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.warn(`Could not delete OpenAI file ${fileId}: ${error.message}`)
  }
}

async function requestJson(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: options.method ?? "GET",
    headers: requestHeaders(options.body instanceof FormData),
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  })
  const text = await response.text()
  const payload = parseJsonResponse(text)

  if (!response.ok) {
    const message =
      payload?.error?.message ??
      payload?.message ??
      text ??
      `OpenAI request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}

function parseJsonResponse(text) {
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return {
      message: text,
    }
  }
}

function requestHeaders(isFormData) {
  const headers = {
    authorization: `Bearer ${apiKey}`,
  }

  if (!isFormData) headers["content-type"] = "application/json"
  if (process.env.OPENAI_ORGANIZATION_ID) {
    headers["openai-organization"] = process.env.OPENAI_ORGANIZATION_ID
  }
  if (process.env.OPENAI_PROJECT_ID) {
    headers["openai-project"] = process.env.OPENAI_PROJECT_ID
  }

  return headers
}

function attributesFor(document) {
  return {
    sync_marker: syncMarker,
    source_path: document.relativePath,
    sha256: document.sha256,
    bytes: document.bytes,
    modified_at: document.modifiedAt,
  }
}

function groupRemoteFilesByPath(files) {
  const groups = new Map()

  for (const file of files) {
    const sourcePath = getStringAttribute(file, "source_path")
    if (!sourcePath) continue
    const group = groups.get(sourcePath) ?? []
    group.push(file)
    groups.set(sourcePath, group)
  }

  return groups
}

function isManagedRemoteFile(file) {
  return getStringAttribute(file, "sync_marker") === syncMarker
}

function getAttributes(file) {
  return file && typeof file.attributes === "object" && file.attributes !== null
    ? file.attributes
    : {}
}

function getStringAttribute(file, key) {
  const value = getAttributes(file)[key]
  return typeof value === "string" ? value : undefined
}

function getRemoteFileId(file) {
  if (file && typeof file.file_id === "string") return file.file_id
  if (file && typeof file.id === "string") return file.id
  throw new Error("Vector store file is missing an id.")
}

function contentTypeFor(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".json":
    case ".jsonl":
      return "application/json"
    case ".md":
    case ".mdx":
    case ".txt":
      return "text/plain"
    case ".pdf":
      return "application/pdf"
    case ".docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    case ".pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    default:
      return "application/octet-stream"
  }
}

function normalizeExcludedPath(value) {
  // Accepts both exact files ("x/tweetsForStore.jsonl") and directory subtrees
  // ("docs/private", "docs/private/", "docs/private/**"). Trailing slash/glob is
  // dropped so a single rule covers both cases in shouldSkipRelativePath.
  return value
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replace(/\/(\*\*?)?$/, "")
    .replace(/\/+$/, "")
}

function shouldSkipRelativePath(relativePath) {
  const normalized = relativePath
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
  return excludedPaths.some(
    (excluded) => normalized === excluded || normalized.startsWith(`${excluded}/`),
  )
}

async function readPackageName() {
  try {
    const packageJson = JSON.parse(await readFile("package.json", "utf8"))
    return typeof packageJson.name === "string" ? `${packageJson.name}:docs` : undefined
  } catch {
    return undefined
  }
}

function getArgValue(name) {
  const index = args.indexOf(name)
  return index === -1 ? undefined : args[index + 1]
}

function parsePositiveInt(value, fallback) {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function chunkArray(array, size) {
  const chunks = []
  for (let index = 0; index < array.length; index += size) {
    chunks.push(array.slice(index, index + size))
  }
  return chunks
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "")
}

function toPosixPath(value) {
  return value.split(path.sep).join("/")
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
