import { useState, useRef, useCallback, useEffect } from "react";
import { getSpeech } from "../services/speechService";
import type { Settings } from "../types";

export type SpeechState = "idle" | "loading"  | "playing"  | "error";

interface UseSpeechReturn {
  play: (text: string) => void;
  stop: () => void;
  state: SpeechState;
}

export function useSpeech(settings: Settings): UseSpeechReturn {
  const [state, setState] = useState<SpeechState>("idle");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const listenerAbortRef = useRef<AbortController | null>(null);

  const _cleanup = useCallback(() => {
    if (listenerAbortRef.current) {
      listenerAbortRef.current.abort();
      listenerAbortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    _cleanup();
    setState("idle");
  }, [_cleanup]);

  const play = useCallback(
    async (text: string) => {
      if (state === "loading") {
        return;
      }

      if (state === "playing") {
        stop();
        return;
      }

      setState("loading");

      try {
        const audioBlob = await getSpeech(text, settings);
        const blobUrl = URL.createObjectURL(audioBlob);
        blobUrlRef.current = blobUrl;

        const audio = new Audio(blobUrl);
        audioRef.current = audio;

        const controller = new AbortController();
        listenerAbortRef.current = controller;

        audio.addEventListener("ended", () => {
          stop();
        }, { signal: controller.signal });

        audio.addEventListener("error", (err) => {
          console.error("Audio error", err);
          _cleanup();
          setState("error");
        }, { signal: controller.signal });

        await audio.play();
        setState("playing");
      } catch (err) {
        console.error("Speech error", err)
        _cleanup();
        setState("error");
      }
    },
    [state, settings, stop, _cleanup]
  );

  useEffect(() => {
    return () => {
      _cleanup();
    };
  }, [_cleanup]);

  return {
    play,
    stop,
    state,
  };
}
