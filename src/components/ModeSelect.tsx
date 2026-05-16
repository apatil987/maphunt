import type { GameMode } from '@/types'

const MODES: Array<{
  id: GameMode
  emoji: string
  name: string
  tagline: string
  description: string
  accent: string
  border: string
  glow: string
}> = [
  {
    id: 'normal',
    emoji: '🧭',
    name: 'Normal',
    tagline: 'The Classic Hunt',
    description: 'Find specific real-world things. GPS accuracy required.',
    accent: 'text-blue-400',
    border: 'hover:border-blue-500',
    glow: 'hover:bg-blue-950/30',
  },
  {
    id: 'chaos',
    emoji: '🌀',
    name: 'Chaos',
    tagline: 'Expect the Unexpected',
    description: 'Weird, surreal prompts. The stranger your find, the better.',
    accent: 'text-fuchsia-400',
    border: 'hover:border-fuchsia-500',
    glow: 'hover:bg-fuchsia-950/30',
  },
  {
    id: 'speed',
    emoji: '⚡',
    name: 'Speed',
    tagline: 'Find It Fast',
    description: 'Simple targets. Common objects. No excuses.',
    accent: 'text-lime-400',
    border: 'hover:border-lime-500',
    glow: 'hover:bg-lime-950/30',
  },
]

export default function ModeSelect({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 bg-zinc-950">
      <div className="text-center space-y-2">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Choose your mode</p>
        <h2 className="text-4xl font-black text-white">How do you hunt?</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`flex flex-col gap-4 p-6 rounded-2xl border border-zinc-800 bg-zinc-900 text-left transition-all duration-200 cursor-pointer ${m.border} ${m.glow}`}
          >
            <span className="text-4xl">{m.emoji}</span>
            <div>
              <div className={`text-xs font-black uppercase tracking-widest ${m.accent}`}>
                {m.name}
              </div>
              <div className="text-white font-bold text-lg leading-snug mt-0.5">{m.tagline}</div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">{m.description}</p>
          </button>
        ))}
      </div>

      <p className="text-zinc-600 text-xs">Pick one. Claude&rsquo;s waiting.</p>
    </div>
  )
}
