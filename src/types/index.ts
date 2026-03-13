// ============================================================
// FIGHTER CLASSES & RARITY
// ============================================================

export type FighterClass =
  | 'code-ranger'
  | 'data-mage'
  | 'chain-knight'
  | 'system-guardian'
  | 'merge-monk'
  | 'architect'
  | 'rookie'

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type SpriteState = 'idle' | 'attack' | 'hit' | 'victory' | 'defeat'

// ============================================================
// STATS
// ============================================================

export interface FighterStats {
  attack: number      // 0–100
  defense: number     // 0–100
  speed: number       // 0–100
  intelligence: number // 0–100
  influence: number   // 0–100
  stamina: number     // 0–100
}

export interface FighterMetrics {
  recentCommits: number
  totalCommits: number
  consistencyScore: number    // 0–100 derived
  publicRepos: number
  mergedPRs: number
  externalContributions: number
  starsReceived: number
  forks: number
  languageCount: number
  topLanguage: string
  accountAgeDays: number
  weeklyActivityBurst: number  // commits in last 7 days
  repoDepth: number            // avg watchers + issues per repo
}

// ============================================================
// FIGHTER
// ============================================================

export interface Fighter {
  id: string
  userId: string
  githubUsername: string
  name: string
  class: FighterClass
  rarity: Rarity
  title: string
  stats: FighterStats
  level: number
  xp: number
  hp: number
  maxHp: number
  wins: number
  losses: number
  winStreak: number
  badges: string[]
  auraColor: string
  spriteSeed: string
  avatarUrl: string
  createdAt: string
  lastSyncAt: string
}

// ============================================================
// PROFILE
// ============================================================

export interface Profile {
  id: string
  githubUsername: string
  githubId: string
  displayName: string
  avatarUrl: string
  rankPoints: number
  rankTitle: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// BATTLE
// ============================================================

export type SkillName =
  | 'Commit Storm'
  | 'Merge Shield'
  | 'Fork Echo'
  | 'Streak Pulse'
  | 'Repo Surge'
  | 'Silent Build'
  | 'Chain Strike'
  | 'Basic Attack'
  | 'Defend'

export interface BattleAction {
  turn: number
  actorId: string
  actorName: string
  targetId: string
  targetName: string
  skill: SkillName
  damage: number
  isCrit: boolean
  isBlocked: boolean
  attackerHpAfter: number
  defenderHpAfter: number
  log: string
}

export interface Battle {
  id: string
  player1Id: string
  player2Id: string
  player1Fighter: Fighter
  player2Fighter: Fighter
  winnerId: string | null
  loserId: string | null
  actions: BattleAction[]
  seed: string
  xpGained: number
  rankPointsChange: number
  createdAt: string
}

// ============================================================
// RANKING
// ============================================================

export interface RankEntry {
  rank: number
  userId: string
  githubUsername: string
  displayName: string
  avatarUrl: string
  fighterClass: FighterClass
  rarity: Rarity
  rankPoints: number
  wins: number
  losses: number
  winStreak: number
  rankTitle: string
}

// ============================================================
// REWARD
// ============================================================

export interface Reward {
  id: string
  userId: string
  type: 'rank_points' | 'badge' | 'title' | 'aura'
  value: string
  description: string
  earnedAt: string
}

// ============================================================
// CLASS CONFIG
// ============================================================

export interface ClassConfig {
  id: FighterClass
  displayName: string
  description: string
  primaryLanguages: string[]
  statWeights: Partial<FighterStats>
  color: string
  glowColor: string
  skills: SkillName[]
}

export const CLASS_CONFIGS: Record<FighterClass, ClassConfig> = {
  'code-ranger': {
    id: 'code-ranger',
    displayName: 'Code Ranger',
    description: 'Fast duelist who strikes before opponents can react. Masters of JS/TS.',
    primaryLanguages: ['JavaScript', 'TypeScript'],
    statWeights: { speed: 20, attack: 15 },
    color: '#ff2040',
    glowColor: '#ff2040',
    skills: ['Commit Storm', 'Streak Pulse', 'Fork Echo', 'Basic Attack'],
  },
  'data-mage': {
    id: 'data-mage',
    displayName: 'Data Mage',
    description: 'Intelligence-based caster. Python and AI automation specialist.',
    primaryLanguages: ['Python', 'R', 'Julia'],
    statWeights: { intelligence: 20, influence: 10 },
    color: '#a040ff',
    glowColor: '#b060ff',
    skills: ['Repo Surge', 'Silent Build', 'Streak Pulse', 'Basic Attack'],
  },
  'chain-knight': {
    id: 'chain-knight',
    displayName: 'Chain Knight',
    description: 'Armored protocol warrior. Solidity and Web3 specialist.',
    primaryLanguages: ['Solidity', 'Rust', 'Go'],
    statWeights: { defense: 20, stamina: 10 },
    color: '#ff8800',
    glowColor: '#ff8800',
    skills: ['Chain Strike', 'Merge Shield', 'Defend', 'Basic Attack'],
  },
  'system-guardian': {
    id: 'system-guardian',
    displayName: 'System Guardian',
    description: 'Heavy tank. Backend and infra specialist who absorbs damage.',
    primaryLanguages: ['Go', 'Rust', 'Shell', 'Dockerfile'],
    statWeights: { defense: 15, stamina: 20 },
    color: '#00cc60',
    glowColor: '#00cc60',
    skills: ['Merge Shield', 'Defend', 'Repo Surge', 'Basic Attack'],
  },
  'merge-monk': {
    id: 'merge-monk',
    displayName: 'Merge Monk',
    description: 'Collaborative maintainer with support powers. Open source legend.',
    primaryLanguages: [],
    statWeights: { influence: 20, stamina: 15 },
    color: '#ff4060',
    glowColor: '#ff4060',
    skills: ['Merge Shield', 'Fork Echo', 'Silent Build', 'Basic Attack'],
  },
  'architect': {
    id: 'architect',
    displayName: 'Architect',
    description: 'Elite all-rounder. Balanced multi-stack profile with premium presence.',
    primaryLanguages: [],
    statWeights: {},
    color: '#ffcc00',
    glowColor: '#ffcc00',
    skills: ['Commit Storm', 'Chain Strike', 'Repo Surge', 'Basic Attack'],
  },
  'rookie': {
    id: 'rookie',
    displayName: 'Rookie',
    description: 'The beginning of a legend. Every master was once here.',
    primaryLanguages: [],
    statWeights: {},
    color: '#806060',
    glowColor: '#806060',
    skills: ['Basic Attack', 'Defend', 'Streak Pulse', 'Basic Attack'],
  },
}

export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; glowColor: string; chance: number }> = {
  common:    { label: 'Common',    color: '#806060', glowColor: '#806060', chance: 50 },
  uncommon:  { label: 'Uncommon',  color: '#00c060', glowColor: '#00c060', chance: 28 },
  rare:      { label: 'Rare',      color: '#0080ff', glowColor: '#0080ff', chance: 14 },
  epic:      { label: 'Epic',      color: '#a020f0', glowColor: '#a020f0', chance: 6  },
  legendary: { label: 'Legendary', color: '#ffcc00', glowColor: '#ffcc00', chance: 2  },
}
