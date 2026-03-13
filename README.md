```
 ██████╗ ██╗████████╗ ██████╗██╗      █████╗ ███████╗██╗  ██╗
██╔════╝ ██║╚══██╔══╝██╔════╝██║     ██╔══██╗██╔════╝██║  ██║
██║  ███╗██║   ██║   ██║     ██║     ███████║███████╗███████║
██║   ██║██║   ██║   ██║     ██║     ██╔══██║╚════██║██╔══██║
╚██████╔╝██║   ██║   ╚██████╗███████╗██║  ██║███████║██║  ██║
 ╚═════╝ ╚═╝   ╚═╝    ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

<div align="center">

**Your GitHub stats are your stats. Your commits are your attacks. Your code is your weapon.**

[![Live](https://img.shields.io/badge/▶_PLAY-gitclash.fun-e81010?style=for-the-badge&logoColor=white)](https://gitclash.fun)
[![Twitter](https://img.shields.io/badge/Twitter-@gitclash-1d9bf0?style=for-the-badge&logo=x&logoColor=white)](https://x.com/gitclash)
[![Bankr](https://img.shields.io/badge/Trade-Bankr.bot-gold?style=for-the-badge)](https://bankr.bot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth+DB-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)

</div>

---

## ⚔️ What is GitClash?

GitClash is a **GitHub-powered pixel-art auto-battler**. Connect your GitHub account and the app reads your public activity — commits, repos, stars, pull requests, languages — and transforms all of it into a unique pixel-art fighter with real stats derived from your code.

Then you fight other devs. Automatically.

```
commits   → ⚔  Attack       stars     → 👑 Influence
streak    → 🛡  Defense      languages → 🧠 Intelligence  
repos     → ⚡ Speed         PRs       → 💪 Stamina
```

---

## 🕹️ How It Works

```
1. Connect GitHub OAuth
         │
         ▼
2. App fetches your public GitHub metrics
   (commits, repos, PRs, stars, forks, languages, account age)
         │
         ▼
3. Fighter generated from your stats
   Class + Rarity assigned automatically
         │
         ▼
4. Enter the arena — get matched vs another dev
         │
         ▼
5. Auto-battle plays out turn by turn
   Skills fire, HP drains, winner gets rank points
         │
         ▼
6. Climb the leaderboard 🏆
```

---

## 🧬 Fighter Classes

Your top language and activity patterns determine your class:

| Class | Primary Languages | Playstyle |
|---|---|---|
| ⚡ **Code Ranger** | JavaScript, TypeScript | Fast striker — high speed, crit-heavy |
| 🔮 **Data Mage** | Python, R, Julia | Intelligence-based AoE damage |
| ⛓️ **Chain Knight** | Solidity, Rust, Go | Tanky bruiser with chain attacks |
| 🛡️ **System Guardian** | C, C++, C#, Java | Fortress — max defense, counter damage |
| 🌿 **Merge Monk** | Ruby, Elixir, Clojure | Balanced — high PR count boosts all stats |
| 🏗️ **Architect** | Multiple languages (5+) | Multi-class fighter, adaptable toolkit |
| 🌱 **Rookie** | Any (new account) | Low stats, high potential — underdog |

---

## 💎 Rarity Tiers

Rarity is calculated from your combined GitHub influence score:

```
⬜ Common     — Just getting started
🟩 Uncommon   — Active contributor
🟦 Rare       — Open source regular
🟪 Epic       — Community pillar
🟨 Legendary  — 1000+ stars · years of streaks · massive repos
```

---

## ⚔️ Battle Skills

9 skills in the pool — fighters select based on stats each turn:

| Skill | Damage | Effect |
|---|---|---|
| **Commit Storm** | 18 | Rapid barrage — high crit chance (20%) |
| **Repo Surge** | 22 | Nuke — highest base damage |
| **Chain Strike** | 20 | Chain attack — blockchain-powered |
| **Fork Echo** | 14 | Double hit — high speed multiplier |
| **Streak Pulse** | 12 | Converts contribution streak to energy |
| **Silent Build** | 16 | Quiet — but 30% crit, catches opponents off guard |
| **Merge Shield** | 8 | 35% block — pure defense mode |
| **Basic Attack** | 10 | Reliable — always available |
| **Defend** | 4 | 50% block — last resort |

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [GitHub OAuth App](https://github.com/settings/developers)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/gitclash
cd gitclash
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GITHUB_TOKEN=optional-for-higher-rate-limits
```

### 3. Database

Paste `supabase-schema.sql` into your Supabase **SQL Editor** and run it.

### 4. GitHub OAuth App

Go to `github.com/settings/developers` → New OAuth App:

```
Homepage URL:            http://localhost:3000
Authorization callback:  https://YOUR-PROJECT.supabase.co/auth/v1/callback
```

Copy the **Client ID** and **Client Secret** into Supabase:
`Authentication → Providers → GitHub`

### 5. Supabase URL Config

`Authentication → URL Configuration`:
```
Site URL:      http://localhost:3000
Redirect URLs: http://localhost:3000/auth/callback
```

### 6. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── (auth)/auth/          # Login (GitHub + Twitter)
│   ├── summon/               # Fighter generation flow
│   ├── profile/              # Your fighter card + history
│   ├── arena/                # Matchmaking + battle
│   ├── leaderboard/          # Top 50 fighters
│   └── api/
│       ├── auth/callback/    # OAuth exchange
│       ├── sync/             # Generate fighter from GitHub
│       ├── battle/           # Run battle + persist results
│       └── leaderboard/      # Fetch rankings
├── components/
│   ├── ui/                   # PixelButton, PixelPanel, HpBar...
│   ├── game/                 # FighterSprite, FighterCard
│   └── battle/               # BattleArena (animated replay)
├── lib/
│   ├── github/metrics.ts     # Fetch GitHub public data
│   ├── game/
│   │   ├── fighter-generator.ts  # Stats derivation + class logic
│   │   ├── battle-engine.ts      # Seeded RNG turn-based combat
│   │   └── assets.ts             # Sprite path helpers
│   └── supabase/
│       ├── client.ts         # Browser client (use client components)
│       └── server.ts         # Server + API route client
└── types/
    ├── index.ts              # All game types + CLASS_CONFIGS
    └── database.ts           # Supabase schema types
```

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 App Router |
| Auth | Supabase Auth (GitHub OAuth) |
| Database | Supabase Postgres + RLS |
| Styling | Tailwind CSS + custom pixel theme |
| Animations | Framer Motion + CSS keyframes |
| Icons | lucide-react |
| Data | GitHub REST API v3 |

---

## 🔒 Privacy

GitClash only reads **public** GitHub data. It never:
- writes to your repos
- accesses private repositories
- stores your GitHub token beyond the session

---

## 📜 License

MIT — fork it, remix it, deploy your own arena.

---

<div align="center">

**Built for devs who commit at 2am and call it a streak.**

[gitclash.fun](https://gitclash.fun) · [@gitclash](https://x.com/gitclash) · [Bankr](https://bankr.bot)

</div>