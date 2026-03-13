'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BattleArena } from '@/components/battle/battle-arena'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { PixelButton, PixelPanel, PixelLoader, RarityBadge } from '@/components/ui/pixel-ui'
import { Battle, Fighter, CLASS_CONFIGS, RARITY_CONFIG } from '@/types'

type Phase = 'matchmaking' | 'confirm' | 'battling' | 'results' | 'error'

function dbToFighter(row: any): Fighter {
  return {
    id: row.id, userId: row.user_id, githubUsername: row.github_username,
    name: row.name, class: row.class, rarity: row.rarity, title: row.title,
    stats: row.stats, level: row.level, xp: row.xp, hp: row.max_hp, maxHp: row.max_hp,
    wins: row.wins, losses: row.losses, winStreak: row.win_streak, badges: row.badges || [],
    auraColor: row.aura_color, spriteSeed: row.sprite_seed, avatarUrl: row.avatar_url,
    createdAt: row.created_at, lastSyncAt: row.last_sync_at,
  }
}

export default function ArenaPage() {
  const supabase = createClient()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('matchmaking')
  const [myFighter, setMyFighter] = useState<Fighter | null>(null)
  const [opponents, setOpponents] = useState<Fighter[]>([])
  const [selectedOpponent, setSelectedOpponent] = useState<Fighter | null>(null)
  const [battle, setBattle] = useState<Battle | null>(null)
  const [loading, setLoading] = useState(true)
  const [battling, setBattling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }

      const [{ data: myRow }, { data: opponentRows }] = await Promise.all([
        supabase.from('fighters').select('*').eq('user_id', session.user.id).single(),
        supabase.from('fighters').select('*').neq('user_id', session.user.id).limit(6),
      ])

      if (!myRow) { router.replace('/summon'); return }

      setMyFighter(dbToFighter(myRow))
      setOpponents((opponentRows || []).map(dbToFighter))
      setLoading(false)
    }
    load()
  }, [])

  async function startBattle(opponent: Fighter) {
    setSelectedOpponent(opponent)
    setBattling(true)
    setPhase('battling')

    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opponentId: opponent.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBattle(data.battle)
    } catch (err: any) {
      setError(err.message)
      setPhase('error')
    } finally {
      setBattling(false)
    }
  }

  function onBattleComplete(winnerId: string | null) {
    setTimeout(() => setPhase('results'), 1000)
  }

  if (loading) {
    return <div className="min-h-screen arena-bg flex items-center justify-center"><PixelLoader label="Loading arena..." /></div>
  }

  return (
    <main className="min-h-screen arena-bg px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/profile')} className="font-pixel text-xs text-ember-400 hover:text-ember-300">
            ← Profile
          </button>
          <h1 className="font-pixel text-xs text-iron-400 uppercase tracking-widest">Battle Arena</h1>
          <button onClick={() => router.push('/leaderboard')} className="font-pixel text-xs text-ember-400 hover:text-ember-300">
            Leaderboard →
          </button>
        </div>

        {/* Matchmaking */}
        {phase === 'matchmaking' && myFighter && (
          <div className="space-y-6">
            <PixelPanel title="Your Fighter" glowColor={RARITY_CONFIG[myFighter.rarity].glowColor}>
              <div className="flex items-center gap-4">
                <FighterSprite fighterClass={myFighter.class} state="idle" size={80} glowColor={RARITY_CONFIG[myFighter.rarity].glowColor} animated />
                <div>
                  <p className="font-pixel text-sm text-white">{myFighter.name}</p>
                  <p className="font-mono text-xs text-iron-400">{myFighter.title}</p>
                  <p className="font-mono text-xs text-iron-500 mt-1">W:{myFighter.wins} L:{myFighter.losses}</p>
                </div>
              </div>
            </PixelPanel>

            <div>
              <h2 className="font-pixel text-xs text-iron-400 uppercase tracking-widest mb-4">Choose Opponent</h2>
              {opponents.length === 0 ? (
                <PixelPanel>
                  <p className="font-mono text-xs text-iron-500 italic text-center py-4">
                    No opponents online. Invite friends to join GitClash!
                  </p>
                </PixelPanel>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {opponents.map(op => (
                    <PixelPanel
                      key={op.id}
                      glowColor={RARITY_CONFIG[op.rarity].glowColor}
                      className="cursor-pointer hover:scale-[1.02] transition-transform space-y-3"
                      onClick={() => startBattle(op)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-pixel text-[10px] text-white truncate">{op.name}</p>
                        <RarityBadge rarity={op.rarity} />
                      </div>
                      <div className="flex justify-center">
                        <FighterSprite fighterClass={op.class} state="idle" size={64} glowColor={RARITY_CONFIG[op.rarity].glowColor} animated flipped />
                      </div>
                      <div className="font-mono text-[10px] text-iron-500 flex justify-between">
                        <span>W:{op.wins}</span><span>L:{op.losses}</span><span>LV{op.level}</span>
                      </div>
                      <PixelButton variant="danger" size="sm" className="w-full" onClick={e => { e.stopPropagation(); startBattle(op) }}>
                        ⚔ Challenge
                      </PixelButton>
                    </PixelPanel>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Battle in progress */}
        {phase === 'battling' && myFighter && selectedOpponent && (
          <div className="space-y-4">
            {battling ? (
              <PixelLoader label="Simulating battle..." />
            ) : battle ? (
              <BattleArena battle={battle} onComplete={onBattleComplete} autoPlay speed={700} />
            ) : null}
          </div>
        )}

        {/* Results */}
        {phase === 'results' && battle && myFighter && selectedOpponent && (
          <ResultsScreen
            battle={battle}
            myFighter={myFighter}
            opponent={selectedOpponent}
            onRematch={() => { setPhase('matchmaking'); setBattle(null) }}
            onLeaderboard={() => router.push('/leaderboard')}
          />
        )}

        {phase === 'error' && (
          <div className="text-center space-y-4 py-12">
            <p className="font-pixel text-xs text-red-400">{error}</p>
            <PixelButton onClick={() => setPhase('matchmaking')}>← Back</PixelButton>
          </div>
        )}
      </div>
    </main>
  )
}

function ResultsScreen({ battle, myFighter, opponent, onRematch, onLeaderboard }: {
  battle: Battle
  myFighter: Fighter
  opponent: Fighter
  onRematch: () => void
  onLeaderboard: () => void
}) {
  const iWon = battle.winnerId === myFighter.id
  const isDraw = !battle.winnerId

  return (
    <div className="space-y-6 text-center">
      {/* Result header */}
      <div className="py-6">
        <p className="font-pixel text-xs text-iron-500 uppercase tracking-widest mb-2">Battle Complete</p>
        <h2 className={`font-pixel text-3xl ${iWon ? 'neon-text-red' : isDraw ? 'text-iron-400' : 'text-red-400'}`}>
          {iWon ? '⚡ VICTORY!' : isDraw ? '⚖ DRAW' : '💀 DEFEAT'}
        </h2>
      </div>

      {/* Fighters */}
      <div className="flex items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <FighterSprite
            fighterClass={myFighter.class}
            state={iWon ? 'victory' : 'defeat'}
            size={100}
            glowColor={iWon ? '#ffd700' : '#ff2040'}
            animated
          />
          <p className="font-pixel text-xs text-white">{myFighter.name}</p>
        </div>
        <span className="font-pixel text-iron-600">VS</span>
        <div className="flex flex-col items-center gap-2">
          <FighterSprite
            fighterClass={opponent.class}
            state={!iWon && !isDraw ? 'victory' : 'defeat'}
            size={100}
            glowColor={!iWon && !isDraw ? '#ffd700' : '#ff2040'}
            animated
            flipped
          />
          <p className="font-pixel text-xs text-white">{opponent.name}</p>
        </div>
      </div>

      {/* Rewards */}
      <PixelPanel title="Rewards" className="max-w-sm mx-auto">
        <div className="space-y-2 text-center">
          <p className="font-mono text-xs text-iron-300">
            XP: <span className="text-ember-400">+{battle.xpGained}</span>
          </p>
          {iWon && (
            <p className="font-mono text-xs text-iron-300">
              Rank Points: <span className="text-green-400">+{battle.rankPointsChange}</span>
            </p>
          )}
          <p className="font-mono text-xs text-iron-500">
            Turns: {battle.actions.length}
          </p>
        </div>
      </PixelPanel>

      <div className="flex gap-3 justify-center">
        <PixelButton variant="primary" onClick={onRematch}>⚔ Rematch</PixelButton>
        <PixelButton variant="secondary" onClick={onLeaderboard}>🏆 Leaderboard</PixelButton>
      </div>
    </div>
  )
}
