'use client'
import { useState } from 'react'
import { FighterClass, SpriteState, Fighter, RARITY_CONFIG, CLASS_CONFIGS } from '@/types'
import { getSpritePath, generatePlaceholderSvg, svgToDataUrl } from '@/lib/game/assets'
import { cn } from '@/lib/utils'
import { RarityBadge, ClassBadge, StatBar, HpBar, PixelPanel } from '@/components/ui/pixel-ui'

// ============================================================
// FIGHTER SPRITE
// Loads SVG files from /public/sprites/{class}/{state}.svg
// Falls back to inline SVG placeholder if file is missing
// To use real PNG art: change ext='png' and drop files at same paths
// ============================================================

interface FighterSpriteProps {
  fighterClass: FighterClass
  state?: SpriteState
  size?: number
  className?: string
  flipped?: boolean
  animated?: boolean
  glowColor?: string
  ext?: 'svg' | 'png'
}

export function FighterSprite({
  fighterClass,
  state = 'idle',
  size = 128,
  className,
  flipped = false,
  animated = true,
  glowColor,
  ext = 'svg',
}: FighterSpriteProps) {
  const [errored, setErrored] = useState(false)

  const src = errored
    ? svgToDataUrl(generatePlaceholderSvg(fighterClass, state, size))
    : getSpritePath(fighterClass, state, ext)

  return (
    <div
      className={cn('relative inline-block', className)}
      style={{
        width: size,
        height: size,
        filter: glowColor ? `drop-shadow(0 0 8px ${glowColor})` : undefined,
      }}
    >
      <img
        src={src}
        alt={`${fighterClass} ${state}`}
        width={size}
        height={size}
        className={cn(
          'object-contain pixel-art',
          animated && state === 'idle' && 'animate-battle-idle',
          animated && state === 'attack' && 'animate-shake',
          animated && state === 'hit' && 'animate-flash',
          flipped && '[transform:scaleX(-1)]',
        )}
        onError={() => setErrored(true)}
      />
    </div>
  )
}

// ============================================================
// FIGHTER CARD — profile, summon, leaderboard
// ============================================================

interface FighterCardProps {
  fighter: Fighter
  compact?: boolean
  className?: string
}

export function FighterCard({ fighter, compact = false, className }: FighterCardProps) {
  const rarityConfig = RARITY_CONFIG[fighter.rarity]
  const classConfig = CLASS_CONFIGS[fighter.class]

  return (
    <PixelPanel glowColor={rarityConfig.glowColor} className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-pixel text-sm text-white tracking-widest">{fighter.name}</h3>
          <p className="font-pixel text-xs mt-1" style={{ color: classConfig.color }}>{fighter.title}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RarityBadge rarity={fighter.rarity} />
          <ClassBadge fighterClass={fighter.class} />
        </div>
      </div>

      <div className="flex justify-center py-2">
        <FighterSprite
          fighterClass={fighter.class}
          state="idle"
          size={compact ? 80 : 128}
          glowColor={rarityConfig.glowColor}
          animated
        />
      </div>

      {!compact && (
        <div className="space-y-1">
          {Object.entries(fighter.stats).map(([key, val]) => (
            <StatBar key={key} label={key} value={val as number} color={classConfig.color} />
          ))}
        </div>
      )}

      <div className="flex justify-between font-pixel text-xs text-void-400 border-t border-void-700 pt-2">
        <span>W: <span className="text-neon-green">{fighter.wins}</span></span>
        <span>L: <span className="text-red-400">{fighter.losses}</span></span>
        <span>LVL: <span className="text-cyber-400">{fighter.level}</span></span>
      </div>
    </PixelPanel>
  )
}
