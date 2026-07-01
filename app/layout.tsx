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
  title: "Vlad's Chatbot Page",
  description:
    "Chat with Vladimir Haltakov AI bot and ask about his work, projects, and personal interests.",
  authors: [{ name: "Vladimir Haltakov", url: "https://haltakov.com" }],
  metadataBase: new URL("https://haltakov.com"),
  openGraph: {
    title: "Vlad's Chatbot Page",
    description:
      "A chatbot-style personal website for Vladimir Haltakov, built with chatbot-page.",
    url: "https://haltakov.com",
    siteName: "Vlad's Chatbot Page",
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
    title: "Chat with Vlad",
    description: "Chat with Vladimir Haltakov's personal website.",
    creator: "@haltakov",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
