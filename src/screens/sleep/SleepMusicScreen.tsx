import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Music, Play, Pause, Volume2, Heart } from 'lucide-react-native';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: string;
  emoji: string;
}

const SleepMusicScreen = ({ navigation }: any) => {
  const colors = useColors();
  const [playing, setPlaying] = useState<string | null>(null);

  const musicTracks: MusicTrack[] = [
    { id: '1', title: 'Rain Sounds', artist: 'Nature', duration: '30:00', category: 'Nature', emoji: '🌧️' },
    { id: '2', title: 'Ocean Waves', artist: 'Nature', duration: '45:00', category: 'Nature', emoji: '🌊' },
    { id: '3', title: 'Forest Night', artist: 'Nature', duration: '60:00', category: 'Nature', emoji: '🌲' },
    { id: '4', title: 'Piano Lullaby', artist: 'Classical', duration: '25:00', category: 'Music', emoji: '🎹' },
    { id: '5', title: 'Meditation', artist: 'Zen', duration: '20:00', category: 'Meditation', emoji: '🧘' },
    { id: '6', title: 'White Noise', artist: 'Ambient', duration: '120:00', category: 'Ambient', emoji: '🔊' },
  ];

  const stories = [
    { id: 's1', title: 'Chuyện cổ tích', emoji: '📖', duration: '15:00' },
    { id: 's2', title: 'Thiên nhiên kỳ thú', emoji: '🌿', duration: '20:00' },
    { id: 's3', title: 'Vũ trụ bí ẩn', emoji: '🌌', duration: '18:00' },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
          <Text className="text-primary text-base">← Quay lại</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-foreground mb-2">
          🎵 Nhạc & Chuyện ngủ
        </Text>
        <Text className="text-base text-neutrals400">
          Thư viện âm thanh giúp bạn ngủ ngon
        </Text>
      </View>

      {/* Sleep Music */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-bold text-foreground mb-4">
          🎶 Nhạc ngủ
        </Text>
        {musicTracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            className="mb-3 p-5 rounded-3xl flex-row items-center"
            style={{
              backgroundColor: playing === track.id ? `${colors.primary}20` : colors.surface,
              borderWidth: 2,
              borderColor: playing === track.id ? colors.primary : colors.border,
            }}
            onPress={() => setPlaying(playing === track.id ? null : track.id)}
          >
            <View
              className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Text className="text-3xl">{track.emoji}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold text-foreground mb-1">
                {track.title}
              </Text>
              <Text className="text-sm text-neutrals400">
                {track.artist} • {track.duration}
              </Text>
            </View>

            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: playing === track.id ? colors.primary : `${colors.primary}20` }}
            >
              {playing === track.id ? (
                <Pause size={20} color="#FFFFFF" fill="#FFFFFF" />
              ) : (
                <Play size={20} color={colors.primary} fill={colors.primary} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sleep Stories */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-bold text-foreground mb-4">
          📚 Kể chuyện ngủ
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stories.map((story) => (
            <TouchableOpacity
              key={story.id}
              className="mr-4 p-6 rounded-3xl w-48"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.border,
              }}
            >
              <Text className="text-5xl mb-3">{story.emoji}</Text>
              <Text className="text-base font-bold text-foreground mb-2">
                {story.title}
              </Text>
              <Text className="text-sm text-neutrals400">{story.duration}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Upload Custom */}
      <View className="px-6 mb-8">
        <TouchableOpacity
          className="p-6 rounded-3xl items-center"
          style={{
            backgroundColor: `${colors.primary}10`,
            borderWidth: 2,
            borderColor: colors.primary,
            borderStyle: 'dashed',
          }}
        >
          <Music size={32} color={colors.primary} />
          <Text className="text-base font-bold text-primary mt-3">
            📤 Tải lên âm thanh của bạn
          </Text>
          <Text className="text-sm text-neutrals400 mt-1">
            MP3, WAV, hoặc ghi âm giọng nói
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SleepMusicScreen;

