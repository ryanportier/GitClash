'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { PixelButton, PixelPanel, RarityBadge, ClassBadge, StatBar, HpBar, PixelLoader } from '@/components/ui/pixel-ui'
import { CLASS_CONFIGS, RARITY_CONFIG } from '@/types'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [fighter, setFighter] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [battles, setBattles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.replace('/auth'); return }

      const [{ data: f }, { data: p }, { data: b }] = await Promise.all([
        supabase.from('fighters').select('*').eq('user_id', session.user.id).single(),
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('battles').select('*').or(`player1_id.eq.${session.user.id},player2_id.eq.${session.user.id}`).order('created_at', { ascending: false }).limit(10),
      ])

      setFighter(f)
      setProfile(p)
      setBattles(b || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  if (loading) {
    return <div className="min-h-screen arena-bg flex items-center justify-center"><PixelLoader label="Loading profile..." /></div>
  }

  if (!fighter) {
    return (
      <div className="min-h-screen arena-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-pixel text-xs text-iron-400">No fighter found</p>
          <PixelButton onClick={() => router.push('/summon')}>Generate Fighter</PixelButton>
        </div>
      </div>
    )
  }

  const classConfig = CLASS_CONFIGS[fighter.class as keyof typeof CLASS_CONFIGS]
  const rarityConfig = RARITY_CONFIG[fighter.rarity as keyof typeof RARITY_CONFIG]
  const stats = fighter.stats as any
  const winRate = fighter.wins + fighter.losses > 0
    ? Math.round((fighter.wins / (fighter.wins + fighter.losses)) * 100)
    : 0

  return (
    <main className="min-h-screen arena-bg px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Nav */}
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/')} className="font-pixel text-xs text-ember-400 hover:text-ember-300">
            ← GITCLASH
          </button>
          <div className="flex gap-2">
            <PixelButton variant="primary" size="sm" onClick={() => router.push('/arena')}>⚔ Battle</PixelButton>
            <PixelButton variant="ghost" size="sm" onClick={handleLogout}>Logout</PixelButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fighter card */}
          <div className="md:col-span-1">
            <PixelPanel glowColor={rarityConfig.glowColor} className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={fighter.avatar_url} alt="avatar" className="w-10 h-10 border border-iron-600" />
                <div>
                  <p className="font-pixel text-xs text-white">{fighter.name}</p>
                  <p className="font-pixel text-[10px]" style={{ color: classConfig.color }}>{fighter.title}</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <RarityBadge rarity={fighter.rarity} />
                <ClassBadge fighterClass={fighter.class} />
              </div>

              <div className="flex justify-center py-2">
                <FighterSprite
                  fighterClass={fighter.class}
                  state="idle"
                  size={140}
                  glowColor={rarityConfig.glowColor}
                  animated
                />
              </div>

              <HpBar current={fighter.hp} max={fighter.max_hp} />

              <div className="font-mono text-xs grid grid-cols-2 gap-2 text-iron-400">
                <span>Level: <span className="text-ember-400">{fighter.level}</span></span>
                <span>XP: <span className="text-ember-400">{fighter.xp}</span></span>
                <span>W: <span className="text-green-400">{fighter.wins}</span></span>
                <span>L: <span className="text-red-400">{fighter.losses}</span></span>
                <span>Streak: <span className="text-neon-yellow">{fighter.win_streak}</span></span>
                <span>Rate: <span className="text-ember-400">{winRate}%</span></span>
              </div>

              {profile && (
                <div className="border-t border-iron-700 pt-3">
                  <p className="font-pixel text-xs text-iron-400">Rank Points</p>
                  <p className="font-pixel text-lg neon-text-red">{profile.rank_points}</p>
                  <p className="font-mono text-xs text-iron-500">{profile.rank_title}</p>
                </div>
              )}
            </PixelPanel>
          </div>

          {/* Stats + History */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats */}
            <PixelPanel title="Combat Stats" glowColor={classConfig.color}>
              <div className="space-y-2">
                {Object.entries(stats).map(([key, val]) => (
                  <StatBar key={key} label={key} value={val as number} color={classConfig.color} />
                ))}
              </div>
            </PixelPanel>

            {/* Class info */}
            <PixelPanel title="Class Profile">
              <p className="font-mono text-xs text-iron-300 mb-3">{classConfig.description}</p>
              <div className="space-y-1">
                <p className="font-pixel text-[10px] text-iron-500 uppercase tracking-wider">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {classConfig.skills.filter((v, i, a) => a.indexOf(v) === i).map(skill => (
                    <span key={skill} className="font-mono text-xs border border-iron-700 px-2 py-0.5 text-iron-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </PixelPanel>

            {/* Battle history */}
            <PixelPanel title="Battle History">
              {battles.length === 0 ? (
                <p className="font-mono text-xs text-iron-600 italic">No battles yet. Challenge someone!</p>
              ) : (
                <div className="space-y-2">
                  {battles.map((b: any) => {
                    const won = b.winner_id === profile?.id
                    return (
                      <div key={b.id} className={`flex items-center justify-between p-2 border ${won ? 'border-green-800 bg-green-950/30' : 'border-red-900 bg-red-950/20'}`}>
                        <span className={`font-pixel text-xs ${won ? 'text-green-400' : 'text-red-400'}`}>
                          {won ? '⚡ WIN' : '💀 LOSS'}
                        </span>
                        <span className="font-mono text-xs text-iron-500">
                          {won ? `+${b.rank_points_change}` : `-${Math.floor(b.rank_points_change * 0.5)}`} RP
                        </span>
                        <span className="font-mono text-[10px] text-iron-600">
                          {new Date(b.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </PixelPanel>
          </div>
        </div>
      </div>
    </main>
  )
}
