'use client'

import { useState, useEffect } from 'react'
import type { GameMode } from '@/types'

const MESSAGES = {
  fetching: [
    'Consulting the map…',
    'Plotting your course…',
    'Generating your mission…',
    'Checking the terrain…',
  ],
  normal: [
    'Claude is judging your find…',
    'Inspecting the scene…',
    'Cross-referencing with reality…',
    'Determining if this is, in fact, what you think it is…',
    'Analyzing the evidence…',
  ],
  chaos: [
    'Claude is confused by your submission… good.',
    'Processing the chaos…',
    'Verifying the vibes…',
    'This is not what Claude expected. Interesting.',
    'Decoding your energy…',
  ],
  speed: [
    'Quick! Claude is on the clock…',
    'Speed-checking your find…',
    'Was that fast enough?',
    'Running the numbers…',
  ],
}

interface Props {
  phase: 'fetching-prompt' | 'scoring'
  mode?: GameMode
}

export default function LoadingScreen({ phase, mode = 'normal' }: Props) {
  const messages = phase === 'fetching-prompt' ? MESSAGES.fetching : MESSAGES[mode]
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 2200)
    return () => clearInterval(id)
  }, [messages.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-zinc-950">
      <div className="flex gap-2.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-zinc-300 text-lg text-center max-w-xs px-4">
        {messages[idx]}
      </p>
    </div>
  )
}
