import { createApiClient } from "@/lib/supabase/server"
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createApiClient()

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        github_username,
        display_name,
        avatar_url,
        rank_points,
        rank_title,
        fighters (
          class,
          rarity,
          wins,
          losses,
          win_streak
        )
      `)
      .order('rank_points', { ascending: false })
      .limit(50)

    if (error) throw error

    const entries = (data || []).map((profile: any, i: number) => ({
      rank: i + 1,
      userId: profile.id,
      githubUsername: profile.github_username,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      rankPoints: profile.rank_points,
      rankTitle: profile.rank_title,
      fighterClass: profile.fighters?.[0]?.class || 'rookie',
      rarity: profile.fighters?.[0]?.rarity || 'common',
      wins: profile.fighters?.[0]?.wins || 0,
      losses: profile.fighters?.[0]?.losses || 0,
      winStreak: profile.fighters?.[0]?.win_streak || 0,
    }))

    return NextResponse.json({ entries })
  } catch (err) {
    console.error('Leaderboard error:', err)
    return NextResponse.json({ error: 'Failed to load leaderboard' }, { status: 500 })
  }
}
