import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key (for admin operations)
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Types for Supabase tables
export type Database = {
  public: {
    Tables: {
      User: {
        Row: {
          id: number
          name: string
          password_hash: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          name: string
          password_hash: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          name?: string
          password_hash?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      Device: {
        Row: {
          id: number
          name: string
          temperature: number
          humidity: number
          latitude: number
          longitude: number
          isOpen: boolean
          userId: number
          createdAt: string
        }
        Insert: {
          id?: number
          name: string
          temperature: number
          humidity: number
          latitude: number
          longitude: number
          isOpen: boolean
          userId: number
          createdAt?: string
        }
        Update: {
          id?: number
          name?: string
          temperature?: number
          humidity?: number
          latitude?: number
          longitude?: number
          isOpen?: boolean
          userId?: number
          createdAt?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}