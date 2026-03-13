import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { Settings, Explanation } from "../types";
import { ExplanationError } from "../errors";

const ExplanationSchema = z.object({
  translation: z.string().describe("Translation of the selected text into the user's native language"),
  explanation: z.string().describe("Brief explanation of the selection's meaning in context, including grammar notes and 1-2 example sentences showing usage"),
});

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
 * Builds a system prompt that instructs the LLM to explain selected text.
 * The explanation includes translation and contextual usage examples.
 *
 * @param nativeLanguage - The user's native language (for translation and explanation)
 * @param targetLanguage - The language the user is learning
 * @returns System prompt string for the LLM
 */
function buildExplanationPrompt(
  nativeLanguage: string,
  targetLanguage: string
): string {
  return `You are a helpful language learning assistant. The user is learning ${targetLanguage} and their native language is ${nativeLanguage}.

Your task is to explain a selected piece of text from a conversation in ${targetLanguage}.

Provide:
1. A translation of the selected text into ${nativeLanguage}
2. A brief explanation in ${nativeLanguage} that covers:
   - The meaning of the selected text in its context
   - Relevant grammar points or usage notes
   - 1-2 example sentences in ${targetLanguage} demonstrating how to use this phrase or construction

Keep the explanation concise and focused on helping the user understand and use the selected text.`;
}

/**
 * Generates an explanation for selected text using the LLM.
 * Returns translation and contextual explanation with examples.
 *
 * @param params - Object containing selection and context
 * @param settings - User settings containing API key, model, and languages
 * @returns Explanation object with translation and explanation
 */
export async function explain(
  params: { selection: string; context: string },
  settings: Settings
): Promise<Explanation> {
  const client = getOpenAIClient(settings);
  const { selection, context } = params;

  try {
    const systemPrompt = buildExplanationPrompt(
      settings.nativeLanguage,
      settings.targetLanguage
    );

    const userPrompt = `Here is the full text:
"""
${context}
"""

Please explain this selected portion:
"""
${selection}
"""`;

    const completion = await client.chat.completions.parse({
      model: settings.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: zodResponseFormat(ExplanationSchema, "explanation"),
    });

    const message = completion.choices[0]?.message;

    if (message?.refusal) {
      throw new ExplanationError(message.refusal);
    }

    const parsed = message?.parsed;
    if (!parsed) {
      throw new ExplanationError("No explanation received from the model");
    }

    return {
      translation: parsed.translation,
      explanation: parsed.explanation,
    };
  } catch (error) {
    if (error instanceof ExplanationError) {
      throw error;
    }
    throw new ExplanationError(
      error instanceof Error ? error.message : "Explanation request failed",
      { cause: error }
    );
  }
}
