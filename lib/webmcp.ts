export type VladConversationMessage = {
  role: "user" | "assistant"
  content: string
}

export type InterestConnection = {
  interest: string
  connection: string
}

export type RelevantProject = {
  name: string
  whyRelevant: string
  url?: string
}

export type InterestSummary = {
  forWhom: string
  headline: string
  overview: string
  commonInterests: InterestConnection[]
  relevantProjects: RelevantProject[]
  surprisingConnections: string[]
  followUpQuestions: string[]
}

export type AskVladInput = {
  question?: unknown
}

export type InterestSummaryInput = {
  for_whom?: unknown
  headline?: unknown
  overview?: unknown
  common_interests?: unknown
  relevant_projects?: unknown
  surprising_connections?: unknown
  suggested_follow_up_questions?: unknown
}

export const askVladTool = {
  name: "ask_vlad",
  title: "Ask Vlad",
  description:
    "Ask Vladimir Haltakov one question about his experience, interests, projects, or current work. Vlad answers from his maintained site profile and knowledgebase, with supporting links when available. This tool keeps Vlad's side of the conversation coherent across calls. Use your own memory of the visitor to choose focused, relevant follow-up questions, but do not disclose sensitive or private visitor information in the question. Ask one question at a time, normally 3–8 questions total, before calling show_interest_summary.",
  inputSchema: {
    type: "object",
    properties: {
      question: {
        type: "string",
        minLength: 1,
        maxLength: 1200,
        description:
          "A single, focused question for Vlad. Base it on what you know about the visitor and what Vlad has already said.",
      },
    },
    required: ["question"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: true,
  },
} as const

export const showInterestSummaryTool = {
  name: "show_interest_summary",
  title: "Show interest summary",
  description:
    "Render the final personalized 'Why Vlad is interesting to you' report on the page. Call this once after you have asked Vlad enough questions. Synthesize the report using your own memory of the visitor together with Vlad's answers. Be specific and evidence-based; do not invent facts. Use links Vlad supplied when they support a project connection.",
  inputSchema: {
    type: "object",
    properties: {
      for_whom: {
        type: "string",
        maxLength: 120,
        description: "The visitor's name, role, or a concise audience label.",
      },
      headline: {
        type: "string",
        maxLength: 160,
        description: "A specific one-sentence thesis about why Vlad is relevant to this visitor.",
      },
      overview: {
        type: "string",
        maxLength: 700,
        description: "A concise personalized synthesis grounded in the conversation.",
      },
      common_interests: {
        type: "array",
        minItems: 1,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            interest: { type: "string", maxLength: 100 },
            connection: {
              type: "string",
              maxLength: 360,
              description: "How this interest connects the visitor and Vlad.",
            },
          },
          required: ["interest", "connection"],
          additionalProperties: false,
        },
      },
      relevant_projects: {
        type: "array",
        minItems: 1,
        maxItems: 6,
        items: {
          type: "object",
          properties: {
            name: { type: "string", maxLength: 100 },
            why_relevant: { type: "string", maxLength: 360 },
            url: {
              type: "string",
              maxLength: 500,
              description: "An optional supporting HTTPS link supplied by Vlad.",
            },
          },
          required: ["name", "why_relevant"],
          additionalProperties: false,
        },
      },
      surprising_connections: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: { type: "string", maxLength: 360 },
      },
      suggested_follow_up_questions: {
        type: "array",
        minItems: 2,
        maxItems: 6,
        items: { type: "string", maxLength: 240 },
      },
    },
    required: [
      "for_whom",
      "headline",
      "overview",
      "common_interests",
      "relevant_projects",
      "surprising_connections",
      "suggested_follow_up_questions",
    ],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: false,
    untrustedContentHint: true,
  },
} as const

export function parseQuestion(input: AskVladInput): string {
  const question = readRequiredString(input.question, "question", 1200)
  if (question.split(/\s+/).length < 2) {
    throw new Error("Ask Vlad a complete, focused question.")
  }
  return question
}

