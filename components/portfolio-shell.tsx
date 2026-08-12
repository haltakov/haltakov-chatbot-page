import type { ReactNode } from "react"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <div className="portfolio-page">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  )
}
