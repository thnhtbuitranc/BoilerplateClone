import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { Star, Check } from 'lucide-react-native';
import { IdolType } from '@/types/sleep';
import { IDOL_PERSONALITIES, generateIdolMessage } from '@/config/gemini';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSelectedIdol } from '@/store/slices/sleepSlice';

const IdolSelectionScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const dispatch = useAppDispatch();
  const { selectedIdol } = useAppSelector((state) => state.sleep);
  const { user } = useAppSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [previewIdol, setPreviewIdol] = useState<IdolType | null>(null);

  const idols: { key: IdolType; emoji: string }[] = [
    { key: 'son-tung-mtp', emoji: '🎤' },
    { key: 'rose', emoji: '🌹' },
    { key: 'den-vau', emoji: '🎭' },
    { key: 'chi-pu', emoji: '✨' },
    { key: 'binz', emoji: '🎵' },
  ];

  const handleSelectIdol = (idolKey: IdolType) => {
    dispatch(setSelectedIdol(idolKey));
    Alert.alert(
      t('SUCCESS'),
      `You selected ${IDOL_PERSONALITIES[idolKey].name}!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handlePreview = async (idolKey: IdolType) => {
    if (!user?.username) return;
    
    setLoading(true);
    setPreviewIdol(idolKey);
    
    try {
      const message = await generateIdolMessage(idolKey, user.username, 'goodnight');
      Alert.alert(
        `${IDOL_PERSONALITIES[idolKey].name} says:`,
        message,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Select This Idol', onPress: () => handleSelectIdol(idolKey) },
        ]
      );
    } catch (error) {
      Alert.alert(t('ERROR'), 'Failed to generate preview message');
    } finally {
      setLoading(false);
      setPreviewIdol(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t('SELECT_IDOL')}
        </Text>
        <Text className="text-base text-neutrals400">
          Choose your favorite idol to wake you up
        </Text>
      </View>

      {/* Idol Cards */}
      <View className="mx-6 mb-6">
        {idols.map((idol) => {
          const idolInfo = IDOL_PERSONALITIES[idol.key];
          const isSelected = selectedIdol === idol.key;
          const isPreviewing = previewIdol === idol.key;

          return (
            <TouchableOpacity
              key={idol.key}
              className="mb-4 p-6 rounded-3xl border"
              style={{
                backgroundColor: isSelected ? `${colors.primary}20` : colors.surfaceGlass,
                borderColor: isSelected ? colors.primary : colors.border,
              }}
              onPress={() => handleSelectIdol(idol.key)}
              disabled={loading}
            >
              <View className="flex-row items-start">
                {/* Emoji Avatar */}
                <View
                  className="w-16 h-16 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor: isSelected ? colors.primary : colors.neutrals800,
                  }}
                >
                  <Text className="text-4xl">{idol.emoji}</Text>
                </View>

                {/* Idol Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-xl font-bold text-foreground">
                      {idolInfo.name}
                    </Text>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Check size={16} color={colors.primaryForeground} />
                      </View>
                    )}
                  </View>

                  <Text className="text-sm text-neutrals400 mb-3">
                    {idolInfo.personality}
                  </Text>

                  <View className="flex-row items-center">
                    <Star size={14} color={colors.warning} />
                    <Text className="text-xs text-neutrals500 ml-1">
                      {idolInfo.style}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Preview Button */}
              <TouchableOpacity
                className="mt-4 p-3 rounded-xl bg-secondary/20 items-center"
                onPress={() => handlePreview(idol.key)}
                disabled={loading}
              >
                <Text className="text-secondary font-semibold">
                  {isPreviewing ? t('LOADING') : '🎧 Preview Message'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Info Card */}
      <View className="mx-6 mb-8 p-6 rounded-3xl bg-surfaceGlass border border-border">
        <Text className="text-lg font-bold text-foreground mb-3">
          ✨ How It Works
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Your selected idol will send you personalized goodnight messages
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Wake-up calls will be in your idol's unique style
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Messages are AI-generated to match their personality
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Tap "Preview" to hear a sample message before selecting
            </Text>
          </View>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default IdolSelectionScreen;

