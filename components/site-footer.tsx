import Link from "next/link"
import { socialLinks } from "@/lib/site-data"

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer__inner">
        <span>© {new Date().getFullYear()} Vladimir Haltakov</span>
        <nav aria-label="Footer navigation">
          <Link href="/">Chat</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          {socialLinks.slice(0, 3).map((link) => (
            <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
