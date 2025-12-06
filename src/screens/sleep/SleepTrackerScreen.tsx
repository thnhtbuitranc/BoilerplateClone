import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { Moon, Sun, Clock, Star } from 'lucide-react-native';
import { SleepService } from '@/services/sleep.service';
import { useAppSelector } from '@/store/hooks';
import DateTimePicker from '@react-native-community/datetimepicker';

const SleepTrackerScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAppSelector((state) => state.auth);
  
  const [isSleeping, setIsSleeping] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [sleepQuality, setSleepQuality] = useState(5);

  const handleStartSleep = async () => {
    if (!user?.id) {
      Alert.alert(t('ERROR'), 'Please login first');
      return;
    }

    const now = new Date();
    const record = await SleepService.createSleepRecord(user.id, now);
    
    if (record) {
      setIsSleeping(true);
      setCurrentRecordId(record.id);
      setSleepStartTime(now);
      Alert.alert(t('SUCCESS'), t('SLEEP_NOW'));
    } else {
      Alert.alert(t('ERROR'), t('SOMETHING_WENT_WRONG'));
    }
  };

  const handleWakeUp = async () => {
    if (!currentRecordId) return;

    const now = new Date();
    const success = await SleepService.updateSleepRecord(
      currentRecordId,
      now,
      sleepQuality
    );

    if (success) {
      setIsSleeping(false);
      setCurrentRecordId(null);
      setSleepStartTime(null);
      Alert.alert(t('SUCCESS'), t('WAKE_UP'));
      navigation.goBack();
    } else {
      Alert.alert(t('ERROR'), t('SOMETHING_WENT_WRONG'));
    }
  };

  const formatDuration = () => {
    if (!sleepStartTime) return '0h 0m';
    
    const now = new Date();
    const diff = now.getTime() - sleepStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t('SLEEP_TRACKER')}
        </Text>
        <Text className="text-base text-neutrals400">
          Track your sleep journey
        </Text>
      </View>

      {/* Main Sleep Button */}
      <View className="items-center px-6 mb-8">
        <View className="relative">
          {/* Glow effect */}
          <View
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: isSleeping ? colors.sleepPrimary : colors.moonGlow,
              opacity: 0.2,
              transform: [{ scale: 1.2 }],
            }}
          />
          
          {/* Main button */}
          <TouchableOpacity
            className="w-64 h-64 rounded-full items-center justify-center"
            style={{
              backgroundColor: isSleeping ? colors.sleepPrimary : colors.moonGlow,
            }}
            onPress={isSleeping ? handleWakeUp : handleStartSleep}
            activeOpacity={0.8}
          >
            {isSleeping ? (
              <Sun size={80} color="#FFFFFF" />
            ) : (
              <Moon size={80} color="#FFFFFF" />
            )}
            <Text className="text-white text-xl font-bold mt-4">
              {isSleeping ? t('WAKE_UP') : t('START_SLEEPING')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Duration Display */}
        {isSleeping && (
          <View className="mt-8 p-6 rounded-3xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center justify-center mb-2">
              <Clock size={20} color={colors.primary} />
              <Text className="text-sm text-neutrals400 ml-2">
                {t('SLEEP_DURATION')}
              </Text>
            </View>
            <Text className="text-4xl font-bold text-foreground text-center">
              {formatDuration()}
            </Text>
          </View>
        )}
      </View>

      {/* Sleep Quality Selector (shown when sleeping) */}
      {isSleeping && (
        <View className="mx-6 mb-6 p-6 rounded-3xl bg-surfaceGlass border border-border">
          <View className="flex-row items-center mb-4">
            <Star size={20} color={colors.warning} />
            <Text className="text-base font-semibold text-foreground ml-2">
              {t('SLEEP_QUALITY')}
            </Text>
          </View>
          
          <View className="flex-row justify-between items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <TouchableOpacity
                key={value}
                className="w-8 h-8 rounded-full items-center justify-center"
                style={{
                  backgroundColor:
                    sleepQuality >= value ? colors.warning : colors.neutrals800,
                }}
                onPress={() => setSleepQuality(value)}
              >
                <Text
                  className="text-xs font-bold"
                  style={{
                    color: sleepQuality >= value ? '#FFFFFF' : colors.neutrals500,
                  }}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text className="text-center text-neutrals400 text-sm mt-4">
            Rate: {sleepQuality}/10
          </Text>
        </View>
      )}

      {/* Quick Tips */}
      <View className="mx-6 mb-6 p-6 rounded-3xl bg-surfaceGlass border border-border">
        <Text className="text-lg font-bold text-foreground mb-4">
          💡 Sleep Tips
        </Text>
        <View className="space-y-3">
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-neutrals300">
              Maintain a consistent sleep schedule
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-neutrals300">
              Avoid screens 30 minutes before bed
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-neutrals300">
              Keep your bedroom cool and dark
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-neutrals300">
              Try relaxation techniques before sleep
            </Text>
          </View>
        </View>
      </View>

      {/* Set Alarm Button */}
      <View className="mx-6 mb-8">
        <TouchableOpacity
          className="p-4 rounded-2xl bg-secondary flex-row items-center justify-center"
          onPress={() => navigation.navigate('AlarmSettings')}
        >
          <Clock size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold ml-2">
            {t('SET_ALARM')}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default SleepTrackerScreen;

