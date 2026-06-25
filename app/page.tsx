import { join } from "node:path"
import {
  loadCannedAnswerDirectory,
  loadFirstLaunchMarkdown,
} from "chatbot-page/server"
import { HaltakovChatbot } from "./chatbot"

export default async function Page() {
  const [cannedAnswers, firstLaunch] = await Promise.all([
    loadCannedAnswerDirectory(join(process.cwd(), "content", "chatbot")),
    loadFirstLaunchMarkdown(join(process.cwd(), "content", "first-launch.md")),
  ])

  return <HaltakovChatbot cannedAnswers={cannedAnswers} firstLaunch={firstLaunch} />
}
