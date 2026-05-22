import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { HelpCircle, Loader2, Volume2, Square, CheckCircle, BookOpen } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { useExplanationsStore } from '../store/explanationsStore';
import { useChats } from '../hooks/useChats';
import { useSpeech } from '../hooks/useSpeech';
import MessageInput from '../components/MessageInput';
import UserMessage from '../components/UserMessage';
import AssistantMessage from '../components/AssistantMessage';
import ErrorMessage from '../components/ErrorMessage';
import EmptyChatPlaceholder from '../components/EmptyChatPlaceholder';
import NotConfiguredPlaceholder from '../components/NotConfiguredPlaceholder';
import ChatNotFoundPlaceholder from '../components/ChatNotFoundPlaceholder';
import AppHeader from '../components/AppHeader';
import ExplanationsSidebar from '../components/ExplanationsSidebar';
import { Button } from '../components/ui/button';
import {
  sendMessage,
  buildChatMessages,
} from '../services/chatService';
import { explain } from '../services/explanationService';
import { ChatError } from '../errors';
import type { UserMessage as UserMessageType, ErrorMessage as ErrorMessageType } from '../types';

function ChatViewPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const settings = useSettingsStore((state) => state.settings);

  const { chats, addMessage } = useChats();

  const [explanationsSidebarOpen, setExplanationsSidebarOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isProcessingQueue = useRef(false);

  const activeChat = chats.find((conv) => conv.id === id);
  const [explainSuccess, setExplainSuccess] = useState(false);

  const speech = useSpeech(settings);

  const explanationSelection = useExplanationsStore((state) => state.explanationSelection);
  const explanationSelectionContext = useExplanationsStore((state) => state.explanationSelectionContext);
  const isExplanationLoading = useExplanationsStore((state) => state.isLoading);
  const setExplanationLoading = useExplanationsStore((state) => state.setLoading);
  const setExplanation = useExplanationsStore((state) => state.setExplanation);
  const setExplanationError = useExplanationsStore((state) => state.setError);
  const saveExplanation = useExplanationsStore((state) => state.saveExplanation);
  const resetExplanation = useExplanationsStore((state) => state.reset);
  const hasNewExplanation = useExplanationsStore((state) => state.hasNewExplanation);
  const clearNewFlag = useExplanationsStore((state) => state.clearNewFlag);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isSending]);

  useEffect(() => {
    if (explanationsSidebarOpen) {
      clearNewFlag();
    }
  }, [explanationsSidebarOpen, clearNewFlag]);

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

      const parsedMessage = await sendMessage(chatMessages, settings);

      addMessage(id, parsedMessage);

    } catch (error) {
      console.error('Error sending message:', error);

      let errorMsg: string;
      if (error instanceof ChatError) {
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

  const handleExplain = useCallback(async () => {
    if (!explanationSelection || !explanationSelectionContext) {
      return;
    }

    setExplanationLoading(true);
    setExplainSuccess(false);

    try {
      const result = await explain(
        { selection: explanationSelection, context: explanationSelectionContext },
        settings
      );
      setExplanation(result);
      setExplanationError(null);
      saveExplanation();
      setExplainSuccess(true);
      setTimeout(() => {
        setExplainSuccess(false);
        resetExplanation();
      }, 2000);
    } catch (error) {
      console.error('Error generating explanation:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to generate explanation';
      setExplanationError(errorMsg);
    } finally {
      setExplanationLoading(false);
    }
  }, [
    explanationSelection,
    explanationSelectionContext,
    settings,
    setExplanationLoading,
    setExplanation,
    setExplanationError,
    saveExplanation,
    resetExplanation,
  ]);

  function renderContent() {
    if (!activeChat) {
      return <ChatNotFoundPlaceholder onNewChat={() => navigate("/")} />;
    }

    if (!settings.apiKey.trim()) {
      return <NotConfiguredPlaceholder onGoToSettings={() => navigate("/settings")} />;
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
      <AppHeader title={activeChat?.title ?? ""}>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Explain selection"
          disabled={!explanationSelection || isExplanationLoading}
          onClick={handleExplain}
        >
          {isExplanationLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : explainSuccess ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <HelpCircle className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Read aloud"
          disabled={!explanationSelection || speech.state === "loading"}
          onClick={() => explanationSelection && speech.play(explanationSelection)}
        >
          {speech.state === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : speech.state === "playing" ? (
            <Square className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Saved explanations"
            onClick={() => setExplanationsSidebarOpen(true)}
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          {hasNewExplanation && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full pointer-events-none" />
          )}
        </div>
      </AppHeader>
      <ExplanationsSidebar
        open={explanationsSidebarOpen}
        onOpenChange={setExplanationsSidebarOpen}
      />

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
