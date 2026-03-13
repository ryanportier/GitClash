import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY!

// For Server Components
export const createServerClient = () =>
  createServerComponentClient({ cookies })

// For Route Handlers (API routes)
export const createApiClient = () =>
  createRouteHandlerClient({ cookies })

// Service role client — bypasses RLS, use only server-side
export const createServiceClient = () =>
  createClient(supabaseUrl, supabaseService)
