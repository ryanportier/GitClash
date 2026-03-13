import { Fighter, BattleAction, Battle, SkillName, CLASS_CONFIGS } from '@/types'

// ============================================================
// SEEDED RNG
// ============================================================

function seededRng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5
    return ((h >>> 0) / 4294967296)
  }
}

// ============================================================
// SKILL DEFINITIONS
// ============================================================

interface SkillDef {
  name: SkillName
  baseDamage: number
  attackMult: number
  defenseMult: number
  speedMult: number
  critChance: number
  blockChance: number
  description: string
}

const SKILLS: Record<SkillName, SkillDef> = {
  'Commit Storm':  { name: 'Commit Storm',  baseDamage: 18, attackMult: 1.4, defenseMult: 0.2, speedMult: 0.8, critChance: 0.20, blockChance: 0.05, description: 'Unleashes a barrage of rapid commits' },
  'Merge Shield':  { name: 'Merge Shield',  baseDamage: 8,  attackMult: 0.5, defenseMult: 1.8, speedMult: 0.3, critChance: 0.05, blockChance: 0.35, description: 'Blocks incoming damage with a PR shield' },
  'Fork Echo':     { name: 'Fork Echo',     baseDamage: 14, attackMult: 1.0, defenseMult: 0.4, speedMult: 1.2, critChance: 0.15, blockChance: 0.10, description: 'Echoes the attack for double impact' },
  'Streak Pulse':  { name: 'Streak Pulse',  baseDamage: 12, attackMult: 1.1, defenseMult: 0.3, speedMult: 1.5, critChance: 0.25, blockChance: 0.05, description: 'Channels contribution streak into pure energy' },
  'Repo Surge':    { name: 'Repo Surge',    baseDamage: 22, attackMult: 1.2, defenseMult: 0.1, speedMult: 0.5, critChance: 0.10, blockChance: 0.05, description: 'Deploys an entire repository as a weapon' },
  'Silent Build':  { name: 'Silent Build',  baseDamage: 16, attackMult: 0.9, defenseMult: 0.8, speedMult: 0.7, critChance: 0.30, blockChance: 0.15, description: 'Quietly builds power before striking' },
  'Chain Strike':  { name: 'Chain Strike',  baseDamage: 20, attackMult: 1.3, defenseMult: 0.2, speedMult: 1.0, critChance: 0.15, blockChance: 0.08, description: 'Executes a chain of blockchain-powered attacks' },
  'Basic Attack':  { name: 'Basic Attack',  baseDamage: 10, attackMult: 1.0, defenseMult: 0.3, speedMult: 1.0, critChance: 0.10, blockChance: 0.10, description: 'A reliable standard attack' },
  'Defend':        { name: 'Defend',        baseDamage: 4,  attackMult: 0.3, defenseMult: 2.0, speedMult: 0.2, critChance: 0.02, blockChance: 0.50, description: 'Takes a defensive stance' },
}

// ============================================================
// BATTLE SIMULATION
// ============================================================

function calculateDamage(
  attacker: Fighter,
  defender: Fighter,
  skill: SkillDef,
  rng: () => number
): { damage: number; isCrit: boolean; isBlocked: boolean } {
  const isCrit = rng() < skill.critChance
  const isBlocked = rng() < (skill.blockChance * (defender.stats.defense / 100))

  let damage = skill.baseDamage
    + (attacker.stats.attack * skill.attackMult * 0.4)
    - (defender.stats.defense * skill.defenseMult * 0.3)
    + (attacker.stats.speed * skill.speedMult * 0.1)

  damage = Math.max(1, damage)
  if (isCrit) damage *= 1.8
  if (isBlocked) damage *= 0.3

  // Small random variance ±15%
  damage *= 0.85 + rng() * 0.30

  return { damage: Math.round(damage), isCrit, isBlocked }
}

function pickSkill(fighter: Fighter, rng: () => number): SkillDef {
  const skills = CLASS_CONFIGS[fighter.class].skills
  const chosen = skills[Math.floor(rng() * skills.length)]
  return SKILLS[chosen]
}

function buildLog(action: Omit<BattleAction, 'log'>): string {
  const { actorName, skill, damage, isCrit, isBlocked, defenderHpAfter } = action
  if (isBlocked && damage < 5) return `⚔️ ${actorName} uses ${skill} — BLOCKED! (${damage} dmg)`
  if (isCrit) return `⚡ ${actorName} uses ${skill} — CRITICAL HIT! (${damage} dmg)`
  if (defenderHpAfter <= 0) return `💀 ${actorName} uses ${skill} for ${damage} dmg — KO!`
  return `▶ ${actorName} uses ${skill} (${damage} dmg)`
}

export function runBattle(player1: Fighter, player2: Fighter, seed?: string): Battle {
  const battleSeed = seed || `${player1.id}-${player2.id}-${Date.now()}`
  const rng = seededRng(battleSeed)

  // Clone HP
  let hp1 = player1.maxHp
  let hp2 = player2.maxHp

  const actions: BattleAction[] = []
  const MAX_TURNS = 30

  // Determine who goes first by speed
  let turn = 0
  let firstActor = player1.stats.speed >= player2.stats.speed ? player1 : player2
  let secondActor = firstActor === player1 ? player2 : player1

  while (hp1 > 0 && hp2 > 0 && turn < MAX_TURNS) {
    turn++
    const isP1Turn = (turn % 2 === 1) === (firstActor === player1)
    const attacker = isP1Turn ? player1 : player2
    const defender = isP1Turn ? player2 : player1

    const skill = pickSkill(attacker, rng)
    const { damage, isCrit, isBlocked } = calculateDamage(attacker, defender, skill, rng)

    if (isP1Turn) {
      hp2 = Math.max(0, hp2 - damage)
    } else {
      hp1 = Math.max(0, hp1 - damage)
    }

    const actionBase: Omit<BattleAction, 'log'> = {
      turn,
      actorId: attacker.id,
      actorName: attacker.name,
      targetId: defender.id,
      targetName: defender.name,
      skill: skill.name,
      damage,
      isCrit,
      isBlocked,
      attackerHpAfter: isP1Turn ? hp1 : hp2,
      defenderHpAfter: isP1Turn ? hp2 : hp1,
    }

    actions.push({ ...actionBase, log: buildLog(actionBase) })

    if (hp1 <= 0 || hp2 <= 0) break
  }

  // Determine winner
  let winnerId: string | null = null
  let loserId: string | null = null

  if (hp1 > hp2) {
    winnerId = player1.id
    loserId = player2.id
  } else if (hp2 > hp1) {
    winnerId = player2.id
    loserId = player1.id
  }
  // hp1 === hp2 → draw, both null

  const rankPointsChange = winnerId ? 25 : 0
  const xpGained = winnerId ? 120 : 40

  return {
    id: battleSeed,
    player1Id: player1.id,
    player2Id: player2.id,
    player1Fighter: player1,
    player2Fighter: player2,
    winnerId,
    loserId,
    actions,
    seed: battleSeed,
    xpGained,
    rankPointsChange,
    createdAt: new Date().toISOString(),
  }
}
