import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Custom storage implementation for React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface FocusSession {
  id: string;
  user_id: string;
  mode: 'pomodoro' | 'deep' | 'mindful' | 'custom';
  duration: number;
  completed_duration: number;
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
  created_at: string;
}

export interface Insight {
  id: string;
  user_id: string;
  type: 'improvement' | 'achievement' | 'pattern' | 'suggestion';
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down' | 'stable';
  color: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_focus_time: number;
  sessions_completed: number;
  longest_streak: number;
  current_streak: number;
  mindfulness_score: number;
  last_updated: string;
}