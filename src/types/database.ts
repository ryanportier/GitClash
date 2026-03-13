export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          github_username: string
          github_id: string
          display_name: string
          avatar_url: string
          rank_points: number
          rank_title: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      fighters: {
        Row: {
          id: string
          user_id: string
          github_username: string
          name: string
          class: string
          rarity: string
          title: string
          stats: Json
          level: number
          xp: number
          hp: number
          max_hp: number
          wins: number
          losses: number
          win_streak: number
          badges: string[]
          aura_color: string
          sprite_seed: string
          avatar_url: string
          created_at: string
          last_sync_at: string
        }
        Insert: Omit<Database['public']['Tables']['fighters']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['fighters']['Insert']>
      }
      fighter_metrics: {
        Row: {
          id: string
          fighter_id: string
          user_id: string
          recent_commits: number
          total_commits: number
          consistency_score: number
          public_repos: number
          merged_prs: number
          external_contributions: number
          stars_received: number
          forks: number
          language_count: number
          top_language: string
          account_age_days: number
          weekly_activity_burst: number
          repo_depth: number
          raw_data: Json
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['fighter_metrics']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['fighter_metrics']['Insert']>
      }
      battles: {
        Row: {
          id: string
          player1_id: string
          player2_id: string
          winner_id: string | null
          loser_id: string | null
          battle_log: Json
          seed: string
          xp_gained: number
          rank_points_change: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['battles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['battles']['Insert']>
      }
      rankings: {
        Row: {
          id: string
          user_id: string
          rank_points: number
          rank_position: number
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['rankings']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['rankings']['Insert']>
      }
      rewards: {
        Row: {
          id: string
          user_id: string
          type: string
          value: string
          description: string
          earned_at: string
        }
        Insert: Omit<Database['public']['Tables']['rewards']['Row'], 'id' | 'earned_at'>
        Update: Partial<Database['public']['Tables']['rewards']['Insert']>
      }
    }
  }
}
