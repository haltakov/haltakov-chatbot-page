import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vladimir Haltakov",
    short_name: "Haltakov",
    description: "Vladimir Haltakov's chatbot-style personal website.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0d0d",
    theme_color: "#0d0d0d",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  }
}
