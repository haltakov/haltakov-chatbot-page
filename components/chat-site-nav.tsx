"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const AGENT_TEST_PROMPT =
  "Visit haltakov.com and find out why Vlad might be interesting to me. Talk to his site agent, ask 4–6 relevant questions based on what you know about me, then show me a personalized report."

export function ChatSiteNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setIsOpen(false)
      triggerRef.current?.focus()
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("pointerdown", handlePointerDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isOpen])

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(AGENT_TEST_PROMPT)
    setHasCopied(true)
    window.setTimeout(() => setHasCopied(false), 1800)
  }

  return (
    <>
      <nav className="chat-site-nav" aria-label="Portfolio navigation">
        <Link href="/projects">Projects</Link>
        <Link href="/about">About</Link>
        <button
          ref={triggerRef}
          type="button"
          aria-controls="agent-visit-guide"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          For AI agents
          <span className="chat-site-nav__signal" aria-hidden="true" />
        </button>
      </nav>

      <aside
        ref={panelRef}
        id="agent-visit-guide"
        className={`agent-visit-guide${isOpen ? " agent-visit-guide--open" : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        role="dialog"
        aria-labelledby="agent-visit-guide-title"
      >
        <div className="agent-visit-guide__header">
          <p>WebMCP · agent access</p>
          <button type="button" onClick={() => setIsOpen(false)} aria-label="Close agent guide">
            Close
          </button>
        </div>

        <h2 id="agent-visit-guide-title">Let your agent talk to mine.</h2>
        <p>
          This page exposes <code>ask_vlad</code> for a multi-turn interview and{" "}
          <code>show_interest_summary</code> for a report tailored to you.
        </p>
        <p className="agent-visit-guide__privacy">
          Your agent decides what to ask. This page receives only the questions it submits.
        </p>

        <div className="agent-visit-guide__prompt">
          <span>Try this with a WebMCP-capable agent</span>
          <p>{AGENT_TEST_PROMPT}</p>
          <button type="button" onClick={copyPrompt}>
            {hasCopied ? "Copied" : "Copy prompt"}
          </button>
        </div>
      </aside>
    </>
  )
}
