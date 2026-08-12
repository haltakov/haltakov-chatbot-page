import Link from "next/link"

export function ChatSiteNav() {
  return (
    <nav className="chat-site-nav" aria-label="Portfolio navigation">
      <Link href="/projects">Projects</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
