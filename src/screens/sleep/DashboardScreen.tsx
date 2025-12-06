import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/useColors";
import {
  Moon,
  Sun,
  TrendingUp,
  Award,
  Users,
  Zap,
  Sparkles,
  Heart,
} from "lucide-react-native";
import { SleepStats } from "@/types/sleep";
import { SleepService } from "@/services/sleep.service";
import { GroupService } from "@/services/group.service";
import { useAppSelector } from "@/store/hooks";
import RealtimeSleepCounter from "@/components/sleep/RealtimeSleepCounter";
import SleepTimeSlots from "@/components/sleep/SleepTimeSlots";

const DashboardScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [sleepingCount, setSleepingCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    loadData();
    // Update sleeping count every 30 seconds
    const interval = setInterval(() => {
      setSleepingCount(GroupService.getFakeSleepingCount());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    if (!user?.id) return;

    const sleepStats = await SleepService.getSleepStats(user.id);
    setStats(sleepStats);
    setSleepingCount(GroupService.getFakeSleepingCount());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t("APP_NAME")}
        </Text>
        <Text className="text-base text-neutrals400">
          {t("WELCOME_SUBTITLE")}
        </Text>
      </View>

      {/* Real-time Sleep Counter - NEW */}
      <View className="mx-6 mb-6">
        <RealtimeSleepCounter />
      </View>

      {/* Sleep Time Slots - NEW */}
      <View className="mx-6 mb-6">
        <SleepTimeSlots
          onSelectSlot={(time) => console.log("Selected:", time)}
        />
      </View>

      {/* Quick Actions - Cute Style */}
      <View className="mx-6 mb-6">
        <Text className="text-xl font-bold text-foreground mb-4">
          ⚡ Hành động nhanh
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            className="flex-1 p-6 rounded-3xl items-center"
            style={{
              backgroundColor: colors.sleepPrimary,
              shadowColor: colors.sleepPrimary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={() => navigation.navigate("SleepTracker")}
          >
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-3">
              <Moon size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-bold text-center">
              🌙 Bắt đầu ngủ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 p-6 rounded-3xl items-center"
            style={{
              backgroundColor: colors.secondary,
              shadowColor: colors.secondary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={() => navigation.navigate("SocialSleep")}
          >
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mb-3">
              <Users size={24} color="#FFFFFF" />
            </View>
            <Text className="text-white font-bold text-center">
              👥 Nhóm ngủ
            </Text>
          </TouchableOpacity>
        </View>

        {/* New Features Row */}
        <View className="flex-row gap-3 mt-3">
          <TouchableOpacity
            className="flex-1 p-6 rounded-3xl items-center"
            style={{
              backgroundColor: colors.warning + "20",
              borderWidth: 2,
              borderColor: colors.warning + "40",
            }}
            onPress={() => navigation.navigate("SleepMusic")}
          >
            <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mb-3">
              <Text className="text-2xl">🎵</Text>
            </View>
            <Text className="text-foreground font-bold text-center">
              Nhạc ngủ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 p-6 rounded-3xl items-center"
            style={{
              backgroundColor: colors.success + "20",
              borderWidth: 2,
              borderColor: colors.success + "40",
            }}
            onPress={() => navigation.navigate("Statistics")}
          >
            <View className="w-12 h-12 rounded-full bg-success/20 items-center justify-center mb-3">
              <Text className="text-2xl">📊</Text>
            </View>
            <Text className="text-foreground font-bold text-center">
              Thống kê
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      {stats && (
        <View className="mx-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">
            {t("STATISTICS")}
          </Text>

          {/* Streak Card */}
          <View className="mb-4 p-6 rounded-3xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 rounded-full bg-warning/20 items-center justify-center mr-3">
                <Zap size={24} color={colors.warning} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-neutrals400">
                  {t("CURRENT_STREAK")}
                </Text>
                <Text className="text-3xl font-bold text-foreground">
                  {stats.currentStreak}{" "}
                  <Text className="text-lg">{t("DAYS")}</Text>
                </Text>
              </View>
            </View>
            <View className="h-2 bg-neutrals800 rounded-full overflow-hidden">
              <View
                className="h-full bg-warning rounded-full"
                style={{
                  width: `${Math.min((stats.currentStreak / 30) * 100, 100)}%`,
                }}
              />
            </View>
          </View>

          {/* Sleep Quality Grid */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
              <View className="w-10 h-10 rounded-full bg-success/20 items-center justify-center mb-2">
                <TrendingUp size={20} color={colors.success} />
              </View>
              <Text className="text-xs text-neutrals400 mb-1">
                {t("SLEEP_QUALITY")}
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                {stats.averageQuality.toFixed(1)}/10
              </Text>
            </View>

            <View className="flex-1 p-4 rounded-2xl bg-surfaceGlass border border-border">
              <View className="w-10 h-10 rounded-full bg-info/20 items-center justify-center mb-2">
                <Moon size={20} color={colors.info} />
              </View>
              <Text className="text-xs text-neutrals400 mb-1">
                {t("AVERAGE_SLEEP")}
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                {stats.averageDuration.toFixed(1)}h
              </Text>
            </View>
          </View>

          {/* Total Nights */}
          <View className="p-4 rounded-2xl bg-surfaceGlass border border-border">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-accent/20 items-center justify-center mr-3">
                  <Award size={20} color={colors.accent} />
                </View>
                <View>
                  <Text className="text-xs text-neutrals400">
                    {t("TOTAL_NIGHTS")}
                  </Text>
                  <Text className="text-xl font-bold text-foreground">
                    {stats.totalNights}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="px-4 py-2 rounded-full bg-primary"
                onPress={() => navigation.navigate("Statistics")}
              >
                <Text
                  className="font-semibold"
                  style={{ color: colors.primaryForeground }}
                >
                  {t("MORE")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Empty State */}
      {!stats && (
        <View className="mx-6 mb-6 p-8 rounded-3xl bg-surfaceGlass border border-border items-center">
          <Moon size={48} color={colors.neutrals500} />
          <Text className="text-lg font-semibold text-foreground mt-4 text-center">
            {t("NO_DATA")}
          </Text>
          <Text className="text-sm text-neutrals400 mt-2 text-center">
            Start tracking your sleep to see statistics
          </Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 rounded-full bg-primary"
            onPress={() => navigation.navigate("SleepTracker")}
          >
            <Text className="text-primaryForeground font-semibold">
              {t("GET_STARTED")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="h-8" />
    </ScrollView>
  );
};

export default DashboardScreen;
