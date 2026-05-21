import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DEFAULT_SETTINGS, useSettingsStore } from '../store/settingsStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import AppHeader from '../components/AppHeader';
import BackButton from '../components/BackButton';

const settingsSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  apiBaseUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  model: z.string().min(1, 'Model is required'),
  nativeLanguage: z.string().min(1, 'Native language is required'),
  targetLanguage: z.string().min(1, 'Target language is required'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

function SettingsPage() {
  const navigate = useNavigate();
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const [showApiKey, setShowApiKey] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    mode: 'onChange',
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
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader
        title="Settings"
        leftAction={<BackButton />}
      >
        <Button
          type="submit"
          form="settings-form"
          disabled={!isValid}
        >
          Save
        </Button>
      </AppHeader>

      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          <form id="settings-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">Languages</h2>

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
            </section>

            <section className="space-y-4">
              <h2 className="text-base font-semibold text-foreground">LLM API Settings</h2>

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
            </section>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
