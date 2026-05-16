@AGENTS.md
# MapHunt — CLAUDE.md

## What This App Is
A Street View scavenger hunt game. A prompt is shown (e.g. "find a pink house"
or "find a statue of an animal") and players search Google Street View, screenshot
their find, and upload it. Claude AI judges each submission and picks a winner.

## Tech Stack
- Next.js (App Router), TypeScript, Tailwind CSS
- Anthropic Claude API for AI judging and prompt generation
- Supabase for database and leaderboard
- Vercel for deployment

## Game Modes (build in this order)
1. Solo — AI generates a prompt, player uploads a find, Claude scores it
2. Daily Challenge — one shared prompt per day, leaderboard of all scores
3. 1v1 Async — challenge a friend, both submit, AI judges winner
4. Battle Royale — multiple players, live submissions, AI ranks all

## Current Build Phase
Phase 1 — Solo mode only. AI generates prompt, player uploads screenshot, 
Claude scores it and gives a funny verdict.

## AI Scoring System
Score is broken into 3 visible categories shown to the player:
- Match (0-40pts) — how literally does the image match the prompt
- Quality (0-30pts) — clarity of the find, is the subject obvious in frame
- Creativity (0-30pts) — did they find something unexpected or go the extra mile

Always return a short funny 1-2 sentence roast-style verdict explaining the score.
Example: "Technically a pink house. The shutters are doing their best. 64/100."

Also give an "AI Pick" flag for submissions that are especially creative or funny,
regardless of score.

## Prompt Categories
- Literal (pink house, red door, blue car)
- Object (statue of animal, working payphone, wooden fence)
- Chaos (something a pigeon would own, a mailbox that looks lonely)

## Project Structure
- /src/app — Next.js app router pages
- /src/app/api — API routes (prompt generation, image scoring)
- /src/components — UI components
- /src/lib/ai.ts — all Anthropic API calls go here, nowhere else
- /src/lib/supabase.ts — Supabase client
- /src/types/index.ts — all shared TypeScript types

## Rules
- Always TypeScript, never plain JS
- Never put API keys in client-side code
- Keep components under 150 lines, split if longer
- Build Phase 1 fully before touching Phase 2 features
- Write a plan before creating or editing files