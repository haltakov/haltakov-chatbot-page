import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/json-ld"
import { PortfolioShell } from "@/components/portfolio-shell"
import { getProject, projects } from "@/lib/site-data"

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) return {}

  return {
    title: project.name,
    description: project.metaDescription ?? project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.name,
      description: project.summary,
      url: `/projects/${project.slug}`,
      siteName: "Vladimir Haltakov",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: project.image.src,
          width: project.image.width,
          height: project.image.height,
          alt: project.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.summary,
      creator: "@haltakov",
      images: [project.image.src],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  return (
    <PortfolioShell>
      <main className="site-shell project-detail">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/projects">Projects</Link>
          <span>/</span>
          <span aria-current="page">{project.name}</span>
        </nav>

        <header className="project-detail__header">
          <p>{project.category}</p>
          <h1>{project.name}</h1>
          <span>{project.summary}</span>
        </header>

        <Image
          className="project-detail__image"
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          sizes="(max-width: 960px) 100vw, 880px"
          priority
          unoptimized={project.image.src.startsWith("https://")}
        />

        <div className="project-detail__content">
          {project.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="project-links">
            {project.links.map((link) => {
              const external = link.href.startsWith("http")

              if (external) {
                return (
                  <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>
                    {link.label} ↗
                  </a>
                )
              }

              return (
                <Link href={link.href} key={link.href}>
                  {link.label} →
                </Link>
              )
            })}
          </div>
        </div>

        <Link className="back-link" href="/projects">
          ← All projects
        </Link>
      </main>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type":
                project.slug === "creafex-lab"
                  ? "Organization"
                  : "SoftwareApplication",
              name: project.name,
              description: project.summary,
              url: project.links[0].href,
              mainEntityOfPage: `https://haltakov.com/projects/${project.slug}`,
              ...(project.slug === "creafex-lab"
                ? {
                    founder: {
                      "@type": "Person",
                      "@id": "https://haltakov.com/#person",
                      name: "Vladimir Haltakov",
                    },
                  }
                : {
                    applicationCategory: project.schemaCategory,
                    creator: {
                      "@type": "Person",
                      "@id": "https://haltakov.com/#person",
                      name: "Vladimir Haltakov",
                      url: "https://haltakov.com",
                    },
                  }),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Projects",
                  item: "https://haltakov.com/projects",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: project.name,
                  item: `https://haltakov.com/projects/${project.slug}`,
                },
              ],
            },
          ],
        }}
      />
    </PortfolioShell>
  )
}
