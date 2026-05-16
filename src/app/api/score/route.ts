import sharp from 'sharp'
import type { GameMode } from '@/types'
import { scoreSubmission } from '@/lib/ai'

export async function POST(request: Request) {
  const form = await request.formData()
  const file = form.get('file') as File | null
  const prompt = form.get('prompt') as string | null
  const mode = ((form.get('mode') as string) ?? 'normal') as GameMode

  if (!file || !prompt) {
    return Response.json({ error: 'Missing file or prompt' }, { status: 400 })
  }

  const raw = Buffer.from(await file.arrayBuffer())
  const compressed = await sharp(raw)
    .resize({ width: 1280, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()

  const imageBase64 = compressed.toString('base64')
  const result = await scoreSubmission(prompt, mode, imageBase64, 'image/jpeg')
  return Response.json(result)
}
