"use client"

import { useEffect, useRef, useState } from "react"
import {
  askVlad,
  askVladTool,
  parseInterestSummary,
  parseQuestion,
  showInterestSummaryTool,
  type AskVladInput,
  type InterestSummary,
  type InterestSummaryInput,
  type VladConversationMessage,
} from "@/lib/webmcp"

const MAX_ASK_VLAD_TURNS = 12

export function WebMcpProfile() {
  const [summary, setSummary] = useState<InterestSummary | null>(null)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const summaryTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const modelContext = document.modelContext ?? navigator.modelContext
    if (!modelContext) return

    const controller = new AbortController()
    const conversationId = `webmcp-${crypto.randomUUID()}`
    const messages: VladConversationMessage[] = []
    let askCount = 0
    let askQueue = Promise.resolve()

    const registerTools = async () => {
      await modelContext.registerTool(
        {
          ...askVladTool,
          execute: async (input, options) => {
            const signal = options?.signal ?? controller.signal
            const question = parseQuestion(input as AskVladInput)
            if (askCount >= MAX_ASK_VLAD_TURNS) {
              return JSON.stringify({
                error: "The conversation has reached its 12-question limit.",
                next_step:
                  "Use what you learned and call show_interest_summary to render the visitor's report.",
              })
            }

            let releaseQueue: () => void = () => undefined
            const previous = askQueue
            askQueue = new Promise<void>((resolve) => {
              releaseQueue = resolve
            })

            await previous
            try {
              if (signal.aborted) throw signal.reason
              const answer = await askVlad(question, messages, conversationId, signal)
              messages.push(
                { role: "user", content: question },
                { role: "assistant", content: answer },
              )
              askCount += 1

              return JSON.stringify({
                conversation_id: conversationId,
                turn: askCount,
                answer,
                guidance:
                  askCount < 3
                    ? "Ask another focused question before preparing the final report."
                    : "Ask another question if it would sharpen the analysis, or call show_interest_summary when ready.",
              })
            } finally {
              releaseQueue()
            }
          },
        },
        { signal: controller.signal },
      )

      await modelContext.registerTool(
        {
          ...showInterestSummaryTool,
          execute: async (input) => {
            const nextSummary = parseInterestSummary(input as InterestSummaryInput)
            setSummary(nextSummary)
            setIsReportOpen(true)
            window.setTimeout(() => summaryTitleRef.current?.focus(), 50)

            return JSON.stringify({
              status: "rendered",
              title: "Why Vlad is interesting to you",
              ask_vlad_turns: askCount,
              message: "The personalized report is now visible on the page.",
            })
          },
        },
        { signal: controller.signal },
      )
    }

    void registerTools().catch((error) => {
      if (!controller.signal.aborted) {
        console.error("Could not register WebMCP tools", error)
      }
    })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!isReportOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsReportOpen(false)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isReportOpen])

  if (!summary) return null

  return (
    <>
      {!isReportOpen ? (
        <button className="interest-report-reopen" type="button" onClick={() => setIsReportOpen(true)}>
          View your Vlad report
        </button>
      ) : null}

      <section
        className={`interest-report${isReportOpen ? " interest-report--open" : ""}`}
        aria-hidden={!isReportOpen}
        aria-modal="true"
        aria-label="Why Vlad is interesting to you"
        inert={!isReportOpen}
        role="dialog"
      >
        <div className="interest-report__scrim" onClick={() => setIsReportOpen(false)} />
        <article className="interest-report__sheet">
          <header className="interest-report__header">
            <div>
              <p className="interest-report__eyebrow">A connection brief for {summary.forWhom}</p>
              <h2 ref={summaryTitleRef} tabIndex={-1}>
                Why Vlad is interesting to you
              </h2>
            </div>
            <button
              className="interest-report__close"
              type="button"
              onClick={() => setIsReportOpen(false)}
              aria-label="Close report"
            >
              Close
            </button>
          </header>

          <div className="interest-report__thesis">
            <span aria-hidden="true">↳</span>
            <div>
              <h3>{summary.headline}</h3>
              <p>{summary.overview}</p>
            </div>
          </div>

          <div className="interest-report__grid">
            <ReportSection title="Common interests" className="interest-report__section--wide">
              <div className="interest-report__connections">
                {summary.commonInterests.map((item) => (
                  <div className="interest-report__connection" key={`${item.interest}-${item.connection}`}>
                    <h4>{item.interest}</h4>
                    <p>{item.connection}</p>
                  </div>
                ))}
              </div>
            </ReportSection>

            <ReportSection title="Relevant projects">
              <ul className="interest-report__projects">
                {summary.relevantProjects.map((project) => (
                  <li key={`${project.name}-${project.whyRelevant}`}>
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noreferrer">
                        {project.name} ↗
                      </a>
                    ) : (
                      <strong>{project.name}</strong>
                    )}
                    <p>{project.whyRelevant}</p>
                  </li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection title="Surprising connections">
              <ul className="interest-report__numbered-list">
                {summary.surprisingConnections.map((connection, index) => (
                  <li key={connection}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{connection}</p>
                  </li>
                ))}
              </ul>
            </ReportSection>

            <ReportSection title="Good next questions" className="interest-report__section--wide">
              <ul className="interest-report__questions">
                {summary.followUpQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </ReportSection>
          </div>

          <footer className="interest-report__footer">
            Prepared by your visiting agent after talking with Vlad’s site agent.
          </footer>
        </article>
      </section>
    </>
  )
}

function ReportSection({
  title,
  className = "",
  children,
}: {
  title: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`interest-report__section ${className}`}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}
