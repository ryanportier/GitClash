'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PixelButton, PixelPanel } from '@/components/ui/pixel-ui'
import { useRouter } from 'next/navigation'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { Github, Zap, Shield, Star, Brain } from 'lucide-react'
import { GitClashLogo } from '@/components/ui/logo'
import { TwitterXIcon, BankrIcon } from '@/components/ui/social-icons'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/summon')
      else setChecking(false)
    })
  }, [])

  async function handleGitHubLogin() {
    setLoading('github')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'read:user public_repo',
      },
    })
    if (error) { console.error(error); setLoading(null) }
  }

  async function handleTwitterLogin() {
    setLoading('twitter')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { console.error(error); setLoading(null) }
  }

  if (checking) {
    return (
      <div className="min-h-screen arena-bg flex items-center justify-center">
        <p className="font-pixel text-xs text-ember-400 animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen arena-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <GitClashLogo size={56} showText={false} href="" />
          <h1 className="font-pixel text-2xl neon-text-red animate-flicker">GITCLASH</h1>
          <p className="font-mono text-xs text-iron-400 text-center">
            Connect to generate your fighter
          </p>
        </div>

        {/* Fighter preview */}
        <div className="flex justify-center gap-4">
          <FighterSprite fighterClass="architect"   state="idle" size={72} glowColor="#ffcc00" animated />
          <FighterSprite fighterClass="data-mage"   state="idle" size={72} glowColor="#9040ff" animated />
          <FighterSprite fighterClass="code-ranger" state="idle" size={72} glowColor="#ff1030" animated />
        </div>

        {/* Login panel */}
        <PixelPanel glowColor="#e81010" title="Choose Login">
          <div className="space-y-3">

            {/* GitHub — primary, reads code stats */}
            <PixelButton
              variant="primary" size="lg" className="w-full"
              onClick={handleGitHubLogin}
              disabled={loading !== null}
            >
              <Github className="w-4 h-4 inline mr-2" />
              {loading === 'github' ? 'Connecting...' : 'Login with GitHub'}
            </PixelButton>
            <p className="font-mono text-[10px] text-iron-600 text-center -mt-1">
              Reads commits, repos, stars → builds your fighter stats
            </p>

            {/* Divider */}
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 h-px bg-iron-800"/>
              <span className="font-pixel text-[9px] text-iron-700">OR</span>
              <div className="flex-1 h-px bg-iron-800"/>
            </div>

            {/* Twitter/X */}
            <PixelButton
              variant="secondary" size="lg" className="w-full"
              onClick={handleTwitterLogin}
              disabled={loading !== null}
            >
              <TwitterXIcon className="w-4 h-4 inline mr-2" />
              {loading === 'twitter' ? 'Connecting...' : 'Login with X / Twitter'}
            </PixelButton>
            <p className="font-mono text-[10px] text-iron-600 text-center -mt-1">
              Fighter generated from follower + activity signals
            </p>

            {/* Bankr — external link */}
            <a
              href="https://bankr.bot"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <PixelButton
                variant="ghost" size="lg" className="w-full"
                disabled={loading !== null}
              >
                <BankrIcon className="w-4 h-4 inline mr-2" />
                Open Bankr.bot
              </PixelButton>
            </a>
            <p className="font-mono text-[10px] text-iron-600 text-center -mt-1">
              Trade your fighter card on Bankr
            </p>

          </div>
        </PixelPanel>

        {/* Stats preview */}
        <PixelPanel className="grid grid-cols-2 gap-2 !p-3">
          {[
            { icon: <Zap className="w-3 h-3" />,    text: 'Commits → Attack',      color: '#ff1030' },
            { icon: <Shield className="w-3 h-3" />, text: 'Consistency → Defense', color: '#ff8800' },
            { icon: <Star className="w-3 h-3" />,   text: 'Stars → Influence',     color: '#ffcc00' },
            { icon: <Brain className="w-3 h-3" />,  text: 'Languages → Intel',     color: '#a040ff' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-1.5 font-mono text-[10px] text-iron-400">
              <span style={{ color: item.color }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </PixelPanel>

        <p className="font-mono text-[10px] text-iron-700 text-center">
          gitclash.fun · Only public data is read
        </p>
      </div>
    </main>
  )
}
