import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { PortfolioShell } from "@/components/portfolio-shell"
import { socialLinks } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "About",
  description:
    "About Vladimir Haltakov, a Munich-based software engineer and founder with more than 20 years of experience in AI, computer vision, and machine learning.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Vladimir Haltakov",
    description:
      "Vladimir Haltakov is a software engineer and founder based in Munich, with a background in AI, computer vision, and machine learning.",
    url: "/about",
    siteName: "Vladimir Haltakov",
    locale: "en_US",
    type: "profile",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vladimir Haltakov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Vladimir Haltakov",
    description:
      "Software engineer and founder working in AI, computer vision, and software engineering.",
    creator: "@haltakov",
    images: ["/images/og-image.jpg"],
  },
}
export default function AboutPage() {
  return (
    <PortfolioShell>
      <main className="site-shell about-page">
        <Image
          className="about-page__portrait"
          src="/images/me.jpg"
          alt="Vladimir Haltakov"
          width={500}
          height={500}
          priority
        />

        <div className="about-page__content">
          <h1>About me</h1>
          <p>
            Hey, I&apos;m Vladimir Haltakov. I&apos;m a software engineer and
            founder based in Munich.
          </p>
          <p>
            I have worked in software for more than twenty years, including
            twelve years on computer vision and localization at BMW. I also
            completed a PhD in machine learning at the Technical University of
            Munich and later led engineering at a technology startup.
          </p>
          <p>
            Today I run Creafex Lab, where I build products including
            SimplePost, Simple Muscle, Simple Unmark, Simple Photo Gallery, and
            Leoline.
          </p>

          <div className="about-page__links">
            <Link href="/projects">View projects →</Link>
            <Link href="/">Chat with me →</Link>
            {socialLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </main>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: "https://haltakov.com/about",
          name: "About Vladimir Haltakov",
          mainEntity: {
            "@type": "Person",
            name: "Vladimir Haltakov",
            url: "https://haltakov.com",
            image: "https://haltakov.com/images/me.jpg",
            sameAs: socialLinks.map((link) => link.href),
          },
        }}
      />
    </PortfolioShell>
  )
}
