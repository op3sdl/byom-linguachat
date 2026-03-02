import OpenAI from "openai";
import type { Settings } from "../types";
import { SpeechError } from "../errors";

function getOpenAIClient(settings: Settings): OpenAI {
  return new OpenAI({
    apiKey: settings.apiKey,
    baseURL: settings.apiBaseUrl,
    dangerouslyAllowBrowser: true,
  });
}

export async function getSpeech(text: string, settings: Settings): Promise<Blob> {
  try {
    const client = getOpenAIClient(settings);

    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      input: text,
      voice: "coral",
      instructions: "Speak clearly at a slow pace, suitable for a language learner",
      response_format: "mp3",
    });

    const arrayBuffer = await response.arrayBuffer();
    return new Blob([arrayBuffer], { type: "audio/mpeg" });
  } catch (error) {
    throw new SpeechError(
      error instanceof Error ? error.message : "Speech generation failed",
      { cause: error }
    );
  }
}
