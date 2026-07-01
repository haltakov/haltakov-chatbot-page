---
id: chatbot-page
question: What is chatbot-page?
keywords:
  - chatbot page
  - chatbot-page
  - this site
  - how is this built
  - open source
  - rag
  - vector store
  - llm
  - canned answers
---

This site is built with **chatbot-page** — a free and open-source tool I made for building a personal or company homepage that works like a chatbot.

Instead of scrolling through a traditional portfolio, visitors just ask questions and get answers. Answers can come from three sources, mixed however you like:

- **Canned answers** — curated questions and answers written as Markdown files. Fast, free, and fully under your control (that's what you're reading right now).
- **A real LLM** — unknown questions stream through an actual model, so visitors can ask open-ended things.
- **A RAG vector store** — ground the model in your own documents so it answers from your real content instead of guessing.

It also ships with optional visitor notifications (e.g. Telegram), a contact form, conversation history, and a first-launch intro modal.

The nice thing is you can start with canned answers only — no API keys, no cost — and add an LLM or a vector store later when you want richer, open-ended Q&A. It's a reusable React package, so you can drop it into your own site too.

It's on [GitHub](https://github.com/haltakov/chatbot-page) if you want to try it or take a look under the hood.
