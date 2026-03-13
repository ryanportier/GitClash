import {
  FighterClass,
  FighterMetrics,
  FighterStats,
  Rarity,
  Fighter,
  CLASS_CONFIGS,
} from '@/types'

// ============================================================
// STAT DERIVATION
// ============================================================

export function deriveStats(metrics: FighterMetrics): FighterStats {
  const clamp = (v: number) => Math.min(100, Math.max(1, Math.round(v)))

  // Attack = recent commit activity
  const attack = clamp(
    metrics.recentCommits * 2 +
    metrics.weeklyActivityBurst * 3
  )

  // Defense = consistency + merged PRs
  const defense = clamp(
    metrics.consistencyScore * 0.6 +
    metrics.mergedPRs * 4
  )

  // Speed = weekly burst + account activity ratio
  const speed = clamp(
    metrics.weeklyActivityBurst * 4 +
    (metrics.recentCommits / Math.max(1, metrics.accountAgeDays / 30)) * 10
  )

  // Intelligence = language diversity + repo depth
  const intelligence = clamp(
    metrics.languageCount * 8 +
    metrics.repoDepth * 2 +
    metrics.publicRepos * 0.5
  )

  // Influence = stars + forks + external contributions
  const influence = clamp(
    Math.log10(metrics.starsReceived + 1) * 20 +
    Math.log10(metrics.forks + 1) * 15 +
    metrics.externalContributions * 5
  )

  // Stamina = account age + sustained contribution
  const stamina = clamp(
    Math.log10(metrics.accountAgeDays + 1) * 25 +
    metrics.consistencyScore * 0.4
  )

  return { attack, defense, speed, intelligence, influence, stamina }
}

// ============================================================
// CLASS ASSIGNMENT
// ============================================================

export function assignClass(metrics: FighterMetrics, stats: FighterStats): FighterClass {
  const lang = metrics.topLanguage?.toLowerCase() || ''
  const totalScore = Object.values(stats).reduce((a, b) => a + b, 0)

  // Rookie: very low activity
  if (totalScore < 120 || metrics.publicRepos < 2) return 'rookie'

  // Language-based class assignment
  if (['javascript', 'typescript'].includes(lang) && stats.speed > 40) return 'code-ranger'
  if (['python', 'r', 'julia'].includes(lang) && stats.intelligence > 40) return 'data-mage'
  if (['solidity', 'rust'].includes(lang) && stats.defense > 35) return 'chain-knight'
  if (['go', 'shell', 'dockerfile', 'hcl'].includes(lang) && stats.stamina > 40) return 'system-guardian'

  // Behavior-based
  if (metrics.mergedPRs > 10 && metrics.externalContributions > 5) return 'merge-monk'

  // Balanced / high total
  const statValues = Object.values(stats)
  const avg = totalScore / 6
  const balanced = statValues.every(s => s > avg * 0.6)
  if (balanced && totalScore > 300) return 'architect'

  // Fallback by dominant stat
  const dominant = Object.entries(stats).sort((a, b) => b[1] - a[1])[0][0]
  const classMap: Record<string, FighterClass> = {
    attack: 'code-ranger',
    defense: 'system-guardian',
    speed: 'code-ranger',
    intelligence: 'data-mage',
    influence: 'merge-monk',
    stamina: 'system-guardian',
  }
  return classMap[dominant] || 'rookie'
}

// ============================================================
// RARITY CALCULATION
// ============================================================

export function calculateRarity(metrics: FighterMetrics, stats: FighterStats): Rarity {
  const totalScore = Object.values(stats).reduce((a, b) => a + b, 0)
  const qualityScore =
    metrics.consistencyScore * 0.3 +
    Math.log10(metrics.starsReceived + 1) * 20 +
    Math.min(50, metrics.mergedPRs * 2) +
    Math.min(30, metrics.externalContributions * 3) +
    (totalScore / 6) * 0.3

  if (qualityScore >= 85) return 'legendary'
  if (qualityScore >= 65) return 'epic'
  if (qualityScore >= 45) return 'rare'
  if (qualityScore >= 25) return 'uncommon'
  return 'common'
}

// ============================================================
// TITLES
// ============================================================

const TITLES: Record<FighterClass, Record<Rarity, string>> = {
  'code-ranger':      { common: 'Script Kid', uncommon: 'Dev', rare: 'Senior Dev', epic: 'Principal Engineer', legendary: 'Code Deity' },
  'data-mage':        { common: 'Notebook Nerd', uncommon: 'Analyst', rare: 'ML Engineer', epic: 'Research Wizard', legendary: 'AI Archon' },
  'chain-knight':     { common: 'WAGMI Peasant', uncommon: 'Solidity Dev', rare: 'Protocol Builder', epic: 'Chain Warden', legendary: 'Blockchain Legend' },
  'system-guardian':  { common: 'Server Monkey', uncommon: 'SRE', rare: 'Platform Engineer', epic: 'Infra Overlord', legendary: 'System God' },
  'merge-monk':       { common: 'Issue Closer', uncommon: 'Contributor', rare: 'Maintainer', epic: 'OSS Legend', legendary: 'Open Source Sage' },
  'architect':        { common: 'Junior Architect', uncommon: 'Developer', rare: 'Tech Lead', epic: 'Staff Engineer', legendary: 'Grand Architect' },
  'rookie':           { common: 'Rookie', uncommon: 'Apprentice', rare: 'Rising Star', epic: 'Prodigy', legendary: 'Chosen One' },
}

// ============================================================
// HP CALCULATION
// ============================================================

function calculateMaxHp(stats: FighterStats, rarity: Rarity): number {
  const rarityBonus = { common: 1, uncommon: 1.1, rare: 1.25, epic: 1.45, legendary: 1.7 }
  const base = 80 + stats.stamina * 0.8 + stats.defense * 0.4
  return Math.round(base * rarityBonus[rarity])
}

// ============================================================
// AURA COLOR
// ============================================================

function pickAuraColor(fighterClass: FighterClass, rarity: Rarity): string {
  if (rarity === 'legendary') return '#ffd700'
  if (rarity === 'epic') return '#a020f0'
  return CLASS_CONFIGS[fighterClass].color
}

// ============================================================
// MAIN GENERATOR
// ============================================================

export function generateFighter(
  userId: string,
  githubUsername: string,
  avatarUrl: string,
  metrics: FighterMetrics,
): Omit<Fighter, 'id' | 'createdAt' | 'lastSyncAt'> {
  const stats = deriveStats(metrics)
  const fighterClass = assignClass(metrics, stats)
  const rarity = calculateRarity(metrics, stats)
  const maxHp = calculateMaxHp(stats, rarity)
  const title = TITLES[fighterClass][rarity]
  const auraColor = pickAuraColor(fighterClass, rarity)
  const spriteSeed = `${githubUsername}-${fighterClass}-${Date.now()}`

  return {
    userId,
    githubUsername,
    name: `${githubUsername}`,
    class: fighterClass,
    rarity,
    title,
    stats,
    level: 1,
    xp: 0,
    hp: maxHp,
    maxHp,
    wins: 0,
    losses: 0,
    winStreak: 0,
    badges: [],
    auraColor,
    spriteSeed,
    avatarUrl,
  }
}
