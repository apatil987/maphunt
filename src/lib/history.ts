import type { GameMode } from '@/types'

export interface HistoryEntry {
  prompt: string
  mode: GameMode
  score: number
  timestamp: number
}

const KEY = 'maphunt_history'
const MAX = 5
const EVENT = 'maphunt-history-update'

export function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as HistoryEntry[]
  } catch {
    return []
  }
}

// Module-level cache so getHistorySnapshot() returns a stable reference
// until a save occurs — required by useSyncExternalStore.
let cache: HistoryEntry[] = loadHistory()

export function saveResult(entry: HistoryEntry): void {
  cache = [entry, ...cache].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(cache))
  window.dispatchEvent(new Event(EVENT))
}

export function subscribeToHistory(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  return () => window.removeEventListener(EVENT, callback)
}

export function getHistorySnapshot(): HistoryEntry[] {
  return cache
}

const EMPTY: HistoryEntry[] = []
export const getServerSnapshot = (): HistoryEntry[] => EMPTY
