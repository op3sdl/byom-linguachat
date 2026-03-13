import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import type { Settings, Message, AssistantMessage } from "../types";
import { ChatError } from "../errors";

const CorrectionSchema = z.object({
  original: z.string().describe("The exact text the user wrote"),
  corrected: z.string().describe("The corrected version IN THE TARGET LANGUAGE"),
  explanation: z.string().describe("Explanation of what was wrong and why, written IN THE NATIVE LANGUAGE. If there are no errors, say something encouraging."),
  translation: z.string().describe("Translation of the corrected text INTO THE NATIVE LANGUAGE"),
});

const AssistantResponseSchema = z.object({
  correction: CorrectionSchema,
  response: z.string().describe("A natural chatty reply IN THE TARGET LANGUAGE"),
  translation: z.string().describe("Translation of the response INTO THE NATIVE LANGUAGE"),
});

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
 * Sends a message to the LLM and returns a structured assistant response.
 * Uses OpenAI structured outputs to guarantee schema-valid JSON.
 *
 * @param messages - Array of chat messages to send to the LLM
 * @param settings - User settings containing API key, model, etc.
 * @returns Parsed AssistantMessage
 */
export async function sendMessage(
  messages: ChatMessage[],
  settings: Settings
): Promise<AssistantMessage> {
  const client = getOpenAIClient(settings);

  try {
    const completion = await client.chat.completions.parse({
      model: settings.model,
      messages,
      response_format: zodResponseFormat(AssistantResponseSchema, "assistant_response"),
    });

    const message = completion.choices[0]?.message;

    if (message?.refusal) {
      throw new ChatError(message.refusal);
    }

    const parsed = message?.parsed;
    if (!parsed) {
      throw new ChatError("No response received from the model");
    }

    return {
      id: uuidv4(),
      role: "assistant",
      content: JSON.stringify(parsed),
      createdAt: new Date().toISOString(),
      correction: parsed.correction,
      response: parsed.response,
      translation: parsed.translation,
    };
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

Important guidelines:
- Be encouraging and supportive, even when correcting errors
- If the user's message is already correct, still provide the correction but note in the explanation that it was perfect
- Keep responses chatty and natural, as if chatting with a friend
- The explanation should always be in ${nativeLanguage} to ensure understanding
- The response should always be in ${targetLanguage} to provide practice`;
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
