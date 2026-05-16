'use client'

import { useState, useRef } from 'react'
import type { GameMode, GamePrompt, ScoreResult } from '@/types'
import ModeSelect from './ModeSelect'
import LoadingScreen from './LoadingScreen'
import ScoreCard from './ScoreCard'

type Phase = 'idle' | 'mode-select' | 'fetching-prompt' | 'prompt' | 'scoring' | 'result'

const MODE_ACCENT: Record<GameMode, string> = {
  normal: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  chaos: 'text-fuchsia-400 border-fuchsia-400/30 bg-fuchsia-400/10',
  speed: 'text-lime-400 border-lime-400/30 bg-lime-400/10',
}

export default function GameClient() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [mode, setMode] = useState<GameMode>('normal')
  const [prompt, setPrompt] = useState<GamePrompt | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<ScoreResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function startHunt(selectedMode: GameMode) {
    setMode(selectedMode)
    setError(null)
    setPhase('fetching-prompt')
    const res = await fetch(`/api/prompt?mode=${selectedMode}`)
    if (!res.ok) {
      setError('Failed to generate a prompt — try again')
      setPhase('mode-select')
      return
    }
    setPrompt(await res.json())
    setPreview(null)
    setPhase('prompt')
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) setPreview(URL.createObjectURL(f))
  }

  async function submitFind() {
    const f = fileRef.current?.files?.[0]
    if (!f || !prompt) return
    setError(null)
    setPhase('scoring')
    const fd = new FormData()
    fd.append('file', f)
    fd.append('prompt', prompt.text)
    fd.append('mode', mode)
    const res = await fetch('/api/score', { method: 'POST', body: fd })
    if (!res.ok) {
      setError('Scoring failed — try again')
      setPhase('prompt')
      return
    }
    setResult(await res.json())
    setPhase('result')
  }

  function reset() {
    setPhase('idle')
    setPrompt(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  if (phase === 'mode-select') return <ModeSelect onSelect={startHunt} />
  if (phase === 'fetching-prompt' || phase === 'scoring') {
    return <LoadingScreen phase={phase} mode={mode} />
  }

  if (phase === 'result' && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-16 bg-zinc-950">
        <div className="text-center space-y-1">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">The Verdict</p>
          <h2 className="text-3xl font-black text-white">How&rsquo;d you do?</h2>
        </div>
        <ScoreCard result={result} imageUrl={preview} />
        <button
          onClick={reset}
          className="px-8 py-3 bg-yellow-400 text-zinc-950 rounded-full font-black hover:bg-yellow-300 transition-colors"
        >
          Play Again →
        </button>
      </div>
    )
  }

  if (phase === 'prompt' && prompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 py-16 bg-zinc-950">
        <div className="text-center space-y-3 max-w-sm">
          <span className={`inline-block text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${MODE_ACCENT[mode]}`}>
            {mode} mode
          </span>
          <h2 className="text-4xl font-black text-white leading-tight">{prompt.text}</h2>
          <p className="text-zinc-500 text-sm">
            Find this in Google Street View, screenshot it, and upload below.
          </p>
        </div>

        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Your find preview"
            className="max-h-56 max-w-full rounded-2xl border border-zinc-800 object-cover"
          />
        ) : null}

        <label className="cursor-pointer px-6 py-3 border-2 border-dashed border-zinc-700 rounded-xl text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-200 transition-colors">
          {preview ? 'Change screenshot' : '+ Upload screenshot'}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={submitFind}
          disabled={!preview}
          className="px-8 py-3 bg-yellow-400 text-zinc-950 rounded-full font-black hover:bg-yellow-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Submit Find →
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 px-4 text-center bg-zinc-950">
      <div className="space-y-4">
        <span className="inline-block px-3 py-1 bg-yellow-400/10 text-yellow-400 text-xs font-black rounded-full border border-yellow-400/20 tracking-widest uppercase">
          Street View Scavenger Hunt
        </span>
        <h1 className="text-7xl font-black tracking-tighter text-white leading-none">MapHunt</h1>
        <p className="text-zinc-400 text-xl">Find it in Street View. Claude judges.</p>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        onClick={() => setPhase('mode-select')}
        className="px-10 py-4 bg-yellow-400 text-zinc-950 rounded-full text-lg font-black hover:bg-yellow-300 transition-colors"
      >
        Start Hunt →
      </button>
    </div>
  )
}
