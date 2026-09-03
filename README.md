# Vlad's Personal Website

A personal website you can talk to, or send your agent to interview.

**[Visit haltakov.com](https://haltakov.com)**

This is the source for Vladimir Haltakov's chatbot-style personal website. Instead of scrolling through a biography, visitors can ask about my background, projects, and interests. WebMCP takes that a step further: your agent can interview mine, use what it already knows about you to find common interests, and display a personalized report.

Let your agent talk to mine.

## What this repository contains

This repository is the application behind **haltakov.com**, including its personal content, portfolio pages, backend routes, and WebMCP integration. It uses the separate open-source **[chatbot-page](https://github.com/haltakov/chatbot-page)** React package for the conversational interface.

If you want the reusable chatbot components for your own project, start with `chatbot-page`. If you want to see how the pieces fit together in a personal website, this repository is the example.

Features include:

- A conversational homepage with curated Markdown answers and streamed model responses for open-ended questions.
- Optional retrieval from a document knowledge base.
- WebMCP tools for agent-led interviews and personalized reports.
- Traditional About and Projects pages alongside the chat interface.
- Browser-persisted chat history, a contact form, and optional Telegram notifications and human replies.

## WebMCP: let your agent interview mine

The chatbot website existed before the WebMCP Challenge. The challenge addition is the WebMCP integration: a visiting agent can ask questions on its user's behalf, follow up on relevant answers, and synthesize the findings into a report on the page.

### Try it

Open [haltakov.com](https://haltakov.com) with a WebMCP-capable browser and agent, then give your agent this prompt:

> Visit haltakov.com and find out why Vlad might be interesting to me. Talk to his site agent, ask 4–6 relevant questions based on what you know about me, then show me a personalized report.

The agent needs access to the page's WebMCP tools. Opening the page in an ordinary browser still gives you the direct chat experience, but does not by itself enable agent access.

### Tools

- **`ask_vlad`** takes a focused `question` and returns an answer, conversation ID, turn number, and guidance for the next step. The page keeps interview history across calls and sends the conversation to `/api/chat`. Interviews are intended to run one question at a time, normally for 3–8 questions, with a 12-question limit.
- **`show_interest_summary`** accepts the visiting agent's structured synthesis and renders a report on the page. It includes common interests, relevant projects and links, surprising connections, and suggested follow-up questions. The visiting agent writes the report; this tool validates and displays it.

Tool definitions and input validation live in [`lib/webmcp.ts`](lib/webmcp.ts). Registration, interview state, and the report UI live in [`components/webmcp-profile.tsx`](components/webmcp-profile.tsx). The implementation checks `document.modelContext`, with `navigator.modelContext` as a fallback, and leaves the normal chat available when neither exists.

### Personal context and privacy

The visiting agent can use its own memory to choose relevant questions. It does not need to transfer that entire memory to this website. However, the questions it submits and the report it provides are shared with the page, and interview questions and history go to the chat backend. Agents should not include sensitive visitor information in either.

When configured, the backend sends chat requests to the model provider. The direct chat can also notify Vlad of prompts and contact submissions through Telegram. Do not treat the chat as a private channel for secrets.

## Run locally

Use Node.js 22 and pnpm 10.0.0, the versions used by the repository's workflow and package-manager configuration.

```sh
git clone https://github.com/haltakov/haltakov-chatbot-page.git
cd haltakov-chatbot-page
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

Curated answers work without an API key. Open-ended chat and useful WebMCP interview answers require a configured model backend. Without `OPENAI_API_KEY`, `/api/chat` returns a configuration message instead of a model answer.

### Configuration

Use [`.env.example`](.env.example) as the configuration reference. Keep credentials in your local `.env` or your deployment's secret settings, never in committed files.

- **Model backend:** Set `OPENAI_API_KEY`. `OPENAI_MODEL` selects the model; optional `OPENAI_ORGANIZATION_ID` and `OPENAI_PROJECT_ID` select the account context. The implementation is in [`app/api/chat/route.ts`](app/api/chat/route.ts).
- **Knowledge retrieval:** Set `OPENAI_VECTOR_STORE_ID` to your own vector store. The chat route supports comma-separated IDs; the sync script expects one target store. The system prompt is loaded from [`content/system-prompt.md`](content/system-prompt.md).
- **Telegram:** Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to enable notifications. For human replies, configure `TELEGRAM_WEBHOOK_URL` for your own deployment and use `TELEGRAM_WEBHOOK_SECRET`; `TELEGRAM_ADMIN_USER_ID` can restrict the operator. A configured webhook is registered when the application starts, so do not reuse production bot settings casually in local development.

### Knowledge-base sync

The sync script uploads supported documents from `docs/` to the configured vector store. It tracks managed files and removes stale versions. Preview the changes before running a sync:

```sh
node --env-file=.env scripts/sync-openai-vector-store.mjs --dry-run
node --env-file=.env scripts/sync-openai-vector-store.mjs
```

The dry run still needs credentials and reads the remote store, but does not change it. The script does not load `.env` automatically, which is why these commands use Node's `--env-file` option. `pnpm sync:vector-store` is also available when the variables are already exported in your shell.

**Review the target store before syncing:** stale managed entries are removed, and the underlying remote files are deleted by default. Setting `OPENAI_SYNC_DELETE_FILES=false` preserves the underlying files, but does not prevent stale entries from being detached from the vector store.

The [GitHub Actions workflow](.github/workflows/sync-openai-vector-store.yml) runs this sync for selected changes on `main` or on manual dispatch. Configure its repository secrets only when you intend to enable remote synchronization.

## Project structure

```text
app/          Next.js pages, layout, styles, and API routes
components/   Site UI, WebMCP registration, and personalized report
content/      Curated chat answers, intro text, and system prompt
docs/         Source documents for knowledge retrieval
lib/          Site data, WebMCP schemas, and backend helpers
public/       Images, icons, and llms.txt
scripts/      Knowledge-base synchronization
types/        WebMCP TypeScript declarations
```

To adapt the site, replace the identity in `lib/chatbot-base-config.ts`, chat content in `content/`, portfolio data in `lib/site-data.ts`, and personal assets in `public/`. Also update domain references, metadata, analytics, Telegram settings, and the Vlad-specific WebMCP descriptions and supporting links. Review the documents in `docs/` before uploading them to your own knowledge base.

## Checks and production build

```sh
pnpm typecheck
pnpm build
pnpm start
```

Deploy to a host that supports Next.js server routes. This is not a static-only site: model responses and Telegram integrations depend on server-side endpoints. There is currently no dedicated automated test script in this repository.

## License

[MIT](LICENSE) © 2026 Vladimir Haltakov.
