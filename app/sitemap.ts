import type { MetadataRoute } from "next"
import { projects } from "@/lib/site-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://haltakov.com"

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/projects`, changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
