import { createClient } from '@supabase/supabase-js';
import { MMKV } from 'react-native-mmkv';

// Supabase configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase Anon Key

// Initialize MMKV for secure storage
const storage = new MMKV({
  id: 'supabase-storage',
});

// Custom storage adapter for Supabase
const mmkvAdapter = {
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: mmkvAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      sleep_records: {
        Row: {
          id: string;
          user_id: string;
          sleep_time: string;
          wake_time: string | null;
          quality: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sleep_time: string;
          wake_time?: string | null;
          quality?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sleep_time?: string;
          wake_time?: string | null;
          quality?: number | null;
        };
      };
      sleep_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
        };
      };
    };
  };
};

