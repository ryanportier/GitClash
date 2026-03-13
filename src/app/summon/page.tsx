'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { PixelButton, PixelPanel, RarityBadge, ClassBadge, StatBar, PixelLoader } from '@/components/ui/pixel-ui'
import { Fighter, FighterMetrics, CLASS_CONFIGS, RARITY_CONFIG } from '@/types'
import { cn } from '@/lib/utils'

type Phase = 'loading' | 'syncing' | 'revealing' | 'done' | 'error'

export default function SummonPage() {
  const supabase = createClient()
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [fighter, setFighter] = useState<any>(null)
  const [metrics, setMetrics] = useState<FighterMetrics | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }

      // Check if fighter exists
      const { data: existing } = await supabase
        .from('fighters')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (existing) {
        setFighter(existing)
        setPhase('done')
      } else {
        // New user — sync
        setPhase('syncing')
        await syncFighter()
      }
    }
    init()
  }, [])

  async function syncFighter() {
    setPhase('syncing')
    try {
      const res = await fetch('/api/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setFighter(data.fighter)
      setMetrics(data.metrics)

      // Dramatic reveal
      setPhase('revealing')
      await new Promise(r => setTimeout(r, 2000))
      setPhase('done')
    } catch (err: any) {
      setError(err.message || 'Failed to generate fighter')
      setPhase('error')
    }
  }

  if (phase === 'loading') {
    return <CenteredLoader label="Loading your data..." />
  }

  if (phase === 'syncing') {
    return <CenteredLoader label="Reading GitHub activity..." sublabel="Analyzing commits, repos, and contributions" />
  }

  if (phase === 'revealing') {
    return <RevealScreen fighter={fighter} />
  }

  if (phase === 'error') {
    return (
      <CenteredError error={error} onRetry={syncFighter} />
    )
  }

  if (!fighter) return null

  const classConfig = CLASS_CONFIGS[fighter.class as keyof typeof CLASS_CONFIGS]
  const rarityConfig = RARITY_CONFIG[fighter.rarity as keyof typeof RARITY_CONFIG]
  const stats = fighter.stats as any

  return (
    <main className="min-h-screen arena-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <p className="font-pixel text-xs text-ember-400 tracking-widest mb-2">FIGHTER SUMMONED</p>
          <h1 className="font-pixel text-xl text-white">{fighter.name}</h1>
          <p className="font-pixel text-xs mt-1" style={{ color: classConfig.color }}>{fighter.title}</p>
        </div>

        {/* Fighter portrait */}
        <PixelPanel glowColor={rarityConfig.glowColor} className="text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-3">
              <RarityBadge rarity={fighter.rarity} />
              <ClassBadge fighterClass={fighter.class} />
            </div>
            <FighterSprite
              fighterClass={fighter.class}
              state="idle"
              size={160}
              glowColor={rarityConfig.glowColor}
              animated
            />
            <p className="font-mono text-xs text-iron-400">{classConfig.description}</p>
          </div>
        </PixelPanel>

        {/* Stats */}
        <PixelPanel title="Combat Stats" glowColor={classConfig.color}>
          <div className="space-y-2">
            {Object.entries(stats).map(([key, val]) => (
              <StatBar key={key} label={key} value={val as number} color={classConfig.color} />
            ))}
          </div>
        </PixelPanel>

        {/* Metrics preview */}
        {metrics && (
          <PixelPanel title="GitHub Signals" className="grid grid-cols-2 gap-2">
            {[
              { label: 'Recent Commits', value: metrics.recentCommits },
              { label: 'Top Language', value: metrics.topLanguage },
              { label: 'Stars Earned', value: metrics.starsReceived },
              { label: 'Merged PRs', value: metrics.mergedPRs },
            ].map(m => (
              <div key={m.label} className="bg-void-800 p-2">
                <p className="font-mono text-[10px] text-iron-500 uppercase">{m.label}</p>
                <p className="font-pixel text-xs text-ember-400 mt-1">{m.value}</p>
              </div>
            ))}
          </PixelPanel>
        )}

        <div className="flex gap-3">
          <PixelButton variant="primary" size="lg" className="flex-1" onClick={() => router.push('/profile')}>
            View Profile
          </PixelButton>
          <PixelButton variant="secondary" size="lg" className="flex-1" onClick={() => router.push('/arena')}>
            ⚔ Battle!
          </PixelButton>
        </div>

        <button
          onClick={syncFighter}
          className="w-full font-pixel text-xs text-iron-600 hover:text-ember-400 transition-colors py-2"
        >
          ↻ Re-sync GitHub data
        </button>
      </div>
    </main>
  )
}

function CenteredLoader({ label, sublabel }: { label: string; sublabel?: string }) {
  return (
    <div className="min-h-screen arena-bg flex flex-col items-center justify-center gap-6">
      <PixelLoader label={label} />
      {sublabel && <p className="font-mono text-xs text-iron-500">{sublabel}</p>}
    </div>
  )
}

function RevealScreen({ fighter }: { fighter: any }) {
  const rarityConfig = RARITY_CONFIG[fighter.rarity as keyof typeof RARITY_CONFIG]
  return (
    <div className="min-h-screen arena-bg flex flex-col items-center justify-center gap-6">
      <p className="font-pixel text-xs text-ember-400 animate-pulse uppercase tracking-widest">
        Fighter Detected
      </p>
      <div className="animate-pixel-float">
        <FighterSprite
          fighterClass={fighter.class}
          state="victory"
          size={200}
          glowColor={rarityConfig.glowColor}
          animated
        />
      </div>
      <p className="font-pixel text-2xl neon-text-red">{fighter.name}</p>
      <RarityBadge rarity={fighter.rarity} />
    </div>
  )
}

function CenteredError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen arena-bg flex flex-col items-center justify-center gap-4">
      <p className="font-pixel text-xs text-red-400">Error: {error}</p>
      <PixelButton onClick={onRetry}>Retry</PixelButton>
    </div>
  )
}
