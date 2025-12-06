// User roles
export type UserRole = 'guest' | 'user' | 'admin';

// Idol types
export type IdolType = 'son-tung-mtp' | 'rose' | 'den-vau' | 'chi-pu' | 'binz';

// Sleep record
export interface SleepRecord {
  id: string;
  userId: string;
  sleepTime: Date;
  wakeTime?: Date;
  quality?: number; // 1-10
  duration?: number; // in minutes
  notes?: string;
  createdAt: Date;
}

// Sleep statistics
export interface SleepStats {
  averageSleepTime: string; // HH:mm format
  averageWakeTime: string;
  averageDuration: number; // in hours
  averageQuality: number; // 1-10
  totalNights: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: {
    day: string;
    quality: number;
    duration: number;
  }[];
}

// Sleep group
export interface SleepGroup {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  memberCount: number;
  createdAt: Date;
  coverImage?: string;
}

// Group member with stats
export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  username: string;
  avatarUrl?: string;
  joinedAt: Date;
  stats: {
    averageSleepTime: string;
    streak: number;
    rank: number; // Position in group ranking
    isLatestSleeper: boolean; // True if this person sleeps latest in group
  };
}

// Notification/Alarm settings
export interface AlarmSettings {
  id: string;
  userId: string;
  enabled: boolean;
  time: string; // HH:mm format
  days: number[]; // 0-6 (Sunday-Saturday)
  idolType?: IdolType;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  snoozeEnabled: boolean;
  snoozeDuration: number; // in minutes
}

// Badge/Achievement
export interface Badge {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: string;
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// User badge (earned)
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

// User profile
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  selectedIdol?: IdolType;
  targetSleepTime?: string; // HH:mm format
  targetWakeTime?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sleep insights from AI
export interface SleepInsight {
  id: string;
  userId: string;
  content: string;
  contentVi: string;
  type: 'tip' | 'achievement' | 'warning' | 'motivation';
  createdAt: Date;
}

// Real-time sleep status (for Social Sleep feature)
export interface SleepStatus {
  userId: string;
  username: string;
  avatarUrl?: string;
  status: 'awake' | 'sleeping' | 'offline';
  lastSleepTime?: Date;
  lastWakeTime?: Date;
}

// Heatmap data for sleep consistency
export interface HeatmapData {
  date: string; // YYYY-MM-DD
  value: number; // 0-4 (intensity level)
  quality?: number; // Sleep quality if available
}

// Music/Story for sleep
export interface SleepContent {
  id: string;
  title: string;
  titleVi: string;
  type: 'music' | 'story' | 'ambient';
  duration: number; // in seconds
  url: string;
  thumbnailUrl?: string;
  category: string;
  isPremium: boolean;
}

// Notification preset (for admin)
export interface NotificationPreset {
  id: string;
  title: string;
  titleVi: string;
  message: string;
  messageVi: string;
  type: 'reminder' | 'motivation' | 'achievement';
  icon?: string;
  createdAt: Date;
}

