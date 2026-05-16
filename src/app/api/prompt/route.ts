import type { GameMode } from '@/types'
import { generatePrompt } from '@/lib/ai'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = (searchParams.get('mode') ?? 'normal') as GameMode
  const prompt = generatePrompt(mode)
  return Response.json(prompt)
}
