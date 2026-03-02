import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { generateName } from '../utils/generateName';
import type { Chat, Message } from '../types';

const CONVERSATIONS_STORAGE_KEY = 'linguachat_chats';

interface ChatsState {
  chats: Chat[];
  createChat: (nativeLanguage: string, targetLanguage: string) => Chat;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
}

export const useChatsStore = create<ChatsState>()(
  persist(
    (set) => ({
      chats: [],
      createChat: (nativeLanguage, targetLanguage) => {
        const now = new Date();
        const newChat: Chat = {
          id: uuidv4(),
          title: generateName(),
          nativeLanguage,
          targetLanguage,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          messages: [],
        };
        set((state) => ({ chats: [...state.chats, newChat] }));
        return newChat;
      },
      deleteChat: (id) => {
        set((state) => ({
          chats: state.chats.filter((conv) => conv.id !== id),
        }));
      },
      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((conv) => {
            if (conv.id === chatId) {
              return {
                ...conv,
                messages: [...conv.messages, message],
                updatedAt: new Date().toISOString(),
              };
            }
            return conv;
          }),
        }));
      },
    }),
    {
      name: CONVERSATIONS_STORAGE_KEY,
    }
  )
);
