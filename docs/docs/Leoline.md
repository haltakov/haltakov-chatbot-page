# Leoline: AI Voice Assistant for Kids

## Overview

Leoline is an AI voice assistant specifically optimized for children.

* **Initial Functionality:** Telling stories to children.  
* **Future Development Plans:**  
  * Answering questions.  
  * Playing voice-based games.

## The Problem with Traditional Voice Assistants for Kids

Traditional voice assistants (e.g., ChatGPT, Glock, Gemini) are not designed for children, leading to frustrating experiences due to:

1. **Voice Activity Detection (VAD):**  
   * Kids often pause while formulating thoughts, which standard VADs interpret as the end of a query, causing premature responses.  
2. **Language Complexity & Appropriateness:**  
   * Assistants may use language too complicated for children.  
   * Risk of outputting inappropriate language.  
3. **Story Length:**  
   * Generated stories are often too short, even when prompted for longer ones, not meeting children's desire for extended narratives (e.g., 10 minutes).  
4. **Parental Control:**  
   * Parents lack persistent control over topics and language appropriateness for their child's age.  
   * Requires tedious re-prompting for each interaction to set context (e.g., "talk to a 3-year-old").  
* **Personal Motivation:** The creator's 6-year-old son experiences frustration with traditional voice assistants.

## Leoline's Solutions

Leoline aims to provide a fully optimized experience for kids by addressing the above issues:

1. **Kid-Friendly Voice Activity Detection:**  
   * Fine-tuned VAD module that allows for longer pauses.  
2. **Age-Appropriate Language & Content:**  
   * System messages pre-prompt the AI with rules for child-appropriate language and behavior.  
3. **Enhanced Parental Controls:**  
   * Parents can define their own persistent rules in settings:  
     * **Topic Management:** Avoid or emphasize specific topics.  
     * **Interest Incorporation:** Tailor stories to a child's interests (e.g., technical topics, birds, animals).  
     * **Age & Gender Tuning:** Customize responses for a specific age and gender (e.g., "respond as for a five-year-old girl").  
4. **Long-Form Story Generation:**  
   * Generates stories of virtually unlimited length by:  
     * Breaking stories into chapters.  
     * Generating an overview of chapters.  
     * Telling each chapter individually.  
   * Easily capable of generating stories longer than 10 minutes.

## User Experience (UX) & Current Status

* **Platform:** Currently a web app, accessible on PCs, tablets, and phones.  
* **Visuals:** Features a large, cute orange rabbit character (takes almost the whole screen).  
* **Interaction:**  
  * Kids tap the rabbit and speak their story request (e.g., "tell me a story about a rabbit").  
  * The assistant listens and starts generating/replying almost immediately, considering system and parental rules.  
* **Goal:** Maximize screen-free time through voice-centric interaction.  
* **Other Features:** Simple authentication module and settings.

## Pricing Model

* **Free Tier:** 3 stories per month.  
* **Paid Tier:** Up to 100 stories per month.  
  * Monthly: $9/month.  
  * Yearly: $90/year.

## Future Plans & Development

* **Content Expansion:** Addition of more templates for games and learning activities, so parents can select from a pre-defined list.  
* **Native Apps:** Native mobile apps for Android and iOS are currently in development.

## Technical Details

* **Frontend:**  
  * Next.js  
  * Tailwind CSS  
  * React Query  
* **Character (Leoline Rabbit):**  
  * Generated using Midjourney (AI).  
  * Animated using RunwayML (displayed as pre-recorded video clips).  
* **Backend:**  
  * Next.js (using App Router and Server Actions).  
* **AI Stack:**  
  * **Audio Transcription:** OpenAI Whisper.  
  * **Story Generation:** OpenAI GPT-4.0 (leveraging system prompts for customization).  
  * **Voice Output:** OpenAI GPT-4.0 Audio Model.  
  * **Audio Post-processing:** An additional step to increase pitch and adjust performance to sound more child-like.

