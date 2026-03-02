import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DEFAULT_SETTINGS, useSettingsStore } from '../store/settingsStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const settingsSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiBaseUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  model: z.string().min(1, 'Model is required'),
  nativeLanguage: z.string().min(1, 'Native language is required'),
  targetLanguage: z.string().min(1, 'Target language is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

function SettingsPage() {
  const [searchParams] = useSearchParams();
  const fromChatId = searchParams.get('fromChat');
  const navigate = useNavigate();

  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const backLink = fromChatId ? `/chat/${fromChatId}` : '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey: settings.apiKey,
      apiBaseUrl: settings.apiBaseUrl ?? '',
      model: settings.model,
      nativeLanguage: settings.nativeLanguage,
      targetLanguage: settings.targetLanguage,
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings({
      ...data,
      apiBaseUrl: data.apiBaseUrl || undefined,
    });
    setSaved(true);
    setTimeout(() => navigate(backLink), 1000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={backLink} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />Back
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure your API key and language preferences to start using
              LinguaChat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">
                  OpenAI API Key <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    id="apiKey"
                    {...register('apiKey')}
                    placeholder="sk-..."
                    className="pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                  >
                    {showApiKey ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Show
                      </>
                    )}
                  </Button>
                </div>
                {errors.apiKey && (
                  <p className="text-sm text-destructive">{errors.apiKey.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally in your browser and never sent
                  to any server except OpenAI or the endpoint you provide.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiBaseUrl">API Base URL (optional)</Label>
                <Input
                  type="text"
                  id="apiBaseUrl"
                  {...register('apiBaseUrl')}
                  placeholder={DEFAULT_SETTINGS.apiBaseUrl}
                />
                {errors.apiBaseUrl && (
                  <p className="text-sm text-destructive">{errors.apiBaseUrl.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  For OpenAI-compatible providers like Ollama or Together AI.
                  Leave empty for default OpenAI endpoint.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">
                  Model <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="model"
                  {...register('model')}
                  placeholder={DEFAULT_SETTINGS.model}
                />
                {errors.model && (
                  <p className="text-sm text-destructive">{errors.model.message}</p>
                )}
                <p className="text-sm text-muted-foreground">Model to use.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nativeLanguage">
                  I will be writing in <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="nativeLanguage"
                  {...register('nativeLanguage')}
                  placeholder={DEFAULT_SETTINGS.nativeLanguage}
                />
                {errors.nativeLanguage && (
                  <p className="text-sm text-destructive">{errors.nativeLanguage.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  What languages LLM should expect from you.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetLanguage">
                  I am learning <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="text"
                  id="targetLanguage"
                  {...register('targetLanguage')}
                  placeholder={DEFAULT_SETTINGS.targetLanguage}
                />
                {errors.targetLanguage && (
                  <p className="text-sm text-destructive">{errors.targetLanguage.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  The language LLM will teach you.
                </p>
              </div>

              <div className="flex items-center justify-end gap-4 pt-4">
                {saved && (
                  <span className="text-sm font-medium text-green-600">
                    Settings saved successfully!
                  </span>
                )}
                <Button type="submit">Save Settings</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SettingsPage;
