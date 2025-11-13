import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // During build time (SSR/SSG), if env vars are missing, create a placeholder client
  // This prevents build failures. The client will fail at runtime if env vars are still missing.
  if (!supabaseUrl || !supabaseKey) {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined'
    
    if (isBrowser) {
      // In browser, log a warning but still create a placeholder client
      // This prevents the app from crashing, but API calls will fail
      console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.')
      
      // Create a placeholder client that won't crash the app
      // API calls will fail gracefully
      supabaseClient = createClient(
        'https://placeholder.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
      )
      return supabaseClient
    }
    
    // During build/SSR, create a placeholder client
    // This allows the build to complete, but will fail at runtime if env vars aren't set
    supabaseClient = createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder'
    )
    return supabaseClient
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}
