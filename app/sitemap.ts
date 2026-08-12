import type { MetadataRoute } from "next"
import { projects } from "@/lib/site-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const baseUrl = "https://haltakov.com"

  return [
    { url: baseUrl, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
