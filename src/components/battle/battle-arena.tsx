'use client'
import { useState, useEffect, useRef } from 'react'
import { Battle, BattleAction, Fighter } from '@/types'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { HpBar, PixelPanel, PixelButton } from '@/components/ui/pixel-ui'
import { RARITY_CONFIG } from '@/types'
import { cn } from '@/lib/utils'

interface BattleArenaProps {
  battle: Battle
  onComplete?: (winnerId: string | null) => void
  autoPlay?: boolean
  speed?: number
}

export function BattleArena({ battle, onComplete, autoPlay = true, speed = 800 }: BattleArenaProps) {
  const [currentTurn, setCurrentTurn] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [hp1, setHp1] = useState(battle.player1Fighter.maxHp)
  const [hp2, setHp2] = useState(battle.player2Fighter.maxHp)
  const [p1State, setP1State] = useState<'idle' | 'attack' | 'hit' | 'victory' | 'defeat'>('idle')
  const [p2State, setP2State] = useState<'idle' | 'attack' | 'hit' | 'victory' | 'defeat'>('idle')
  const [visibleLog, setVisibleLog] = useState<BattleAction[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const p1 = battle.player1Fighter
  const p2 = battle.player2Fighter

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [visibleLog])

  useEffect(() => {
    if (!isPlaying || currentTurn >= battle.actions.length) return

    intervalRef.current = setTimeout(() => {
      const action = battle.actions[currentTurn]
      const isP1Actor = action.actorId === p1.id

      // Update HP
      setHp1(isP1Actor ? action.attackerHpAfter : action.defenderHpAfter)
      setHp2(isP1Actor ? action.defenderHpAfter : action.attackerHpAfter)

      // Sprite states
      if (isP1Actor) {
        setP1State('attack')
        setP2State('hit')
      } else {
        setP2State('attack')
        setP1State('hit')
      }

      // Reset to idle after animation
      setTimeout(() => {
        setP1State('idle')
        setP2State('idle')
      }, 400)

      setVisibleLog(prev => [...prev, action])
      setCurrentTurn(t => t + 1)
    }, speed)

    return () => clearTimeout(intervalRef.current)
  }, [isPlaying, currentTurn, battle.actions, p1.id, speed])

  // Handle completion
  useEffect(() => {
    if (currentTurn >= battle.actions.length && battle.actions.length > 0) {
      setIsPlaying(false)
      setIsComplete(true)

      // Set final states
      if (battle.winnerId === p1.id) {
        setP1State('victory')
        setP2State('defeat')
      } else if (battle.winnerId === p2.id) {
        setP2State('victory')
        setP1State('defeat')
      }

      setTimeout(() => onComplete?.(battle.winnerId), 500)
    }
  }, [currentTurn, battle])

  const winner = battle.winnerId === p1.id ? p1 : battle.winnerId === p2.id ? p2 : null

  return (
    <div className="w-full space-y-4">
      {/* Arena */}
      <div className="relative w-full bg-void-950 border-2 border-iron-700 overflow-hidden"
           style={{ minHeight: 280 }}>
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-dark bg-grid opacity-40" />
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none" />

        {/* Floor line */}
        <div className="absolute bottom-16 left-0 right-0 h-px bg-ember-700 opacity-40" />

        {/* Fighter 1 — left */}
        <div className="absolute bottom-16 left-12 flex flex-col items-center gap-2">
          <HpBar current={hp1} max={p1.maxHp} className="w-40" />
          <p className="font-pixel text-xs text-white truncate w-40 text-center">{p1.name}</p>
          <FighterSprite
            fighterClass={p1.class}
            state={p1State}
            size={112}
            glowColor={RARITY_CONFIG[p1.rarity].glowColor}
            animated
          />
        </div>

        {/* VS */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="font-pixel text-2xl text-iron-600">VS</span>
        </div>

        {/* Fighter 2 — right */}
        <div className="absolute bottom-16 right-12 flex flex-col items-center gap-2">
          <HpBar current={hp2} max={p2.maxHp} className="w-40" />
          <p className="font-pixel text-xs text-white truncate w-40 text-center">{p2.name}</p>
          <FighterSprite
            fighterClass={p2.class}
            state={p2State}
            size={112}
            glowColor={RARITY_CONFIG[p2.rarity].glowColor}
            animated
            flipped
          />
        </div>

        {/* Win overlay */}
        {isComplete && winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-void-950/60">
            <div className="font-pixel text-center">
              <p className="text-2xl text-neon-yellow animate-pulse">{winner.name}</p>
              <p className="text-sm text-ember-400 mt-1 uppercase tracking-widest">VICTORY!</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        <PixelButton
          variant="secondary"
          size="sm"
          onClick={() => setIsPlaying(p => !p)}
          disabled={isComplete}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </PixelButton>
        <PixelButton
          variant="ghost"
          size="sm"
          onClick={() => {
            setCurrentTurn(battle.actions.length - 1)
            setIsPlaying(true)
          }}
          disabled={isComplete}
        >
          ⏭ Skip
        </PixelButton>
      </div>

      {/* Battle Log */}
      <PixelPanel title="Battle Log" className="max-h-48 overflow-hidden">
        <div ref={logRef} className="overflow-y-auto max-h-36 space-y-1 pr-1">
          {visibleLog.map((action, i) => (
            <div
              key={i}
              className={cn(
                'font-mono text-xs py-0.5 border-b border-iron-800',
                action.isCrit ? 'text-neon-yellow' : 'text-iron-300',
              )}
            >
              <span className="text-iron-600 mr-2">[{action.turn}]</span>
              {action.log}
            </div>
          ))}
          {visibleLog.length === 0 && (
            <p className="font-pixel text-xs text-iron-600 italic">Battle starting...</p>
          )}
        </div>
      </PixelPanel>
    </div>
  )
}
