import { createApiClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from 'next/server'
import { runBattle } from '@/lib/game/battle-engine'
import { Fighter } from '@/types'

function dbRowToFighter(row: any): Fighter {
  return {
    id: row.id,
    userId: row.user_id,
    githubUsername: row.github_username,
    name: row.name,
    class: row.class,
    rarity: row.rarity,
    title: row.title,
    stats: row.stats,
    level: row.level,
    xp: row.xp,
    hp: row.hp,
    maxHp: row.max_hp,
    wins: row.wins,
    losses: row.losses,
    winStreak: row.win_streak,
    badges: row.badges || [],
    auraColor: row.aura_color,
    spriteSeed: row.sprite_seed,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    lastSyncAt: row.last_sync_at,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { opponentId } = await request.json()

    // Get player's fighter
    const { data: p1Row, error: p1Err } = await supabase
      .from('fighters')
      .select('*')
      .eq('user_id', session.user.id)
      .single()
    if (p1Err) return NextResponse.json({ error: 'Fighter not found' }, { status: 404 })

    // Get opponent fighter
    let p2Row
    if (opponentId) {
      const { data } = await supabase.from('fighters').select('*').eq('id', opponentId).single()
      p2Row = data
    } else {
      // Find random opponent (not self)
      const { data } = await supabase
        .from('fighters')
        .select('*')
        .neq('user_id', session.user.id)
        .limit(20)
      if (!data || data.length === 0) {
        return NextResponse.json({ error: 'No opponents available' }, { status: 404 })
      }
      p2Row = data[Math.floor(Math.random() * data.length)]
    }

    const player1 = dbRowToFighter(p1Row)
    const player2 = dbRowToFighter(p2Row)

    // Run the battle simulation
    const battle = runBattle(player1, player2)

    // Persist battle
    const { data: savedBattle, error: battleErr } = await supabase
      .from('battles')
      .insert({
        player1_id: player1.userId,
        player2_id: player2.userId,
        winner_id: battle.winnerId === player1.id ? player1.userId : battle.winnerId === player2.id ? player2.userId : null,
        loser_id: battle.loserId === player1.id ? player1.userId : battle.loserId === player2.id ? player2.userId : null,
        battle_log: battle.actions as any,
        seed: battle.seed,
        xp_gained: battle.xpGained,
        rank_points_change: battle.rankPointsChange,
      })
      .select()
      .single()

    if (battleErr) throw battleErr

    // Update fighters
    const p1Won = battle.winnerId === player1.id
    await supabase.from('fighters').update({
      wins: p1Won ? player1.wins + 1 : player1.wins,
      losses: p1Won ? player1.losses : player1.losses + 1,
      win_streak: p1Won ? player1.winStreak + 1 : 0,
      xp: player1.xp + battle.xpGained,
    }).eq('id', player1.id)

    // Update rank points — fetch current then add
    if (p1Won) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('rank_points')
        .eq('id', player1.userId)
        .single()
      if (profileData) {
        await supabase.from('profiles').update({
          rank_points: ((profileData as any).rank_points || 1000) + battle.rankPointsChange,
        }).eq('id', player1.userId)
      }
    }

    return NextResponse.json({ battle: { ...battle, id: savedBattle.id } })
  } catch (err) {
    console.error('Battle error:', err)
    return NextResponse.json({ error: 'Battle failed' }, { status: 500 })
  }
}
