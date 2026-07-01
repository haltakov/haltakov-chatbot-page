import {
  ChatbotRequestError,
  type ChatbotModelProvider,
  createChatbotErrorResponse,
  createChatbotSseResponse,
  createOpenAIResponsesProvider,
  readChatbotRequest,
  streamText,
} from "chatbot-page/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const chatRequest = await readChatbotRequest(request, {
      maxMessageLength: 4000,
      maxMessages: 24,
    });
    const modelProvider = createModelProvider();

    if (!modelProvider) {
      return createChatbotSseResponse(
        streamText(
          `The LLM backend is wired up, but OPENAI_API_KEY is not configured for this environment yet.\n\nQuestion received: "${chatRequest.message}"`,
          {
            chunkSize: 28,
            delayMs: 15,
          }
        )
      );
    }

    return createChatbotSseResponse(modelProvider.streamAnswer(chatRequest));
  } catch (error) {
    return createChatbotErrorResponse(error instanceof ChatbotRequestError ? error : new Error("Chat request failed."));
  }
}

function createModelProvider(): ChatbotModelProvider | null {
  if (!process.env.OPENAI_API_KEY) return null;

  return createOpenAIResponsesProvider({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORGANIZATION_ID,
    project: process.env.OPENAI_PROJECT_ID,
    model: process.env.OPENAI_MODEL ?? "gpt-5.4-mini",
    systemPromptPath: "content/system-prompt.md",
    vectorStoreIds: parseCsv(process.env.OPENAI_VECTOR_STORE_ID),
  });
}

function parseCsv(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
