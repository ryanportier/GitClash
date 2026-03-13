import Link from 'next/link'
import { Github, Sword, Trophy, Zap, Star, GitMerge, Code2, Shield, Brain, TrendingUp, Clock } from 'lucide-react'
import { GitClashLogo } from '@/components/ui/logo'
import { TwitterXIcon, BankrIcon } from '@/components/ui/social-icons'
import { FighterSprite } from '@/components/game/fighter-sprite'
import { PixelButton } from '@/components/ui/pixel-ui'
import { CLASS_CONFIGS, FighterClass } from '@/types'

// ============================================================
// ANIMATED GIF-LIKE COMPONENTS (pure CSS)
// ============================================================

function BattleGif() {
  return (
    <div className="relative w-full bg-void-950 border-2 border-iron-700 overflow-hidden"
         style={{ height: 220, boxShadow: '0 0 30px rgba(200,0,0,0.15)' }}>
      {/* arena grid bg */}
      <div className="absolute inset-0 bg-grid-dark bg-grid opacity-40" />
      {/* scanlines */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.1) 3px,rgba(0,0,0,0.1) 4px)' }} />

      {/* Floor */}
      <div className="absolute bottom-10 left-0 right-0 h-px bg-ember-900 opacity-60" />

      {/* HP bars top */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center gap-4">
        <div className="flex-1">
          <div className="font-pixel text-[8px] text-iron-400 mb-1">CODE RANGER</div>
          <div className="w-full h-2 bg-void-800 border border-iron-700 overflow-hidden">
            {/* animates between 100% and 55% */}
            <div className="h-full bg-green-500 animate-hp-tick" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <div className="font-pixel text-xs text-iron-600">VS</div>
        <div className="flex-1">
          <div className="font-pixel text-[8px] text-iron-400 mb-1 text-right">DATA MAGE</div>
          <div className="w-full h-2 bg-void-800 border border-iron-700 overflow-hidden">
            <div className="h-full bg-purple-500 animate-hp-tick" style={{ animationDuration: '2.3s', animationDelay: '0.8s' }} />
          </div>
        </div>
      </div>

      {/* Fighters */}
      <div className="absolute bottom-10 left-10 animate-battle-idle">
        <FighterSprite fighterClass="code-ranger" state="idle" size={80} glowColor="#ff1030" animated />
      </div>
      <div className="absolute bottom-10 right-10 animate-battle-idle" style={{ animationDelay: '0.5s' }}>
        <FighterSprite fighterClass="data-mage" state="idle" size={80} glowColor="#9040ff" animated flipped />
      </div>

      {/* Flash effect pulse */}
      <div className="absolute inset-0 animate-ember-pulse opacity-0"
           style={{ background: 'radial-gradient(ellipse at center, rgba(230,0,0,0.08) 0%, transparent 70%)', animationDuration: '2s' }} />

      {/* Battle log line at bottom */}
      <div className="absolute bottom-1 left-0 right-0 px-3">
        <div className="font-mono text-[8px] text-ember-500 animate-flicker truncate">
          ▶ Code Ranger uses Commit Storm — CRITICAL HIT! (28 dmg)
        </div>
      </div>
    </div>
  )
}

function StatGif() {
  const stats = [
    { label: 'ATK', w: 78, color: '#ff1030' },
    { label: 'DEF', w: 55, color: '#ff8800' },
    { label: 'SPD', w: 91, color: '#ffcc00' },
    { label: 'INT', w: 64, color: '#a040ff' },
    { label: 'INF', w: 42, color: '#ff6090' },
    { label: 'STA', w: 70, color: '#00cc60' },
  ]
  return (
    <div className="relative bg-void-950 border-2 border-iron-700 p-4 overflow-hidden"
         style={{ boxShadow: '0 0 20px rgba(200,0,0,0.12)' }}>
      <div className="font-pixel text-[8px] text-ember-500 uppercase tracking-widest mb-3">Fighter Stats</div>
      <div className="space-y-2">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="font-pixel text-[8px] text-iron-300 w-8">{s.label}</span>
            <div className="flex-1 h-2 bg-void-800 border border-iron-800 overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${s.w}%`,
                  backgroundColor: s.color,
                  boxShadow: `0 0 4px ${s.color}`,
                  animation: `statFill 1.5s ease-out ${i * 0.15}s both`,
                  '--target-w': `${s.w}%`,
                } as any}
              />
            </div>
            <span className="font-pixel text-[8px] text-iron-400 w-6 text-right">{s.w}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2 flex-wrap">
        {['Commit Storm', 'Streak Pulse'].map(skill => (
          <span key={skill} className="font-mono text-[8px] border border-ember-800 px-1.5 py-0.5 text-ember-400">{skill}</span>
        ))}
      </div>
    </div>
  )
}

