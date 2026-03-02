import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChevronDown, Volume2, Loader2, Square, AlertCircle } from 'lucide-react';
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
  const [isCorrectionExpanded, setIsCorrectionExpanded] = useState(true);
  const [isTranslationExpanded, setIsTranslationExpanded] = useState(false);

  const settings = useSettingsStore((state) => state.settings);
  const correctionSpeech = useSpeech(settings);
  const responseSpeech = useSpeech(settings);

  return (
    <div className="flex justify-start mb-4">
      <div className="w-full">
        {message.correction && (
          <Card className="mb-3 bg-muted">
            <Collapsible
              open={isCorrectionExpanded}
              onOpenChange={setIsCorrectionExpanded}
            >
              <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent transition-colors">
                Correction
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isCorrectionExpanded ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
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
                      <SpeechButton
                        onClick={() =>
                          correctionSpeech.play(message.correction.corrected)
                        }
                        state={correctionSpeech.state}
                      />
                    </div>
                    <div className="bg-card rounded px-3 py-2 text-card-foreground border border-green-300 border-l-4">
                      {message.correction.corrected}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Explanation:
                    </div>
                    <div className="text-foreground text-sm">
                      {message.correction.explanation}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* Response in target language */}
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
            <div>
              <Collapsible
                open={isTranslationExpanded}
                onOpenChange={setIsTranslationExpanded}
              >
                <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-accent transition-colors">
                  Translation
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isTranslationExpanded ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="prose prose-sm max-w-none p-4">
                    <ReactMarkdown>{message.translation}</ReactMarkdown>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default AssistantMessage;
