export type ProjectLink = {
  label: string
  href: string
}

export type Project = {
  slug: string
  name: string
  category: string
  summary: string
  metaDescription?: string
  description: string[]
  links: ProjectLink[]
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  schemaCategory: string
}

export const projects: Project[] = [
  {
    slug: "simplepost",
    name: "SimplePost",
    category: "Social publishing",
    summary:
      "An AI-native social media scheduler that publishes from ChatGPT, Claude, and other assistants.",
    metaDescription:
      "SimplePost is an AI-native social media scheduler for drafting, previewing, scheduling, and publishing from ChatGPT, Claude, and other assistants.",
    description: [
      "SimplePost connects the AI assistant you already use to your social accounts. You can draft, preview, schedule, and publish without moving the conversation to another AI writing tool.",
      "It supports ten social platforms and is also available to developers through an MCP server, CLI, API, and SDK.",
    ],
    links: [
      { label: "Visit SimplePost", href: "https://simplepost.social" },
      { label: "Developer platform", href: "https://simplepost.dev" },
      { label: "Source code", href: "https://github.com/simple-post/core" },
    ],
    image: {
      src: "https://creafexlab.com/products/simple-post.jpg",
      alt: "The SimplePost website",
      width: 1440,
      height: 900,
    },
    schemaCategory: "BusinessApplication",
  },
  {
    slug: "simple-muscle",
    name: "Simple Muscle",
    category: "Fitness",
    summary:
      "An iPhone workout tracker that connects your workouts and training history to the AI assistant you already use.",
    description: [
      "Simple Muscle is a focused workout tracker for iPhone. It handles plans, exercises, logged sets, rest timers, and training history.",
      "Its MCP connection lets compatible assistants such as ChatGPT and Claude work with that structured data when you want help creating or updating a plan.",
    ],
    links: [
      { label: "Visit Simple Muscle", href: "https://simplemuscle.ai" },
    ],
    image: {
      src: "https://creafexlab.com/products/simple-muscle.jpg",
      alt: "The Simple Muscle website and iPhone app",
      width: 1440,
      height: 900,
    },
    schemaCategory: "HealthApplication",
  },
  {
    slug: "simple-unmark",
    name: "Simple Unmark",
    category: "AI text tools",
    summary:
      "A web app that removes hidden Unicode artifacts and rewrites AI text to reduce statistical watermark patterns.",
    metaDescription:
      "Simple Unmark removes hidden Unicode artifacts from AI text and rewrites the wording to reduce SynthID-style statistical watermark patterns while preserving meaning.",
    description: [
      "Simple Unmark cleans AI-generated text in one flow. It removes hidden Unicode controls, zero-width characters, unusual spacing, and similar formatting artifacts, then rewrites the text to reduce statistical watermark patterns.",
      "The rewrite is designed to preserve facts, numbers, proper nouns, tone, and intent. It can reduce SynthID-style detection with high likelihood, but no tool can guarantee a result against every current or future detector.",
    ],
    links: [
      { label: "Visit Simple Unmark", href: "https://simpleunmark.com" },
    ],
    image: {
      src: "/images/simple-unmark.jpg",
      alt: "Simple Unmark, a tool for removing watermarks from AI text",
      width: 1440,
      height: 900,
    },
    schemaCategory: "UtilitiesApplication",
  },
  {
    slug: "simple-photo-gallery",
    name: "Simple Photo Gallery",
    category: "Photography",
    summary:
      "A tool for turning a collection of photos into a story-driven gallery that is easy to share.",
    metaDescription:
      "Simple Photo Gallery turns photo collections into story-driven public or private galleries with sections, captions, themes, and easy sharing.",
    description: [
      "Simple Photo Gallery started as an open-source command-line tool I built for my own travel photos.",
      "The hosted version lets anyone upload photos, arrange them into sections, add captions, choose a theme, and share a public or private link.",
    ],
    links: [
      { label: "Visit Simple Photo Gallery", href: "https://simple.photo" },
      {
        label: "California road trip",
        href: "https://simple.photo/haltakov/california-trip/",
      },
      { label: "Source code", href: "https://github.com/SimplePhotoGallery/core" },
    ],
    image: {
      src: "https://creafexlab.com/products/simple-photo-gallery.jpg",
      alt: "The Simple Photo Gallery website showing a travel gallery",
      width: 1440,
      height: 900,
    },
    schemaCategory: "PhotographyApplication",
  },
  {
    slug: "simple-photo-gallery-core",
    name: "Simple Photo Gallery Core",
    category: "Open source · Photography",
    summary:
      "The open-source version of Simple Photo Gallery: a CLI that builds static galleries you can self-host.",
    description: [
      "Simple Photo Gallery Core scans a folder of photos and videos, creates optimized thumbnails, and generates a responsive static gallery website.",
      "It is free and open source under the MIT license. You can use the default theme, create your own theme, and host the generated gallery anywhere.",
    ],
    links: [
      {
        label: "View the source code",
        href: "https://github.com/SimplePhotoGallery/core",
      },
      {
        label: "View the npm package",
        href: "https://www.npmjs.com/package/simple-photo-gallery",
      },
      { label: "Try the hosted version", href: "https://simple.photo" },
    ],
    image: {
      src: "https://raw.githubusercontent.com/SimplePhotoGallery/core/main/docs/images/simple-photo-gallery-demo.jpg",
      alt: "A gallery generated by the open-source Simple Photo Gallery tool",
      width: 2048,
      height: 1388,
    },
    schemaCategory: "PhotographyApplication",
  },
  {
    slug: "leoline",
    name: "Leoline",
    category: "Stories for kids",
    summary:
      "A voice-first storyteller that creates unique, age-appropriate adventures for children.",
    metaDescription:
      "Leoline is a voice-first AI storyteller that creates longer, age-appropriate adventures for children, with a simple interface and parental controls.",
    description: [
      "Leoline is an orange rabbit children can talk to when they want a story about a specific idea.",
      "It is designed for longer stories, age-appropriate language, and parental controls in a simple voice interface.",
    ],
    links: [{ label: "Visit Leoline", href: "https://leoline.fun" }],
    image: {
      src: "https://leoline.fun/img/leoline-social.jpg",
      alt: "Leoline, the orange rabbit storyteller",
      width: 1200,
      height: 630,
    },
    schemaCategory: "EntertainmentApplication",
  },
  {
    slug: "confidential-api-key",
    name: "Confidential API Keys",
    category: "Open source · Confidential computing",
    summary:
      "A reference implementation for using third-party API keys without exposing them to the service provider.",
    description: [
      "Some restricted API keys still expose more data than a service needs. This project demonstrates a safer pattern using a Stripe API key and MRR calculation as a concrete example.",
      "The key is encrypted with Google Cloud KMS and can only be decrypted by reviewed code running inside Google Confidential Space. Hardware-backed attestation verifies the isolated environment and the exact container before access is granted.",
    ],
    links: [
      {
        label: "View the source code",
        href: "https://github.com/haltakov/confidential-api-key",
      },
    ],
    image: {
      src: "https://raw.githubusercontent.com/haltakov/confidential-api-key/main/docs/confidential-api-flow.png",
      alt: "Confidential API key usage flow using Google Confidential Space and KMS",
      width: 3264,
      height: 2144,
    },
    schemaCategory: "DeveloperApplication",
  },
  {
    slug: "chatbot-page",
    name: "chatbot-page",
    category: "Open source",
    summary:
      "The reusable React package behind this chatbot-style personal website.",
    metaDescription:
      "chatbot-page is the open-source React package behind this chatbot-style website, with Markdown answers, an LLM backend, and vector search support.",
    description: [
      "chatbot-page turns a personal or company homepage into a familiar chat interface.",
      "It supports answers stored in Markdown, an LLM backend, and retrieval from a vector store. This website is the production example.",
    ],
    links: [
      { label: "Open the chatbot", href: "/" },
      { label: "Source code", href: "https://github.com/haltakov/chatbot-page" },
      { label: "npm package", href: "https://www.npmjs.com/package/chatbot-page" },
    ],
    image: {
      src: "/images/og-image.jpg",
      alt: "Vlad's Chatbot Page",
      width: 1200,
      height: 630,
    },
    schemaCategory: "DeveloperApplication",
  },
  {
    slug: "creafex-lab",
    name: "Creafex Lab",
    category: "Company",
    summary:
      "My company for building independent software products and working with other teams.",
    metaDescription:
      "Creafex Lab is Vladimir Haltakov's independent product company, building focused software products and collaborating on AI and developer tools.",
    description: [
      "Creafex Lab is the company behind SimplePost, Simple Muscle, Simple Unmark, Simple Photo Gallery, and Leoline.",
      "It is also how I work with other companies on AI products, developer tools, and software engineering.",
    ],
    links: [{ label: "Visit Creafex Lab", href: "https://creafexlab.com" }],
    image: {
      src: "https://creafexlab.com/social.jpg",
      alt: "Creafex Lab",
      width: 1200,
      height: 630,
    },
    schemaCategory: "BusinessApplication",
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/haltakov" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/haltakov/" },
  { label: "X", href: "https://x.com/haltakov" },
  { label: "Bluesky", href: "https://bsky.app/profile/haltakov.net" },
]
