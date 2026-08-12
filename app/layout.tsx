import type { Metadata, Viewport } from "next"
import type { ScriptHTMLAttributes } from "react"
import { Inter } from "next/font/google"
import PlausibleProvider from "next-plausible"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const plausibleScriptProps: ScriptHTMLAttributes<HTMLScriptElement> & {
  "data-domain": string
} = {
  "data-domain": "haltakov.com",
}

export const metadata: Metadata = {
  title: {
    default: "Vladimir Haltakov — Software Engineer & Founder",
    template: "%s | Vladimir Haltakov",
  },
  description:
    "Chat with Vladimir Haltakov's AI bot, explore his software projects, and learn about his work in AI, computer vision, and engineering.",
  authors: [{ name: "Vladimir Haltakov", url: "https://haltakov.com" }],
  creator: "Vladimir Haltakov",
  publisher: "Vladimir Haltakov",
  metadataBase: new URL("https://haltakov.com"),
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Vladimir Haltakov — Software Engineer & Founder",
    description:
      "Chat with Vladimir Haltakov's AI bot and explore his work in AI, computer vision, and software engineering.",
    url: "https://haltakov.com",
    siteName: "Vladimir Haltakov",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Chat with Vlad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vladimir Haltakov — Software Engineer & Founder",
    description:
      "Chat with Vladimir Haltakov's AI bot and explore his software projects.",
    creator: "@haltakov",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#252526",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body>
        <PlausibleProvider
          src="https://api.haltakov.com/js/script.js"
          init={{ endpoint: "https://api.haltakov.com/api/event" }}
          scriptProps={plausibleScriptProps}
        >
          {children}
        </PlausibleProvider>
      </body>
    </html>
  )
}
