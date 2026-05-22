import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

function MessageInput({ onSend, disabled = false, isLoading = false }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isLoading) {
      onSend(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
      setMessage(newValue);
  };

  return (
    <div className="border-t border-border bg-card p-4 md:px-8 overflow-y-auto [scrollbar-gutter:stable]">
      <div className="max-w-4xl mx-auto flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            autoFocus
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder="Ctrl+Enter to send..."
            className="resize-none min-h-16 md:min-h-12 text-base"
          />
        </div>
        <Button
          type="button"
          onClick={handleSend}
          onPointerDown={(e) => e.preventDefault()}
          disabled={disabled || isLoading || !message.trim()}
          className="px-6 h-16 md:h-12"
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default MessageInput;
