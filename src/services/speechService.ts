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

async function fetchFromAPI(text: string, settings: Settings): Promise<Blob> {
  try {
    const client = getOpenAIClient(settings);

    const response = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      input: text,
      voice: "coral",
      instructions: `Speak in ${settings.targetLanguage} with correct native pronunciation. Speak clearly at a slow pace, suitable for a language learner.`,
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

export async function getSpeech(text: string, settings: Settings): Promise<Blob> {
  if (typeof caches === "undefined") {
    return fetchFromAPI(text, settings);
  }

  const cacheKey = `/speech/${encodeURIComponent(settings.targetLanguage)}/${encodeURIComponent(text)}`;
  let cache: Cache | null = null;

  try {
    cache = await caches.open("speech-cache");
    const hit = await cache.match(cacheKey);
    if (hit) return hit.blob();
  } catch {
    cache = null;
  }

  const blob = await fetchFromAPI(text, settings);

  if (cache) {
    try {
      await cache.put(cacheKey, new Response(blob));
    } catch {
      // Cache write failed; blob is still returned
    }
  }

  return blob;
}
