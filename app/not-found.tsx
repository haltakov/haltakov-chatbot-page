import Link from "next/link"
import { PortfolioShell } from "@/components/portfolio-shell"

export default function NotFound() {
  return (
    <PortfolioShell>
      <main className="site-shell not-found">
        <h1>Page not found</h1>
        <p>The page you were looking for does not exist.</p>
        <Link href="/">Back to the chat →</Link>
      </main>
    </PortfolioShell>
  )
}
