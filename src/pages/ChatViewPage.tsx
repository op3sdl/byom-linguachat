import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ChevronLeft, Settings } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useChats } from '../hooks/useChats';
import MessageInput from '../components/MessageInput';
import UserMessage from '../components/UserMessage';
import AssistantMessage from '../components/AssistantMessage';
import ErrorMessage from '../components/ErrorMessage';
import EmptyChatPlaceholder from '../components/EmptyChatPlaceholder';
import NotConfiguredPlaceholder from '../components/NotConfiguredPlaceholder';
import ChatNotFoundPlaceholder from '../components/ChatNotFoundPlaceholder';
import { Button } from '../components/ui/button';
import {
  sendMessage,
  buildChatMessages,
  parseAssistantMessage,
} from '../services/chatService';
import { ParsingError, ChatError } from '../errors';
import type { UserMessage as UserMessageType, ErrorMessage as ErrorMessageType } from '../types';

function ChatViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const settings = useSettingsStore((state) => state.settings);

  const { chats, addMessage } = useChats();

  const [isSending, setIsSending] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isProcessingQueue = useRef(false);

  const activeChat = chats.find((conv) => conv.id === id);
  const settingsLink = `/settings?fromChat=${id}`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isSending]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!id) {
      return
    };

    if (isSending) {
      setMessageQueue((prev) => [...prev, messageText]);
      return;
    }

    if (!activeChat) {
      return;
    }

    setIsSending(true);

    try {
      const userMessage: UserMessageType = {
        id: uuidv4(),
        role: 'user',
        content: messageText,
        createdAt: new Date().toISOString(),
      };
      addMessage(id, userMessage);

      const chatMessages = buildChatMessages(activeChat.messages, messageText, settings);

      let accumulatedResponse = '';
      const assistantMessageId = uuidv4();
      const assistantCreatedAt = new Date().toISOString();

      for await (const chunk of sendMessage(chatMessages, settings)) {
        accumulatedResponse += chunk;
      }

      const parsedMessage = parseAssistantMessage(accumulatedResponse);
      parsedMessage.id = assistantMessageId;
      parsedMessage.createdAt = assistantCreatedAt;

      addMessage(id, parsedMessage);

    } catch (error) {
      console.error('Error sending message:', error);

      let errorMsg: string;
      if (error instanceof ParsingError) {
        errorMsg = 'The AI response was malformed. Please try again.';
      } else if (error instanceof ChatError) {
        errorMsg = error.message;
      } else if (error instanceof Error) {
        errorMsg = error.message;
      } else {
        errorMsg = 'An unexpected error occurred. Please try again.';
      }

      const errorMessage: ErrorMessageType = {
        id: uuidv4(),
        role: 'error',
        content: errorMsg,
        retryContent: messageText,
        createdAt: new Date().toISOString(),
      };
      
      addMessage(id, errorMessage);
    } finally {
      setIsSending(false);
    }
  }, [id, isSending, activeChat, addMessage, settings]);

  useEffect(() => {
    if (!isSending && messageQueue.length > 0 && !isProcessingQueue.current) {
      isProcessingQueue.current = true;
      const nextMessage = messageQueue[0];
      setMessageQueue((prev) => prev.slice(1));

      setTimeout(() => {
        isProcessingQueue.current = false;
        handleSendMessage(nextMessage);
      }, 100);
    }
  }, [isSending, messageQueue, handleSendMessage]);

  function renderContent() {
    if (!activeChat) {
      return <ChatNotFoundPlaceholder onGoToChats={() => navigate("/")} />;
    }

    if (!settings.apiKey.trim()) {
      return <NotConfiguredPlaceholder onGoToSettings={() => navigate(settingsLink)} />;
    }

    if (activeChat.messages.length === 0 && !isSending) {
      return (
        <EmptyChatPlaceholder
          targetLanguage={settings.targetLanguage}
          nativeLanguage={settings.nativeLanguage}
        />
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        {activeChat.messages.map((message) =>
          message.role === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : message.role === "error" ? (
            <ErrorMessage
              key={message.id}
              message={message.content}
              onRetry={message.retryContent ? () => handleSendMessage(message.retryContent!) : undefined}
            />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          ),
        )}
        {isSending && (
          <div className="mb-6">
            <div className="w-full bg-card rounded-lg shadow-sm border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header bar */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="flex-shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 text-center font-semibold text-foreground truncate px-2">
            {activeChat?.title}
          </h1>
          <Button variant="ghost" size="icon" aria-label="Settings" asChild>
            <Link to={settingsLink}>
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderContent()}
      </div>

      {/* Message input */}
      <MessageInput
        onSend={handleSendMessage}
        disabled={false}
        isLoading={isSending}
      />
    </div>
  );
}

export default ChatViewPage;
