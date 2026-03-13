import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// For Server Components
export const createServerClient = () =>
  createServerComponentClient({ cookies })

// For Route Handlers (API routes) — use this in /api/* files
export const createApiClient = () =>
  createRouteHandlerClient({ cookies })