function LeaderboardGif() {
  const rows = [
    { rank: 1, name: 'torvalds',    cls: 'architect',       pts: 2840, color: '#ffcc00' },
    { rank: 2, name: 'gvanrossum', cls: 'data-mage',        pts: 2610, color: '#c0c0c0' },
    { rank: 3, name: 'antirez',    cls: 'system-guardian',  pts: 2490, color: '#cd7f32' },
    { rank: 4, name: 'you?',       cls: 'rookie',           pts: 1000, color: '#6b3838' },
  ]
  return (
    <div className="relative bg-void-950 border-2 border-iron-700 overflow-hidden"
         style={{ boxShadow: '0 0 20px rgba(200,0,0,0.12)' }}>
      <div className="px-3 py-2 border-b border-iron-800">
        <span className="font-pixel text-[8px] text-ember-500 uppercase tracking-widest">Global Rankings</span>
      </div>
      {rows.map((r, i) => (
        <div key={r.rank}
             className="flex items-center gap-2 px-3 py-2 border-b border-iron-900"
             style={{ background: i === 3 ? 'rgba(200,0,0,0.06)' : undefined }}>
          <span className="font-pixel text-[9px] w-5" style={{ color: r.color }}>#{r.rank}</span>
          <FighterSprite fighterClass={r.cls as FighterClass} state="idle" size={24} animated={false} />
          <span className="font-mono text-[9px] text-iron-200 flex-1">{r.name}</span>
          <span className="font-pixel text-[8px]" style={{ color: r.color }}>{r.pts} RP</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// HOW IT WORKS STEPS
// ============================================================

function StepCard({ step, icon, title, desc, color }: { step: number; icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="relative bg-void-900 border border-iron-700 p-5 hover:border-ember-700 transition-colors group">
      <div className="absolute -top-3 -left-3 w-7 h-7 border-2 flex items-center justify-center font-pixel text-xs"
           style={{ borderColor: color, color, background: '#080202' }}>
        {step}
      </div>
      <div className="mb-3" style={{ color }}>{icon}</div>
      <h3 className="font-pixel text-xs text-white mb-2 uppercase tracking-wider">{title}</h3>
      <p className="font-mono text-xs text-iron-300 leading-relaxed">{desc}</p>
    </div>
  )
}

// ============================================================
// STAT EXPLAINER ROW
// ============================================================

function StatRow({ icon, stat, source, color }: { icon: React.ReactNode; stat: string; source: string; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-iron-900">
      <div style={{ color }}>{icon}</div>
      <div className="flex-1">
        <span className="font-pixel text-[9px] text-white">{stat}</span>
        <span className="font-mono text-[9px] text-iron-400 ml-2">← {source}</span>
      </div>
    </div>
  )
}

// ============================================================
// CLASS CARD
// ============================================================

function ClassCard({ cls }: { cls: FighterClass }) {
  const cfg = CLASS_CONFIGS[cls]
  return (
    <div className="flex flex-col items-center gap-2 p-3 border border-iron-800 hover:border-ember-700 transition-colors bg-void-900">
      <FighterSprite fighterClass={cls} state="idle" size={48} glowColor={cfg.color} animated />
      <span className="font-pixel text-[7px] text-center uppercase leading-tight" style={{ color: cfg.color }}>
        {cfg.displayName}
      </span>
      <span className="font-mono text-[8px] text-iron-400 text-center leading-tight">{cfg.description.split('.')[0]}</span>
    </div>
  )
}

// ============================================================
// LANDING PAGE
// ============================================================

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-void-950 text-white relative overflow-hidden">
      {/* Global hero glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(180,0,0,0.12) 0%, transparent 60%)'
      }} />

      {/* ── NAV ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-iron-800">
        <GitClashLogo size={36} showText />
        <div className="flex items-center gap-3">
          {/* Social links */}
          <a href="https://x.com/gitclash" target="_blank" rel="noopener noreferrer"
             className="text-iron-500 hover:text-ember-400 transition-colors" title="Twitter/X">
            <TwitterXIcon className="w-4 h-4" />
          </a>
          <a href="https://bankr.bot" target="_blank" rel="noopener noreferrer"
             className="text-iron-500 hover:text-ember-400 transition-colors" title="Bankr.bot">
            <BankrIcon className="w-4 h-4" />
          </a>
          <Link href="/leaderboard" className="font-pixel text-xs text-iron-300 hover:text-ember-400 transition-colors hidden sm:block">
            Leaderboard
          </Link>
          <Link href="/auth">
            <PixelButton variant="primary" size="sm">
              <Github className="w-3 h-3 inline mr-2" />
              Connect GitHub
            </PixelButton>
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
        <p className="font-pixel text-[10px] text-ember-500 tracking-[0.4em] mb-5 uppercase">
          GitHub-Powered Auto-Battler
        </p>
        <h1
          className="font-pixel text-5xl md:text-7xl neon-text-red mb-3 glitch-text leading-none"
          data-text="GITCLASH"
        >
          GITCLASH
        </h1>
        <p className="font-pixel text-xs text-iron-400 mb-12 tracking-[0.25em] uppercase">
          Your commits are your weapon
        </p>

        {/* Hero arena preview */}
        <div className="w-full max-w-2xl mx-auto mb-10">
          <BattleGif />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link href="/auth">
            <PixelButton variant="primary" size="lg">
              <Github className="w-4 h-4 inline mr-2" />
              Play Now — Free
            </PixelButton>
          </Link>
          <Link href="/leaderboard">
            <PixelButton variant="secondary" size="lg">
              <Trophy className="w-4 h-4 inline mr-2" />
              View Leaderboard
            </PixelButton>
          </Link>
        </div>
        <p className="font-mono text-xs text-iron-600 mt-4">No setup needed. Just your GitHub account.</p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="font-pixel text-[10px] text-ember-600 uppercase tracking-widest mb-2">How it works</p>
          <h2 className="font-pixel text-lg text-white">Four steps to battle</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StepCard step={1} color="#e81010" icon={<Github className="w-6 h-6" />}
            title="Connect"
            desc="Sign in with GitHub. We read your public activity — commits, repos, stars, PRs, languages." />
          <StepCard step={2} color="#ff8800" icon={<Zap className="w-6 h-6" />}
            title="Generate"
            desc="Your GitHub data is converted into combat stats. Class and rarity are assigned automatically based on what you actually build." />
          <StepCard step={3} color="#ffcc00" icon={<Sword className="w-6 h-6" />}
            title="Battle"
            desc="Choose an opponent. The auto-battle engine simulates a turn-based fight using your stats and skills. Watch it unfold." />
          <StepCard step={4} color="#00cc60" icon={<Trophy className="w-6 h-6" />}
            title="Rank Up"
            desc="Win battles to earn Rank Points, titles, badges, and aura upgrades. Climb the global leaderboard." />
        </div>
      </section>

      {/* ── STAT SYSTEM EXPLAINER ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: animated stat preview */}
          <div>
            <p className="font-pixel text-[10px] text-ember-600 uppercase tracking-widest mb-2">Stat System</p>
            <h2 className="font-pixel text-base text-white mb-4">Your GitHub activity becomes combat power</h2>
            <div className="border border-iron-800 divide-y divide-iron-900">
              <StatRow color="#ff1030" icon={<Zap className="w-3 h-3" />}     stat="Attack"       source="Recent commits + burst activity" />
              <StatRow color="#ff8800" icon={<Shield className="w-3 h-3" />}   stat="Defense"      source="Consistency score + merged PRs" />
              <StatRow color="#ffcc00" icon={<Clock className="w-3 h-3" />}    stat="Speed"        source="Weekly commit burst" />
              <StatRow color="#a040ff" icon={<Brain className="w-3 h-3" />}    stat="Intelligence" source="Language diversity + repo depth" />
              <StatRow color="#ff6090" icon={<Star className="w-3 h-3" />}     stat="Influence"    source="Stars earned + forks + contributions" />
              <StatRow color="#00cc60" icon={<Clock className="w-3 h-3" />}    stat="Stamina"      source="Account age + sustained activity" />
            </div>
          </div>
          {/* Right: animated stat card */}
          <StatGif />
        </div>
      </section>

      {/* ── FIGHTER CLASSES ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <p className="font-pixel text-[10px] text-ember-600 uppercase tracking-widest mb-2">Fighter Classes</p>
          <h2 className="font-pixel text-base text-white mb-2">7 classes. Auto-assigned from your stack.</h2>
          <p className="font-mono text-xs text-iron-400 max-w-md mx-auto">
            Heavy JS/TS user? You're a Code Ranger. Python and AI? Data Mage. Solidity? Chain Knight. The algorithm reads your history.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {(['code-ranger', 'data-mage', 'chain-knight', 'system-guardian', 'merge-monk', 'architect', 'rookie'] as FighterClass[]).map(cls => (
            <ClassCard key={cls} cls={cls} />
          ))}
        </div>
      </section>

      {/* ── RARITY SYSTEM ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-pixel text-[10px] text-ember-600 uppercase tracking-widest mb-2">Rarity System</p>
            <h2 className="font-pixel text-base text-white mb-4">Quality matters more than quantity</h2>
            <p className="font-mono text-xs text-iron-300 leading-relaxed mb-5">
              Rarity isn't about who has the most commits. It's calculated from signal quality: consistency over time, stars earned by others, external contributions, and merged pull requests. A focused contributor beats a commit spammer.
            </p>
            <div className="space-y-2">
              {[
                { rarity: 'Common',    color: '#a09098', pct: '50%', desc: 'Getting started' },
                { rarity: 'Uncommon',  color: '#00c060', pct: '28%', desc: 'Regular contributor' },
                { rarity: 'Rare',      color: '#0080ff', pct: '14%', desc: 'Consistent builder' },
                { rarity: 'Epic',      color: '#a020f0', pct: '6%',  desc: 'Highly influential' },
                { rarity: 'Legendary', color: '#ffd700', pct: '2%',  desc: 'Hall of fame tier' },
              ].map(r => (
                <div key={r.rarity} className="flex items-center gap-3">
                  <span className="font-pixel text-[9px] w-16" style={{ color: r.color }}>{r.rarity}</span>
                  <div className="flex-1 h-2 bg-void-800 border border-iron-800">
                    <div className="h-full" style={{ width: r.pct, backgroundColor: r.color }} />
                  </div>
                  <span className="font-mono text-[9px] text-iron-500 w-28">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <LeaderboardGif />
        </div>
      </section>

      {/* ── BATTLE SYSTEM ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <p className="font-pixel text-[10px] text-ember-600 uppercase tracking-widest mb-2">Battle System</p>
          <h2 className="font-pixel text-base text-white mb-2">Auto-battle. Full replay. No RNG abuse.</h2>
          <p className="font-mono text-xs text-iron-400 max-w-lg mx-auto">
            Battles are simulated turn-by-turn using your stats. Each fighter has class-specific skills. Results are deterministic given the same seed — no luck spam.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: 'Commit Storm',  desc: 'Rapid attack burst', color: '#ff1030' },
            { name: 'Merge Shield',  desc: 'Blocks incoming dmg', color: '#0080ff' },
            { name: 'Fork Echo',     desc: 'Double-hit attack', color: '#ffcc00' },
            { name: 'Streak Pulse',  desc: 'Speed crit strike', color: '#ff8800' },
            { name: 'Repo Surge',    desc: 'Massive single hit', color: '#a040ff' },
            { name: 'Silent Build',  desc: 'Hidden crit setup', color: '#00cc60' },
            { name: 'Chain Strike',  desc: 'Chained blockchain dmg', color: '#ffaa00' },
            { name: 'Basic Attack',  desc: 'Reliable fallback', color: '#808090' },
          ].map(s => (
            <div key={s.name} className="bg-void-900 border border-iron-800 p-3 hover:border-ember-700 transition-colors">
              <div className="font-pixel text-[9px] mb-1 uppercase" style={{ color: s.color }}>{s.name}</div>
              <div className="font-mono text-[9px] text-iron-400">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-block mb-6">
            <FighterSprite fighterClass="architect" state="victory" size={100} glowColor="#ffcc00" animated />
          </div>
          <h2 className="font-pixel text-xl neon-text-red mb-3 animate-flicker">Ready to fight?</h2>
          <p className="font-mono text-sm text-iron-400 mb-8">
            Connect your GitHub and see what class you get. Takes 10 seconds.
          </p>
          <Link href="/auth">
            <PixelButton variant="primary" size="lg">
              <Github className="w-5 h-5 inline mr-2" />
              Connect GitHub — It's Free
            </PixelButton>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-iron-900 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <GitClashLogo size={28} showText />
          <p className="font-mono text-xs text-iron-700">
            Only reads public data. No writes. · gitclash.fun
          </p>
          <div className="flex items-center gap-4">
            <a href="https://x.com/gitclash" target="_blank" rel="noopener noreferrer"
               className="font-pixel text-[10px] text-iron-600 hover:text-ember-400 transition-colors flex items-center gap-1">
              <TwitterXIcon className="w-3 h-3" /> Twitter
            </a>
            <a href="https://bankr.bot" target="_blank" rel="noopener noreferrer"
               className="font-pixel text-[10px] text-iron-600 hover:text-ember-400 transition-colors flex items-center gap-1">
              <BankrIcon className="w-3 h-3" /> Bankr
            </a>
            <Link href="/leaderboard" className="font-pixel text-[10px] text-iron-600 hover:text-ember-500 transition-colors">Leaderboard</Link>
            <Link href="/auth" className="font-pixel text-[10px] text-iron-600 hover:text-ember-500 transition-colors">Play</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
