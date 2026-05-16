export type GameMode = 'normal' | 'chaos' | 'speed'
export type PromptCategory = 'literal' | 'object' | 'chaos'

export interface GamePrompt {
  text: string
  category: PromptCategory
  mode: GameMode
}

export interface ScoreResult {
  match: number      // 0-50
  clarity: number    // 0-30
  confidence: number // 0-20
  total: number
  verdict: string
  aiPick: boolean
}
