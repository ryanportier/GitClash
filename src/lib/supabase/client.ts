import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

// Client-side Supabase client — use ONLY in 'use client' components
export const createClient = () => createClientComponentClient<Database>()
