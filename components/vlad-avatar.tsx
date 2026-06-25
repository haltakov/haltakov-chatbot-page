"use client"

import type { BotAvatarProps } from "chatbot-page"

export function VladAvatar({ identity, className }: BotAvatarProps) {
  return (
    <img
      src="/images/me.jpg"
      alt={identity.name}
      className={`vlad-avatar ${className ?? ""}`}
    />
  )
}
