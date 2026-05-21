import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useExplanationsStore } from '../store/explanationsStore';
import AppHeader from '../components/AppHeader';
import BackButton from '../components/BackButton';
import { Button } from '@/components/ui/button';

function ExplanationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const savedExplanations = useExplanationsStore((state) => state.savedExplanations);

  const explanation = savedExplanations.find((e) => e.id === id) ?? null;

  if (!explanation) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <AppHeader title="Explanation" leftAction={<BackButton />} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground px-4">
            <h2 className="text-xl font-semibold text-foreground mb-3">Explanation not found</h2>
            <p className="mb-6">This explanation doesn't exist or may have been deleted.</p>
            <Button variant="secondary" onClick={() => navigate('/')}>
              New chat
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const title =
    explanation.selection.length > 50
      ? explanation.selection.substring(0, 50) + '...'
      : explanation.selection;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader title={title} leftAction={<BackButton />} />

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <blockquote className="border-l-4 border-border pl-4 text-lg font-medium text-foreground">
            {explanation.selection}
          </blockquote>

          <div>
            <h2 className="font-semibold text-base mb-2">Translation</h2>
            <div className="text-sm text-foreground prose prose-sm max-w-none">
              <ReactMarkdown>{explanation.explanation.translation}</ReactMarkdown>
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-base mb-2">Explanation</h2>
            <div className="text-sm text-foreground prose prose-sm max-w-none">
              <ReactMarkdown>{explanation.explanation.explanation}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExplanationViewPage;
