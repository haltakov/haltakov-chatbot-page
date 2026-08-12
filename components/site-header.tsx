import Image from "next/image"
import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link className="site-identity" href="/">
          <Image
            src="/images/me.jpg"
            alt=""
            width={34}
            height={34}
            priority
          />
          <span>Vladimir Haltakov</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Chat</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}
