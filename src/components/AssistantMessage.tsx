import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Volume2, Loader2, Square, AlertCircle, Copy, Check } from 'lucide-react';
import type { AssistantMessage as AssistantMessageType } from '../types';
import { Card, CardContent } from './ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useSpeech, type SpeechState } from '../hooks/useSpeech';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from './ui/button';

interface AssistantMessageProps {
  message: AssistantMessageType;
}

interface SpeechButtonProps {
  onClick: () => void;
  state: SpeechState;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      title={copied ? "Copied" : "Copy"}
      className="h-7 px-2"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}

function SpeechButton({ onClick, state }: SpeechButtonProps) {
  let icon;
  let variant: "ghost" | "destructive" = "ghost";
  let title = "Play";

  if (state === 'loading') {
    icon = <Loader2 className="w-4 h-4 animate-spin" />;
    title = "Loading";
  } else if (state === 'error') {
    icon = <AlertCircle className="w-4 h-4" />;
    variant = "destructive";
    title = "Error";
  } else if (state === 'playing') {
    icon = <Square className="w-4 h-4" />;
    title = "Stop";
  } else {
    icon = <Volume2 className="w-4 h-4" />;
    title = "Play";
  }

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      disabled={state === "loading"}
      title={title}
      className="h-7 px-2"
    >
      {icon}
    </Button>
  );
}

function AssistantMessage({ message }: AssistantMessageProps) {
  const [isCorrectionExplanationExpanded, setIsCorrectionExplanationExpanded] = useState(true);
  const [isCorrectionTranslationExpanded, setIsCorrectionTranslationExpanded] = useState(false);
  const [isResponseTranslationExpanded, setIsResponseTranslationExpanded] = useState(false);

  const settings = useSettingsStore((state) => state.settings);
  const correctionSpeech = useSpeech(settings);
  const responseSpeech = useSpeech(settings);

  return (
    <div className="flex justify-start mb-4">
      <div className="w-full">
        {message.correction && (
          <Card className="mb-3 bg-muted">
            <div className="px-4 pt-4 text-sm font-medium text-muted-foreground">
              Correction
            </div>
            <CardContent className="px-4 pb-4 space-y-3 pt-0">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Your message:
                </div>
                <div className="bg-card rounded px-3 py-2 text-card-foreground border border-border">
                  {message.correction.original}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-between">
                  <span>Better way to say it:</span>
                  <div className="flex items-center gap-1">
                    <CopyButton text={message.correction.corrected} />
                    <SpeechButton
                      onClick={() =>
                        correctionSpeech.play(message.correction.corrected)
                      }
                      state={correctionSpeech.state}
                    />
                  </div>
                </div>
                <div className="bg-card rounded px-3 py-2 text-card-foreground border border-green-300 border-l-4">
                  {message.correction.corrected}
                </div>
              </div>
              <Collapsible
                open={isCorrectionExplanationExpanded}
                onOpenChange={setIsCorrectionExplanationExpanded}
              >
                <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-accent transition-colors">
                  Explanation
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isCorrectionExplanationExpanded ? "rotate-180" : ""
                      }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="prose prose-sm max-w-none p-4">
                    <ReactMarkdown>{message.correction.explanation}</ReactMarkdown>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible
                open={isCorrectionTranslationExpanded}
                onOpenChange={setIsCorrectionTranslationExpanded}
              >
                <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-accent transition-colors">
                  Translation
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isCorrectionTranslationExpanded ? "rotate-180" : ""
                      }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="prose prose-sm max-w-none p-4">
                    <ReactMarkdown>{message.correction.translation}</ReactMarkdown>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}

        {message.response && (
          <Card>
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Response
                </div>
                <SpeechButton
                  onClick={() => responseSpeech.play(message.response!)}
                  state={responseSpeech.state}
                />
              </div>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{message.response}</ReactMarkdown>
              </div>
            </div>
            <Collapsible
              open={isResponseTranslationExpanded}
              onOpenChange={setIsResponseTranslationExpanded}
            >
              <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-accent transition-colors">
                Translation
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isResponseTranslationExpanded ? "rotate-180" : ""
                    }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="prose prose-sm max-w-none p-4">
                  <ReactMarkdown>{message.translation}</ReactMarkdown>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AssistantMessage;
