import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { Settings, Message, AssistantMessage, Correction } from "../types";
import { ChatError, ParsingError } from "../errors";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Initializes and returns an OpenAI client instance using the provided settings.
 */
function getOpenAIClient(settings: Settings): OpenAI {
  return new OpenAI({
    apiKey: settings.apiKey,
    baseURL: settings.apiBaseUrl,
    dangerouslyAllowBrowser: true,
  });
}

/**
 * Sends a message to the LLM and streams the response back.
 * The LLM is instructed to respond with JSON format.
 *
 * @param messages - Array of chat messages to send to the LLM
 * @param settings - User settings containing API key, model, etc.
 * @returns AsyncIterable that yields chunks of the streaming response
 */
export async function* sendMessage(
  messages: ChatMessage[],
  settings: Settings
): AsyncIterable<string> {
  const client = getOpenAIClient(settings);

  try {
    const stream = await client.chat.completions.create({
      model: settings.model,
      messages,
      response_format: { type: "json_object" },
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }
    throw new ChatError(
      error instanceof Error ? error.message : "Chat request failed",
      { cause: error }
    );
  }
}

/**
 * Builds a system prompt that instructs the LLM to act as a language learning assistant.
 * The LLM will correct user messages, respond naturally, and provide translations.
 *
 * @param nativeLanguage - The user's native language (for explanations and translations)
 * @param targetLanguage - The language the user is learning
 * @returns System prompt string for the LLM
 */
export function buildSystemPrompt(
  nativeLanguage: string,
  targetLanguage: string
): string {
  return `You are a helpful language learning assistant. The user is learning ${targetLanguage} and their native language is ${nativeLanguage}.

Your task is to help them practice ${targetLanguage} by:
1. Correcting any errors in their messages
2. Responding naturally to continue the chat in ${targetLanguage}
3. Providing a translation of your response in ${nativeLanguage}

You MUST respond with valid JSON in this exact format:

{
  "correction": {
    "original": "the exact text the user wrote",
    "corrected": "the corrected version in ${targetLanguage}",
    "explanation": "explanation of what was wrong and why, written in ${nativeLanguage}. If there are no errors, say something encouraging like 'Perfect! No errors.' in ${nativeLanguage}"
  },
  "response": "your natural chatal reply in ${targetLanguage}",
  "translation": "translation of your response into ${nativeLanguage}"
}

Important guidelines:
- Be encouraging and supportive, even when correcting errors
- If the user's message is already correct, still provide the correction object but note in the explanation that it was perfect
- Keep responses chatal and natural, as if chatting with a friend
- The explanation should always be in ${nativeLanguage} to ensure understanding
- The response should always be in ${targetLanguage} to provide practice
- Always include all three fields in your JSON response`;
}

/**
 * Parses the raw JSON string response from the LLM into a Message object.
 * Handles malformed JSON gracefully by falling back to displaying raw content.
 *
 * @param rawJsonString - The raw JSON string returned by the LLM
 * @returns A Message object with parsed fields or fallback content
 */
export function parseAssistantMessage(rawJsonString: string): AssistantMessage {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJsonString);
  } catch (error) {
    throw new ParsingError("Response is not valid JSON", { cause: error });
  }

  if (!parsed || typeof parsed !== "object") {
    throw new ParsingError("Response is not a JSON object");
  }

  const obj = parsed as Record<string, unknown>;
  const correction = obj.correction as Record<string, unknown> | undefined;

  if (
    !correction ||
    typeof correction !== "object" ||
    typeof correction.original !== "string" ||
    typeof correction.corrected !== "string" ||
    typeof correction.explanation !== "string"
  ) {
    throw new ParsingError("Response is missing a valid 'correction' object");
  }

  if (typeof obj.response !== "string") {
    throw new ParsingError("Response is missing a valid 'response' string");
  }

  if (typeof obj.translation !== "string") {
    throw new ParsingError("Response is missing a valid 'translation' string");
  }

  const correctionData: Correction = {
    original: correction.original as string,
    corrected: correction.corrected as string,
    explanation: correction.explanation as string,
  };

  return {
    id: uuidv4(),
    role: "assistant",
    content: rawJsonString,
    createdAt: new Date().toISOString(),
    correction: correctionData,
    response: obj.response as string,
    translation: obj.translation as string,
  };
}

const MAX_HISTORY_MESSAGES = 100;

/**
 * Builds the message array to send to the LLM.
 * Filters out error messages and caps history to avoid overflowing context.
 *
 * @param messages - Existing chat messages from the store
 * @param messageText - The new user message to append
 * @param settings - User settings for language and system prompt
 * @returns Array of ChatMessage ready to send to the LLM
 */
export function buildChatMessages(
  messages: Message[],
  messageText: string,
  settings: Settings
): ChatMessage[] {
  const systemPrompt = buildSystemPrompt(
    settings.nativeLanguage,
    settings.targetLanguage
  );

  const history = messages
    .filter((msg) => msg.role !== "error")
    .slice(-MAX_HISTORY_MESSAGES)
    .map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.role === "assistant" ? (msg.response ?? msg.content) : msg.content,
    }));

  return [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: messageText },
  ];
}

export type { ChatMessage };
