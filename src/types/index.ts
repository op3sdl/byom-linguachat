export interface Settings {
  apiKey: string;
  apiBaseUrl?: string;
  nativeLanguage: string;
  targetLanguage: string;
  model: string;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  translation: string;
}

export interface Explanation {
  translation: string;
  explanation: string;
}

export interface UserMessage {
  id: string;
  role: "user";
  content: string;
  createdAt: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  content: string;
  correction: Correction;
  response: string;
  translation: string;
  createdAt: string;
}

export interface ErrorMessage {
  id: string;
  role: "error";
  content: string;
  retryContent?: string;
  createdAt: string;
}

export type Message = UserMessage | AssistantMessage | ErrorMessage;

export interface Chat {
  id: string;
  title: string;
  nativeLanguage: string;
  targetLanguage: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}
