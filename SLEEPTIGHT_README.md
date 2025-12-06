# SleepTight - Social Sleep Tracking App 🌙

A React Native mobile application that helps users build better sleep habits through social features, AI-powered idol interactions, and gamification.

## 🎯 Features

### Core Features
- **Sleep Tracking**: Track your sleep time, wake time, and sleep quality
- **Social Sleep**: Join groups, compete with friends, and see who sleeps earliest
- **Idol Call & Alarm**: Get personalized wake-up messages from your favorite idols (AI-powered)
- **Gamification**: Earn streaks, badges, and achievements
- **Statistics**: View detailed sleep analytics with charts and heatmaps
- **Multi-language**: Support for Vietnamese and English

### Tech Stack
- **Framework**: React Native 0.80
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: Redux Toolkit + Redux Persist
- **Backend**: Supabase (Auth + Database + Edge Functions)
- **AI**: Google Gemini API for idol personality messages
- **Storage**: MMKV for fast local storage
- **Navigation**: React Navigation
- **Icons**: Lucide React Native

## 📋 Prerequisites

- Node.js >= 18
- Yarn 4.9.1
- React Native development environment setup
- Android Studio (for Android) or Xcode (for iOS)
- Supabase account
- Google Gemini API key

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/thnhtbuitranc/BoilerplateClone.git
cd BoilerplateClone
git checkout ChucNguNgon1
```

### 2. Install dependencies
```bash
yarn install
```

### 3. Configure Supabase

Create a Supabase project at https://supabase.com

#### Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_records table
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sleep_time TIMESTAMP WITH TIME ZONE NOT NULL,
  wake_time TIMESTAMP WITH TIME ZONE,
  quality INTEGER CHECK (quality >= 1 AND quality <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_groups table
CREATE TABLE sleep_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_members table
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES sleep_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- Create indexes
CREATE INDEX idx_sleep_records_user_id ON sleep_records(user_id);
CREATE INDEX idx_sleep_records_sleep_time ON sleep_records(sleep_time DESC);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
```

### 4. Configure Environment Variables

Update `src/config/supabase.ts`:
```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Update `src/config/gemini.ts`:
```typescript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```

**Important**: In production, move these API keys to Supabase Edge Functions for security.

### 5. Run the app

#### Android
```bash
yarn android
```

#### iOS
```bash
cd ios && pod install && cd ..
yarn ios
```

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
│   ├── colors.ts       # Theme colors (Glassmorphism)
│   ├── supabase.ts     # Supabase client
│   ├── gemini.ts       # Gemini AI configuration
│   └── locales/        # i18n translations
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/            # Screen components
│   └── sleep/          # Sleep-related screens
│       ├── DashboardScreen.tsx
│       ├── SleepTrackerScreen.tsx
│       ├── SocialSleepScreen.tsx
│       ├── GroupDetailScreen.tsx
│       └── IdolSelectionScreen.tsx
├── services/           # API services
│   ├── sleep.service.ts
│   └── group.service.ts
├── store/              # Redux store
│   └── slices/
│       ├── authSlice.ts
│       └── sleepSlice.ts
├── types/              # TypeScript types
│   └── sleep.ts
└── utils/              # Utility functions
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) - Main brand color
- **Secondary**: Blue (#3B82F6) - Secondary actions
- **Accent**: Pink (#EC4899) - Highlights
- **Sleep Colors**: Purple/Indigo gradient for sleep-related features
- **Status Colors**: Green (success), Amber (warning), Red (error)

### Theme
- Light mode and Dark mode support
- Glassmorphism design with semi-transparent surfaces
- Smooth transitions and animations
- Mobile-first responsive design

## 🔐 Security Best Practices

1. **API Keys**: Never commit API keys to version control
2. **Supabase RLS**: Enable Row Level Security policies
3. **Edge Functions**: Use Supabase Edge Functions for sensitive operations
4. **Input Validation**: Validate all user inputs
5. **Authentication**: Use Supabase Auth for secure authentication

## 📊 Features Roadmap

- [x] Sleep tracking
- [x] Social sleep groups
- [x] Idol selection
- [x] Statistics dashboard
- [ ] Alarm functionality
- [ ] Sleep music/stories
- [ ] Badge system
- [ ] Heatmap visualization
- [ ] Push notifications
- [ ] Admin dashboard

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your needs.

## 📄 License

MIT License

## 👨‍💻 Author

Built with ❤️ for better sleep habits

---

**Note**: This app is built on the ChucNguNgon1 branch. Make sure to checkout this branch before development.

