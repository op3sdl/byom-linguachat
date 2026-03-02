import { Button } from './ui/button';

interface ChatNotFoundPlaceholderProps {
  onGoToChats: () => void;
}

function ChatNotFoundPlaceholder({ onGoToChats }: ChatNotFoundPlaceholderProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-2xl text-center text-muted-foreground px-4">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Chat not found
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            This chat doesn't exist or may have been deleted.
          </p>
        </div>
        <Button variant="secondary" onClick={onGoToChats}>
          Go to chats
        </Button>
      </div>
    </div>
  );
}

export default ChatNotFoundPlaceholder;
