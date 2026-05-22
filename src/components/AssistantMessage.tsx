import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Volume2, Loader2, Square, AlertCircle, Copy, Check } from 'lucide-react';
import type { AssistantMessage as AssistantMessageType } from '../types';
import { Card } from './ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useSpeech, type SpeechState } from '../hooks/useSpeech';
import { useSettingsStore } from '../store/settingsStore';
import SelectableText from './SelectableText';
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
  const [isCorrectionExplanationExpanded, setIsCorrectionExplanationExpanded] = useState(false);
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
            <div className="px-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Correction</span>
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
              <SelectableText context={message.correction.corrected} className="text-green-300">
                {message.correction.corrected}
              </SelectableText>
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
                <SelectableText context={message.correction.explanation} className="prose prose-sm max-w-none p-4">
                  <ReactMarkdown>{message.correction.explanation}</ReactMarkdown>
                </SelectableText>
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
                <SelectableText context={message.correction.translation} className="prose prose-sm max-w-none p-4">
                  <ReactMarkdown>{message.correction.translation}</ReactMarkdown>
                </SelectableText>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {message.response && (
          <Card>
            <div className="px-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Response
                </div>
                <SpeechButton
                  onClick={() => responseSpeech.play(message.response!)}
                  state={responseSpeech.state}
                />
              </div>
              <SelectableText context={message.response || ''} className="prose prose-sm max-w-none">
                <ReactMarkdown>{message.response}</ReactMarkdown>
              </SelectableText>
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
                <SelectableText context={message.translation || ''} className="prose prose-sm max-w-none p-4">
                  <ReactMarkdown>{message.translation}</ReactMarkdown>
                </SelectableText>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AssistantMessage;
