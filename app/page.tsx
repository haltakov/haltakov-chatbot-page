import { join } from "node:path"
import {
  loadCannedAnswerDirectory,
  loadFirstLaunchMarkdown,
  loadMarkdownBody,
} from "chatbot-page/server"
import { ChatSiteNav } from "@/components/chat-site-nav"
import { JsonLd } from "@/components/json-ld"
import { HaltakovChatbot } from "./chatbot"

export default async function Page() {
  const [cannedAnswers, firstLaunch, introMessage] = await Promise.all([
    loadCannedAnswerDirectory(join(process.cwd(), "content", "chatbot")),
    loadFirstLaunchMarkdown(join(process.cwd(), "content", "first-launch.md")),
    loadMarkdownBody(join(process.cwd(), "content", "intro.md")),
  ])

  return (
    <main className="chat-home">
      <h1 className="sr-only">Vladimir Haltakov</h1>
      <ChatSiteNav />
      <HaltakovChatbot
        cannedAnswers={cannedAnswers}
        firstLaunch={firstLaunch}
        introMessage={introMessage}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": "https://haltakov.com/#person",
              name: "Vladimir Haltakov",
              url: "https://haltakov.com",
              image: "https://haltakov.com/images/me.jpg",
              jobTitle: "Software engineer and founder",
              knowsAbout: [
                "Artificial intelligence",
                "Computer vision",
                "Machine learning",
                "Software engineering",
              ],
              worksFor: {
                "@type": "Organization",
                "@id": "https://creafexlab.com/#organization",
                name: "Creafex Lab",
                url: "https://creafexlab.com",
              },
              sameAs: [
                "https://github.com/haltakov",
                "https://www.linkedin.com/in/haltakov/",
                "https://x.com/haltakov",
                "https://bsky.app/profile/haltakov.net",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "https://haltakov.com/#website",
              name: "Vladimir Haltakov",
              url: "https://haltakov.com",
              description:
                "Vladimir Haltakov's chatbot-style personal website and project portfolio.",
              inLanguage: "en",
              publisher: { "@id": "https://haltakov.com/#person" },
            },
          ],
        }}
      />
    </main>
  )
}
