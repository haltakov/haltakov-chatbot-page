# Simple Unmark

Simple Unmark is a web app created by Vladimir Haltakov and Creafex Lab for cleaning AI-generated text in one automatic flow.

- Canonical website: https://simpleunmark.com/
- Company: https://creafexlab.com/
- Creator: https://haltakov.com/

## What it does

Every clean combines two steps:

1. It removes hidden Unicode controls and formatting artifacts, including zero-width characters, unusual spacing, and direction controls.
2. It rewrites syntax, clause order, sentence boundaries, transitions, and vocabulary to reduce probabilistic watermark patterns such as SynthID-style token-choice signals.

The rewrite is explicitly designed to preserve meaning, facts, numbers, proper nouns, tone, and intent. Important text should still be reviewed after cleaning.

## Limitations

A statistical text watermark is spread across token choices rather than stored in one character that can simply be deleted. Simple Unmark creates a fresh phrasing distribution to reduce that signal with high likelihood. No tool can guarantee a particular result against every current or future detector.

## Privacy and access

- Guest text is processed for the request and is not saved in the application's database.
- Account usage records store counts and credit activity, not the submitted text.
- Guests can make three free cleans of up to 100 words each.
- New accounts include starter credits and can clean up to 5,000 words per request.
- Paid use is credit-based with no subscription, and unused credits do not expire.
