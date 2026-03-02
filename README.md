# LinguaChat

A local-only, BYOM (Bring Your Own Model) UI for chat-based language learning with LLMs.

No accounts, no servers, no data collection — just you and the model of your choice.

LinguaChat connects directly to the OpenAI API (or any compatible provider) from your browser.

Your API key never leaves your device and is stored exclusively in your browser's local storage.


## Features

- Chat-based language practice with any OpenAI-compatible LLM
- Configurable system prompts, model selection, and provider endpoint
- Speech synthesis for listening practice (OpenAI-compatible TTS required)
- Fully client-side — no backend, no telemetry
- Responsive design for desktop and mobile

<img width="200" alt="Chat list" src="https://github.com/user-attachments/assets/58cb654f-0c49-4a9f-bad3-8a933eb1398f" />
<img width="200" alt="Chat view" src="https://github.com/user-attachments/assets/f2ece28f-a2df-4222-a2e0-0dd098c18d34" />
<img width="200" alt="Settings" src="https://github.com/user-attachments/assets/68ae9553-ffba-4f78-9866-ee1a6bc634a4" />


## Deploy Your Own

LinguaChat is a static single-page application that can be hosted anywhere. The easiest way to get your own instance is [Cloudflare Workers](https://workers.cloudflare.com/):

1. Fork or clone this repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Authenticate with Cloudflare (one-time):
   ```bash
   pnpm dlx wrangler login
   ```
4. Deploy:
   ```bash
   pnpm run deploy
   ```
   This builds the project and deploys it to Cloudflare Workers using the configuration in `wrangler.jsonc`.

## Development & Contributing

### Tech Stack

- **React 19** with **TypeScript** — UI framework
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — styling
- **Radix UI** / **shadcn/ui** — component primitives
- **Zustand** — state management
- **React Hook Form** + **Zod** — form handling and validation
- **OpenAI SDK** — LLM API client
- **React Router** — client-side routing
- **React Markdown** — message rendering

### Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server with hot reload
pnpm run dev

# Build for production
pnpm run build
```

### Project Structure

```
src/
  components/   # Reusable UI components
  pages/        # Route-level page components
  services/     # API and speech service clients
  store/        # Zustand stores (chats, settings)
  hooks/        # Custom React hooks
  types/        # Shared TypeScript types
  utils/        # Helper utilities
```
