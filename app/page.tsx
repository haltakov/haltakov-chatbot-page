import { join } from "node:path"
import {
  loadCannedAnswerDirectory,
  loadFirstLaunchMarkdown,
} from "chatbot-page/server"
import { loadMarkdownBody } from "@/lib/markdown-content"
import { HaltakovChatbot } from "./chatbot"

export default async function Page() {
  const [cannedAnswers, firstLaunch, introMessage] = await Promise.all([
    loadCannedAnswerDirectory(join(process.cwd(), "content", "chatbot")),
    loadFirstLaunchMarkdown(join(process.cwd(), "content", "first-launch.md")),
    loadMarkdownBody(join(process.cwd(), "content", "intro.md")),
  ])

  return (
    <HaltakovChatbot
      cannedAnswers={cannedAnswers}
      firstLaunch={firstLaunch}
      introMessage={introMessage}
    />
  )
}
