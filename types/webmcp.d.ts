type WebMcpJsonSchema = Record<string, unknown>

type WebMcpTool = {
  name: string
  title?: string
  description: string
  inputSchema?: WebMcpJsonSchema
  annotations?: {
    readOnlyHint?: boolean
    untrustedContentHint?: boolean
  }
  execute: (
    input: Record<string, unknown>,
    options?: { signal: AbortSignal },
  ) => string | Promise<string>
}

interface WebMcpModelContext {
  registerTool(
    tool: WebMcpTool,
    options?: { signal?: AbortSignal; exposedTo?: string[] },
  ): Promise<void>
  unregisterTool(name: string): Promise<void>
}

interface Document {
  readonly modelContext?: WebMcpModelContext
}

interface Navigator {
  readonly modelContext?: WebMcpModelContext
}
