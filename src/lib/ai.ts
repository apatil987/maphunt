import Anthropic from '@anthropic-ai/sdk'
import type { GameMode, GamePrompt, PromptCategory, ScoreResult } from '@/types'

const client = new Anthropic()

function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  return match ? match[1] : text.trim()
}

const PROMPT_SYSTEM: Record<GameMode, string> = {
  normal:
    'You generate short, objective scavenger hunt prompts for MapHunt, a Google Street View game. Prompts describe specific real-world things a player can find by exploring Street View (e.g. "a red fire hydrant", "a church with a clock tower", "a shop with a striped awning"). Be specific and concrete. Respond with valid JSON only — no markdown, no explanation.',
  chaos:
    'You generate weird, funny, and surreal scavenger hunt prompts for MapHunt, a Google Street View game. Prompts are strange, oddly specific, or anthropomorphic (e.g. "a building that looks tired", "something a raccoon would call home", "a fence having an identity crisis", "a car that has clearly given up"). Be creative and unhinged. Respond with valid JSON only — no markdown, no explanation.',
  speed:
    'You generate simple, quick scavenger hunt prompts for MapHunt, a Google Street View game. Prompts describe very common objects that appear frequently in any city or town (e.g. "a parked car", "a traffic light", "a stop sign", "a tree on a sidewalk"). Keep it simple and fast. Respond with valid JSON only — no markdown, no explanation.',
}

const PROMPT_USER: Record<GameMode, string> = {
  normal:
    'Generate ONE scavenger hunt prompt for Normal mode — specific and findable but requires some searching. Respond with JSON only: {"text": "<the prompt>", "category": "object", "mode": "normal"}',
  chaos:
    'Generate ONE scavenger hunt prompt for Chaos mode — weird, funny, or surreal. Requires creative interpretation. Respond with JSON only: {"text": "<the prompt>", "category": "chaos", "mode": "chaos"}',
  speed:
    'Generate ONE scavenger hunt prompt for Speed mode — very common, easy to find anywhere. Respond with JSON only: {"text": "<the prompt>", "category": "literal", "mode": "speed"}',
}

export async function generatePrompt(mode: GameMode): Promise<GamePrompt> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 100,
    system: PROMPT_SYSTEM[mode],
    messages: [{ role: 'user', content: PROMPT_USER[mode] }],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response from Claude')
  const parsed = JSON.parse(extractJSON(block.text)) as GamePrompt
  return { text: parsed.text, category: parsed.category as PromptCategory, mode }
}

const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type ValidMimeType = (typeof VALID_MIME_TYPES)[number]

const MODE_CONTEXT: Record<GameMode, string> = {
  normal:
    'Normal mode: reward accurate, genuine finds. A solid effort should score 60–75, great = 85+.',
  chaos:
    'Chaos mode: reward creativity, weirdness, and lateral thinking over literal accuracy. If it made you smile, boost the score.',
  speed:
    'Speed mode: the prompt is intentionally simple. Full marks if it clearly shows the right thing.',
}

export async function scoreSubmission(
  prompt: string,
  mode: GameMode,
  imageBase64: string,
  mimeType: string,
): Promise<ScoreResult> {
  const safeMime: ValidMimeType = VALID_MIME_TYPES.includes(mimeType as ValidMimeType)
    ? (mimeType as ValidMimeType)
    : 'image/jpeg'

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `You are the entertaining judge for MapHunt, a Google Street View scavenger hunt. Respond with valid JSON only — no markdown, no explanation.

Scoring rubric:
- match (0–50): how well the image matches the prompt
- clarity (0–30): is the subject clearly visible, in focus, and obvious in frame
- confidence (0–20): how confident are you this is a genuine Street View screenshot of a real find
- total: must equal match + clarity + confidence exactly
- verdict: a funny 1–2 sentence roast-style verdict. Be entertaining but not cruel. End with the score like "72/100."
- aiPick: true only if this is especially creative, funny, or impressive — regardless of score

Calibration: be generous. A decent submission = 60–75. Great = 85+. Nearly perfect = 95+. Don't be stingy.
${MODE_CONTEXT[mode]}`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: safeMime, data: imageBase64 },
          },
          {
            type: 'text',
            text: `The prompt was: "${prompt}"\n\nScore this submission. Respond with JSON only: {"match": <0-50>, "clarity": <0-30>, "confidence": <0-20>, "total": <0-100>, "verdict": "<funny verdict>", "aiPick": <true|false>}`,
          },
        ],
      },
    ],
  })

  const block = message.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response from Claude')
  return JSON.parse(extractJSON(block.text)) as ScoreResult
}
