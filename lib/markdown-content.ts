import { readFile } from "node:fs/promises"

export async function loadMarkdownBody(filePath: string): Promise<string> {
  const source = await readFile(filePath, "utf8")
  return stripFrontmatter(source, filePath).trim()
}

function stripFrontmatter(source: string, filePath: string): string {
  const normalized = source.replace(/\r\n/g, "\n")
  if (!normalized.startsWith("---\n")) return normalized

  const end = normalized.indexOf("\n---\n", 4)
  if (end === -1) {
    throw new Error(`Markdown file "${filePath}" is missing a closing frontmatter marker.`)
  }

  return normalized.slice(end + 5)
}
