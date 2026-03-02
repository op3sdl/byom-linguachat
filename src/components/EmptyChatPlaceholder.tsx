interface EmptyChatPlaceholderProps {
  targetLanguage: string;
  nativeLanguage: string;
}

function EmptyChatPlaceholder({ targetLanguage, nativeLanguage }: EmptyChatPlaceholderProps) {
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Ready to practice {targetLanguage}?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Start typing a message in {targetLanguage} below and I'll help you improve!
          </p>
        </div>
        <div className="bg-muted rounded-lg p-6 text-left">
          <h3 className="font-semibold text-foreground mb-3">How it works:</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Write a message in {targetLanguage} (mistakes are okay!)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>I'll correct any errors and explain what could be better</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>I'll respond naturally in {targetLanguage} to continue the chat</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <span>I'll translate my response to {nativeLanguage} to help you understand</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default EmptyChatPlaceholder;
