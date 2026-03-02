import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-full">
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1 flex items-start justify-between gap-3">
            <span className="text-sm">{message}</span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
