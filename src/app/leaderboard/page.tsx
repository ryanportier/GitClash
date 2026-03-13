'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { PixelPanel, RarityBadge, PixelLoader, PixelButton } from '@/components/ui/pixel-ui'
import { RARITY_CONFIG, CLASS_CONFIGS } from '@/types'

interface LeaderboardEntry {
  rank: number
  userId: string
  githubUsername: string
  displayName: string
  avatarUrl: string
  rankPoints: number
  rankTitle: string
  fighterClass: string
  rarity: string
  wins: number
  losses: number
  winStreak: number
}

const RANK_COLORS: Record<number, string> = {
  1: '#ffd700',
  2: '#c0c0c0',
  3: '#cd7f32',
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setEntries(d.entries || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen arena-bg px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/')} className="font-pixel text-xs text-ember-400 hover:text-ember-300">
            ← GITCLASH
          </button>
          <h1 className="font-pixel text-xs neon-text-red uppercase tracking-widest">Leaderboard</h1>
          <PixelButton variant="primary" size="sm" onClick={() => router.push('/arena')}>
            ⚔ Battle
          </PixelButton>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <PixelLoader label="Loading rankings..." />
          </div>
        )}

        {!loading && entries.length === 0 && (
          <PixelPanel className="text-center py-12">
            <p className="font-pixel text-xs text-iron-500">No fighters yet. Be the first!</p>
          </PixelPanel>
        )}

        {/* Top 3 podium */}
        {entries.length >= 3 && (
          <div className="flex items-end justify-center gap-4 py-6">
            {[entries[1], entries[0], entries[2]].map((entry, i) => {
              const podiumRank = [2, 1, 3][i]
              const height = [140, 180, 120][i]
              const color = RANK_COLORS[podiumRank]
              return (
                <div key={entry.userId} className="flex flex-col items-center gap-2">
                  <p className="font-pixel text-[10px] text-white truncate max-w-20 text-center">{entry.displayName}</p>
                  <FighterSprite
                    fighterClass={entry.fighterClass as any}
                    state="victory"
                    size={64}
                    glowColor={color}
                    animated
                    flipped={i === 2}
                  />
                  <div
                    className="w-20 flex items-center justify-center border-t-2"
                    style={{ height, borderColor: color, background: `${color}11` }}
                  >
                    <span className="font-pixel text-2xl" style={{ color }}>#{podiumRank}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <PixelPanel title="Rankings">
          <div className="space-y-2">
            {entries.map((entry) => {
              const rankColor = RANK_COLORS[entry.rank] || '#5a5a7a'
              const classConfig = CLASS_CONFIGS[entry.fighterClass as keyof typeof CLASS_CONFIGS]
              return (
                <div
                  key={entry.userId}
                  className="flex items-center gap-3 p-2 border border-iron-800 hover:border-iron-600 transition-colors"
                >
                  {/* Rank */}
                  <span
                    className="font-pixel text-sm w-8 text-center"
                    style={{ color: rankColor }}
                  >
                    #{entry.rank}
                  </span>

                  {/* Fighter sprite */}
                  <FighterSprite
                    fighterClass={entry.fighterClass as any}
                    state="idle"
                    size={32}
                    glowColor={RARITY_CONFIG[entry.rarity as keyof typeof RARITY_CONFIG]?.glowColor}
                    animated={false}
                  />

                  {/* Avatar */}
                  <img
                    src={entry.avatarUrl}
                    alt={entry.displayName}
                    className="w-8 h-8 border border-iron-700"
                  />

                  {/* Name + class */}
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-xs text-white truncate">{entry.displayName}</p>
                    <p className="font-mono text-[10px] truncate" style={{ color: classConfig?.color || '#aaa' }}>
                      {entry.rankTitle} · {classConfig?.displayName || entry.fighterClass}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-col items-end text-right">
                    <span className="font-pixel text-xs neon-text-red">{entry.rankPoints} RP</span>
                    <span className="font-mono text-[10px] text-iron-500">
                      {entry.wins}W / {entry.losses}L
                      {entry.winStreak > 2 && <span className="text-neon-yellow ml-1">🔥{entry.winStreak}</span>}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </PixelPanel>
      </div>
    </main>
  )
}
