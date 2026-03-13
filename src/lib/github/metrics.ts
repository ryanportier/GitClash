import { FighterMetrics } from '@/types'

const GITHUB_API = 'https://api.github.com'

async function githubFetch(url: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }
  const ghToken = token || process.env.GITHUB_TOKEN
  if (ghToken) headers['Authorization'] = `Bearer ${ghToken}`

  const res = await fetch(`${GITHUB_API}${url}`, { headers, next: { revalidate: 3600 } })
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error(`GitHub API error ${res.status}: ${url}`)
  }
  return res.json()
}

export async function fetchGitHubMetrics(
  username: string,
  accessToken?: string
): Promise<FighterMetrics> {
  const [user, repos, events] = await Promise.all([
    githubFetch(`/users/${username}`, accessToken),
    githubFetch(`/users/${username}/repos?per_page=100&sort=updated`, accessToken),
    githubFetch(`/users/${username}/events/public?per_page=100`, accessToken),
  ])

  // Account age
  const accountAgeDays = user?.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / 86400000)
    : 0

  // Repos stats
  const publicRepos = repos?.length || 0
  const starsReceived = repos?.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0) || 0
  const forks = repos?.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0) || 0

  // Language distribution
  const languageMap: Record<string, number> = {}
  repos?.forEach((r: any) => {
    if (r.language) languageMap[r.language] = (languageMap[r.language] || 0) + 1
  })
  const languageCount = Object.keys(languageMap).length
  const topLanguage = Object.entries(languageMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown'

  // Repo depth (avg open issues + watchers)
  const repoDepth = repos?.length
    ? repos.reduce((sum: number, r: any) => sum + (r.open_issues_count || 0) + (r.watchers_count || 0), 0) / repos.length
    : 0

  // Events analysis
  const now = Date.now()
  const oneWeekAgo = now - 7 * 86400000
  const thirtyDaysAgo = now - 30 * 86400000

  let recentCommits = 0
  let weeklyActivityBurst = 0
  let mergedPRs = 0
  let externalContributions = 0
  const activeDays = new Set<string>()

  events?.forEach((event: any) => {
    const eventDate = new Date(event.created_at).getTime()
    const isOwn = event.repo?.name?.startsWith(`${username}/`)
    const isExternal = !isOwn

    if (event.type === 'PushEvent') {
      const commits = event.payload?.commits?.length || 0
      if (eventDate > thirtyDaysAgo) {
        recentCommits += commits
        activeDays.add(event.created_at?.substring(0, 10))
      }
      if (eventDate > oneWeekAgo) weeklyActivityBurst += commits
    }

    if (event.type === 'PullRequestEvent' && event.payload?.action === 'closed' && event.payload?.pull_request?.merged) {
      mergedPRs++
    }

    if (event.type === 'PushEvent' && isExternal) {
      externalContributions++
    }
  })

  // Consistency: active days out of last 30
  const consistencyScore = Math.min(100, Math.round((activeDays.size / 30) * 100))

  // Total commits approximation from public repos
  const totalCommits = recentCommits + Math.floor(accountAgeDays * 0.5)

  return {
    recentCommits,
    totalCommits,
    consistencyScore,
    publicRepos,
    mergedPRs,
    externalContributions,
    starsReceived,
    forks,
    languageCount,
    topLanguage,
    accountAgeDays,
    weeklyActivityBurst,
    repoDepth,
  }
}
