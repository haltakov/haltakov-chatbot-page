import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { JsonLd } from "@/components/json-ld"
import { PortfolioShell } from "@/components/portfolio-shell"
import { projects } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Vladimir Haltakov, including SimplePost, Simple Muscle, Simple Photo Gallery, Confidential API Keys, Leoline, and chatbot-page.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects by Vladimir Haltakov",
    description:
      "Software products and open-source projects by Vladimir Haltakov.",
    url: "/projects",
    siteName: "Vladimir Haltakov",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Projects by Vladimir Haltakov",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by Vladimir Haltakov",
    description:
      "Software products and open-source projects by Vladimir Haltakov.",
    creator: "@haltakov",
    images: ["/images/og-image.jpg"],
  },
}

export default function ProjectsPage() {
  return (
    <PortfolioShell>
      <main className="site-shell projects-page">
        <header className="page-intro">
          <h1>Projects</h1>
          <p>A selection of products and open-source projects I work on.</p>
        </header>

        <div className="project-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.slug}>
              <Link className="project-card__main" href={`/projects/${project.slug}`}>
                <div className="project-card__image">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    width={project.image.width}
                    height={project.image.height}
                    sizes="(max-width: 760px) 100vw, 50vw"
                    priority={index === 0}
                    unoptimized={project.image.src.startsWith("https://")}
                  />
                </div>
                <div className="project-card__copy">
                  <p>{project.category}</p>
                  <h2>{project.name}</h2>
                  <span>{project.summary}</span>
                </div>
              </Link>
              <a
                className="project-card__link"
                href={project.links[0].href}
                target={project.links[0].href.startsWith("http") ? "_blank" : undefined}
                rel={project.links[0].href.startsWith("http") ? "noreferrer" : undefined}
              >
                {project.links[0].label}
                {project.links[0].href.startsWith("http") ? " ↗" : " →"}
              </a>
            </article>
          ))}
        </div>
      </main>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Projects by Vladimir Haltakov",
          url: "https://haltakov.com/projects",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.name,
              url: `https://haltakov.com/projects/${project.slug}`,
            })),
          },
        }}
      />
    </PortfolioShell>
  )
}
