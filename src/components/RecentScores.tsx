'use client'

import { useSyncExternalStore } from 'react'
import { subscribeToHistory, getHistorySnapshot, getServerSnapshot } from '@/lib/history'
import type { GameMode } from '@/types'

const MODE_COLOR: Record<GameMode, string> = {
  normal: 'text-blue-400',
  chaos: 'text-fuchsia-400',
  speed: 'text-lime-400',
}

function scoreColor(score: number): string {
  if (score >= 90) return 'text-lime-400'
  if (score >= 75) return 'text-blue-400'
  if (score >= 50) return 'text-yellow-400'
  return 'text-red-400'
}

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function RecentScores() {
  const history = useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    getServerSnapshot,
  )

  if (history.length === 0) return null

  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest text-center">
        Recent
      </p>
      <div className="space-y-1.5">
        {history.map((entry, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <span className={`text-xs font-black uppercase w-12 shrink-0 ${MODE_COLOR[entry.mode]}`}>
              {entry.mode}
            </span>
            <span className="text-zinc-300 text-sm truncate flex-1">{entry.prompt}</span>
            <span className={`font-black text-sm tabular-nums shrink-0 ${scoreColor(entry.score)}`}>
              {entry.score}
            </span>
            <span className="text-zinc-600 text-xs shrink-0 w-14 text-right">
              {timeAgo(entry.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
