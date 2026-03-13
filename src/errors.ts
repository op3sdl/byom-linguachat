/**
 * Base application error. All custom errors extend this class,
 * allowing consumers to distinguish app-level errors from unexpected ones.
 */
export class AppError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "AppError";
  }
}

/**
 * Thrown when the LLM response cannot be parsed into the expected JSON structure.
 */
export class ParsingError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ParsingError";
  }
}

/**
 * Thrown when the chat / LLM completion request fails.
 * Proxies the underlying API error message.
 */
export class ChatError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ChatError";
  }
}

/**
 * Thrown when the text-to-speech request fails.
 * Proxies the underlying API error message.
 */
export class SpeechError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SpeechError";
  }
}

/**
 * Thrown when the explanation request fails.
 * Proxies the underlying API error message.
 */
export class ExplanationError extends AppError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExplanationError";
  }
}
