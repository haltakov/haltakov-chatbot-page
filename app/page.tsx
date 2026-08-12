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
          "@type": "Person",
          name: "Vladimir Haltakov",
          url: "https://haltakov.com",
          image: "https://haltakov.com/images/me.jpg",
          sameAs: [
            "https://github.com/haltakov",
            "https://www.linkedin.com/in/haltakov/",
            "https://x.com/haltakov",
            "https://bsky.app/profile/haltakov.bsky.social",
          ],
        }}
      />
    </main>
  )
}
