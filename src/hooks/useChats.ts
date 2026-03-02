import { useMemo } from 'react';
import { useChatsStore } from '../store/chatsStore';
import type { Chat, Message } from '../types';

interface UseChatsReturn {
  chats: Chat[];
  createChat: (nativeLanguage: string, targetLanguage: string) => Chat;
  deleteChat: (id: string) => void;
  addMessage: (chatId: string, message: Message) => void;
}

export function useChats(): UseChatsReturn {
  const rawChats = useChatsStore((state) => state.chats);
  const createChat = useChatsStore((state) => state.createChat);
  const deleteChat = useChatsStore((state) => state.deleteChat);
  const addMessage = useChatsStore((state) => state.addMessage);

  const chats = useMemo(
    () => [...rawChats].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [rawChats]
  );

  return { chats, createChat, deleteChat, addMessage };
}