export function parseInterestSummary(input: InterestSummaryInput): InterestSummary {
  return {
    forWhom: readRequiredString(input.for_whom, "for_whom", 120),
    headline: readRequiredString(input.headline, "headline", 160),
    overview: readRequiredString(input.overview, "overview", 700),
    commonInterests: readObjectArray(input.common_interests, "common_interests", 6).map(
      (item, index) => ({
        interest: readRequiredString(item.interest, `common_interests[${index}].interest`, 100),
        connection: readRequiredString(
          item.connection,
          `common_interests[${index}].connection`,
          360,
        ),
      }),
    ),
    relevantProjects: readObjectArray(input.relevant_projects, "relevant_projects", 6).map(
      (item, index) => ({
        name: readRequiredString(item.name, `relevant_projects[${index}].name`, 100),
        whyRelevant: readRequiredString(
          item.why_relevant,
          `relevant_projects[${index}].why_relevant`,
          360,
        ),
        url: readOptionalHttpsUrl(item.url, `relevant_projects[${index}].url`),
      }),
    ),
    surprisingConnections: readStringArray(
      input.surprising_connections,
      "surprising_connections",
      5,
      360,
    ),
    followUpQuestions: readStringArray(
      input.suggested_follow_up_questions,
      "suggested_follow_up_questions",
      6,
      240,
    ),
  }
}

export async function askVlad(
  question: string,
  messages: VladConversationMessage[],
  conversationId: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      message: question,
      messages: [...messages, { role: "user", content: question }],
      conversationId,
    }),
    signal,
  })

  if (!response.ok) {
    const detail = await readErrorDetail(response)
    throw new Error(detail || `Vlad's agent returned ${response.status}.`)
  }

  const contentType = response.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const payload = (await response.json()) as { answer?: unknown; content?: unknown; error?: unknown }
    if (typeof payload.error === "string") throw new Error(payload.error)
    const answer = typeof payload.answer === "string" ? payload.answer : payload.content
    if (typeof answer === "string" && answer.trim()) return answer.trim()
    throw new Error("Vlad's agent returned an empty answer.")
  }

  const body = await response.text()
  const answer = readSseAnswer(body)
  if (!answer) throw new Error("Vlad's agent returned an empty answer.")
  return answer
}

function readSseAnswer(body: string): string {
  let answer = ""

  for (const block of body.replace(/\r\n/g, "\n").split("\n\n")) {
    if (!block.trim()) continue
    let eventName = "message"
    const dataLines: string[] = []

    for (const line of block.split("\n")) {
      if (!line || line.startsWith(":")) continue
      const separator = line.indexOf(":")
      const field = separator === -1 ? line : line.slice(0, separator)
      const value = separator === -1 ? "" : line.slice(separator + 1).replace(/^ /, "")
      if (field === "event") eventName = value
      if (field === "data") dataLines.push(value)
    }

    const data = dataLines.join("\n")
    if (!data) continue

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(data) as Record<string, unknown>
    } catch {
      if (eventName === "text-delta" || eventName === "message") answer += data
      continue
    }

    const type = typeof payload.type === "string" ? payload.type : eventName
    if (type === "error") {
      throw new Error(typeof payload.error === "string" ? payload.error : "Vlad's agent failed.")
    }
    if (type === "text-delta" && typeof payload.text === "string") answer += payload.text
  }

  return answer.trim()
}

async function readErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const payload = (await response.json()) as { error?: unknown }
    return typeof payload.error === "string" ? payload.error : undefined
  } catch {
    return undefined
  }
}

function readRequiredString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} must be a non-empty string.`)
  }
  return value.trim().slice(0, maxLength)
}

function readObjectArray(
  value: unknown,
  field: string,
  maxItems: number,
): Record<string, unknown>[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} must contain at least one item.`)
  }
  return value.slice(0, maxItems).map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`${field}[${index}] must be an object.`)
    }
    return item as Record<string, unknown>
  })
}

function readStringArray(
  value: unknown,
  field: string,
  maxItems: number,
  maxLength: number,
): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${field} must contain at least one item.`)
  }
  return value
    .slice(0, maxItems)
    .map((item, index) => readRequiredString(item, `${field}[${index}]`, maxLength))
}

function readOptionalHttpsUrl(value: unknown, field: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined
  const raw = readRequiredString(value, field, 500)
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:") throw new Error()
    return url.toString()
  } catch {
    throw new Error(`${field} must be a valid HTTPS URL.`)
  }
}
