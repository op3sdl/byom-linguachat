interface EmptyChatPlaceholderProps {
  targetLanguage: string;
  nativeLanguage: string;
}

function EmptyChatPlaceholder({ targetLanguage, nativeLanguage }: EmptyChatPlaceholderProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="max-w-2xl text-left text-muted-foreground px-4">
        <h3 className="font-semibold text-foreground mb-3">How it works:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>
              Write a message in {targetLanguage} (mistakes are okay!)
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>
              I'll correct any errors and explain what could be better
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>
              I'll respond naturally in {targetLanguage} to continue the chat
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>
              I'll translate my response to {nativeLanguage} to help you
              understand
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default EmptyChatPlaceholder;
