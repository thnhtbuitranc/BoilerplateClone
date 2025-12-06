import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, Moon, Clock } from 'lucide-react-native';
import { SleepService } from '@/services/sleep.service';
import { useAppSelector } from '@/store/hooks';

const StatisticsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    if (!user?.id) return;
    const sleepStats = await SleepService.getSleepStats(user.id);
    setStats(sleepStats);
  };

  // Chart data
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: stats?.weeklyData?.map((d: any) => d.quality) || [7, 8, 6, 9, 7, 8, 9],
      },
    ],
  };

  const sleepDurationData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: stats?.weeklyData?.map((d: any) => d.duration) || [7, 8, 6, 9, 7, 8, 9],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
    labelColor: (opacity = 1) => colors.neutrals400,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t('STATISTICS')}
        </Text>
        <Text className="text-base text-neutrals400">
          Your sleep insights and trends
        </Text>
      </View>

      {/* Summary Cards */}
      <View className="px-6 mb-6">
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center mb-2">
              <Moon size={20} color={colors.primary} />
              <Text className="text-xs text-neutrals400 ml-2">Avg Sleep</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {stats?.averageDuration?.toFixed(1) || '7.5'}h
            </Text>
          </View>

          <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center mb-2">
              <TrendingUp size={20} color={colors.success} />
              <Text className="text-xs text-neutrals400 ml-2">Quality</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {stats?.averageQuality?.toFixed(1) || '8.2'}/10
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center mb-2">
              <Calendar size={20} color={colors.warning} />
              <Text className="text-xs text-neutrals400 ml-2">Streak</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {stats?.currentStreak || '12'} days
            </Text>
          </View>

          <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center mb-2">
              <Clock size={20} color={colors.info} />
              <Text className="text-xs text-neutrals400 ml-2">Total</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {stats?.totalNights || '45'} nights
            </Text>
          </View>
        </View>
      </View>

      {/* Sleep Quality Chart */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-foreground mb-4">
          📊 Sleep Quality Trend
        </Text>
        <View className="rounded-3xl overflow-hidden bg-surfaceGlass border border-border p-4">
          <LineChart
            data={weeklyData}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </View>
      </View>

      {/* Sleep Duration Chart */}
      <View className="px-6 mb-6">
        <Text className="text-xl font-bold text-foreground mb-4">
          ⏰ Sleep Duration (Hours)
        </Text>
        <View className="rounded-3xl overflow-hidden bg-surfaceGlass border border-border p-4">
          <BarChart
            data={sleepDurationData}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            style={{
              borderRadius: 16,
            }}
            yAxisSuffix="h"
          />
        </View>
      </View>

      {/* Insights */}
      <View className="px-6 mb-8">
        <Text className="text-xl font-bold text-foreground mb-4">
          💡 AI Insights
        </Text>
        <View className="p-6 rounded-3xl bg-primary/10 border border-primary/20">
          <Text className="text-base text-foreground mb-2 font-semibold">
            Great progress! 🎉
          </Text>
          <Text className="text-sm text-neutrals400">
            You've maintained a consistent sleep schedule for 12 days. Your average sleep quality
            has improved by 15% this week. Keep it up!
          </Text>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default StatisticsScreen;

