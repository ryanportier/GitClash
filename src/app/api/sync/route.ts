import { createApiClient, createServiceClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubMetrics } from '@/lib/github/metrics'
import { generateFighter } from '@/lib/game/fighter-generator'

export async function POST(request: NextRequest) {
  try {
    const supabase = createApiClient()
    let session = (await supabase.auth.getSession()).data.session

    if (!session) {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      if (token) {
        const { data } = await createServiceClient().auth.getUser(token)
        if (data.user) return await runSync(data.user, token)
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return await runSync(session.user, session.provider_token || undefined)
  } catch (err) {
    console.error('Sync error:', err)
    return NextResponse.json({ error: 'Fighter sync failed' }, { status: 500 })
  }
}

async function runSync(user: any, providerToken?: string | null) {
  const db = createServiceClient()

  const githubUsername = user.user_metadata?.user_name || user.user_metadata?.preferred_username
  const avatarUrl = user.user_metadata?.avatar_url || ''

  if (!githubUsername) {
    return NextResponse.json({ error: 'GitHub username not found' }, { status: 400 })
  }

  const metrics = await fetchGitHubMetrics(githubUsername, providerToken || undefined)
  const fighterData = generateFighter(user.id, githubUsername, avatarUrl, metrics)

  // ── 1. PROFILE FIRST (fighters has FK → profiles) ──
  const { error: profileError } = await db.from('profiles').upsert({
    id: user.id,
    github_username: githubUsername,
    github_id: user.user_metadata?.provider_id || user.id,
    display_name: user.user_metadata?.full_name || githubUsername,
    avatar_url: avatarUrl,
    rank_points: 1000,
    rank_title: 'Unranked',
    updated_at: new Date().toISOString(),
  })
  if (profileError) throw profileError

  // ── 2. FIGHTER ──
  const { data: existing } = await db
    .from('fighters')
    .select('id')
    .eq('user_id', user.id)
    .single()

  let fighter
  if (existing) {
    const { data, error } = await db
      .from('fighters')
      .update({
        class: fighterData.class,
        rarity: fighterData.rarity,
        title: fighterData.title,
        stats: fighterData.stats,
        hp: fighterData.hp,
        max_hp: fighterData.maxHp,
        aura_color: fighterData.auraColor,
        last_sync_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    fighter = data
  } else {
    const { data, error } = await db
      .from('fighters')
      .insert({
        user_id: user.id,
        github_username: githubUsername,
        name: fighterData.name,
        class: fighterData.class,
        rarity: fighterData.rarity,
        title: fighterData.title,
        stats: fighterData.stats as any,
        level: fighterData.level,
        xp: fighterData.xp,
        hp: fighterData.hp,
        max_hp: fighterData.maxHp,
        wins: 0,
        losses: 0,
        win_streak: 0,
        badges: [],
        aura_color: fighterData.auraColor,
        sprite_seed: fighterData.spriteSeed,
        avatar_url: avatarUrl,
        last_sync_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    fighter = data
  }

  // ── 3. METRICS ──
  await db.from('fighter_metrics').upsert({
    fighter_id: fighter.id,
    user_id: user.id,
    recent_commits: metrics.recentCommits,
    total_commits: metrics.totalCommits,
    consistency_score: metrics.consistencyScore,
    public_repos: metrics.publicRepos,
    merged_prs: metrics.mergedPRs,
    external_contributions: metrics.externalContributions,
    stars_received: metrics.starsReceived,
    forks: metrics.forks,
    language_count: metrics.languageCount,
    top_language: metrics.topLanguage,
    account_age_days: metrics.accountAgeDays,
    weekly_activity_burst: metrics.weeklyActivityBurst,
    repo_depth: metrics.repoDepth,
    raw_data: metrics as any,
  })

  return NextResponse.json({ fighter, metrics })
}
