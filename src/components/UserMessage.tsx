import ReactMarkdown from 'react-markdown';
import type { UserMessage as UserMessageType } from '../types';
import { Card } from './ui/card';

interface UserMessageProps {
  message: UserMessageType;
}

function UserMessage({ message }: UserMessageProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-end my-8">
      <div className="max-w-[70%]">
        <Card className="bg-primary text-primary-foreground shadow-sm">
          <div className="prose prose-sm max-w-none px-4">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </Card>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default UserMessage;
