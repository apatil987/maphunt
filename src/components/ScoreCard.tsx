import type { ScoreResult } from '@/types'

interface ScoreBarProps {
  label: string
  value: number
  max: number
  color: string
}

function ScoreBar({ label, value, max, color }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-zinc-300">{label}</span>
        <span className="tabular-nums text-zinc-500">
          {value} / {max}
        </span>
      </div>
      <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function scoreColor(total: number): string {
  if (total >= 90) return 'text-lime-400'
  if (total >= 75) return 'text-blue-400'
  if (total >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

interface Props {
  result: ScoreResult
  imageUrl: string | null
}

export default function ScoreCard({ result, imageUrl }: Props) {
  return (
    <div className="w-full max-w-md space-y-4">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="Your find"
          className="w-full max-h-52 object-cover rounded-2xl border border-zinc-800"
        />
      )}

      <div className="text-center space-y-1.5">
        <div className={`text-8xl font-black tabular-nums leading-none ${scoreColor(result.total)}`}>
          {result.total}
        </div>
        <div className="text-zinc-500 text-sm font-medium">out of 100</div>
        {result.aiPick && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 text-amber-400 text-xs font-black rounded-full border border-amber-400/30">
            ✦ AI Pick
          </span>
        )}
      </div>

      <div className="space-y-3 bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
        <ScoreBar label="Match" value={result.match} max={50} color="bg-blue-500" />
        <ScoreBar label="Clarity" value={result.clarity} max={30} color="bg-emerald-500" />
        <ScoreBar label="Confidence" value={result.confidence} max={20} color="bg-purple-500" />
      </div>

      <div className="bg-zinc-900 rounded-2xl px-5 py-4 border border-zinc-800">
        <p className="text-zinc-300 italic text-sm leading-relaxed text-center">
          &ldquo;{result.verdict}&rdquo;
        </p>
      </div>
    </div>
  )
}
