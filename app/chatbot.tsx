"use client";

import {
  ChatApp,
  createApiAnswerProvider,
  createCannedAnswerCollection,
  createCannedAnswerProvider,
  type CannedAnswerEntry,
  type ChatbotConfig,
  type ChatbotFirstLaunchConfig,
} from "chatbot-page";
import { VladAvatar } from "@/components/vlad-avatar";
import { WebMcpProfile } from "@/components/webmcp-profile";
import { identity } from "@/lib/chatbot-base-config";

const backendProvider = createApiAnswerProvider({
  endpoint: "/api/chat",
  stream: true,
});

export function HaltakovChatbot({
  cannedAnswers,
  firstLaunch,
  introMessage,
}: {
  cannedAnswers: CannedAnswerEntry[];
  firstLaunch: ChatbotFirstLaunchConfig;
  introMessage: string;
}) {
  const canned = createCannedAnswerCollection(cannedAnswers);

  const chatbotConfig: ChatbotConfig = {
    identity,
    introMessage,
    suggestions: canned.suggestions,
    components: {
      BotAvatar: VladAvatar,
    },
    notifications: {
      enabled: true,
      endpoint: "/api/chatbot-events",
    },
    liveReplies: {
      enabled: true,
      endpoint: "/api/chatbot-live",
    },
    answerProvider: createCannedAnswerProvider({
      ...canned,
      fallbackProvider: backendProvider,
    }),
    storage: {
      conversationsKey: "haltakov-chatbot-page:conversations:v1",
      firstLaunchKey: "haltakov-chatbot-page:first-launch:v1",
      themeKey: "haltakov-chatbot-page:theme",
      visitorIdKey: "haltakov-chatbot-page:visitor-id:v1",
    },
    ui: {
      composerPlaceholder: "Ask Vlad anything...",
      contact: {
        buttonLabel: "Connect",
        title: "Connect with Vlad",
        description: "Leave your email and I will get back to you.",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        submitLabel: "Send",
        successTitle: "Thanks, I got it",
      },
      disclaimer: "Prompts may be sent to Vlad.",
      firstLaunch,
      newChatLabel: "New chat",
      suggestionCount: 4,
      userLabel: "You",
    },
  };

  return (
    <>
      <ChatApp config={chatbotConfig} />
      <WebMcpProfile />
    </>
  );
}
