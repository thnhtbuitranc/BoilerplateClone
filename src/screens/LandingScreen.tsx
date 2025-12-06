import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/useColors";
import {
  Moon,
  Users,
  Bell,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Sparkles,
} from "lucide-react-native";

const LandingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: Moon,
      title: t("LANDING_FEATURE_1"),
      description: "Track your sleep patterns with smart AI analysis",
    },
    {
      icon: Users,
      title: t("LANDING_FEATURE_2"),
      description: "Join sleep groups and compete with friends",
    },
    {
      icon: Bell,
      title: t("LANDING_FEATURE_3"),
      description:
        "Wake up with personalized messages from your favorite idols",
    },
    {
      icon: TrendingUp,
      title: t("LANDING_FEATURE_4"),
      description: "Earn badges and maintain your sleep streak",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Hero Section */}
      <Animated.View
        className="px-6 pt-20 pb-12"
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Logo/Title with cute animation */}
        <View className="items-center mb-8">
          <View className="relative">
            {/* Cute moon with glow effect */}
            <View className="w-32 h-32 rounded-full items-center justify-center mb-4"
              style={{
                backgroundColor: `${colors.primary}15`,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <Moon size={56} color={colors.primary} strokeWidth={2} />
              {/* Sparkles */}
              <View className="absolute -top-2 -right-2">
                <Sparkles size={20} color={colors.warning} fill={colors.warning} />
              </View>
              <View className="absolute -bottom-1 -left-1">
                <Heart size={16} color={colors.error} fill={colors.error} />
              </View>
            </View>
          </View>

          <Text className="text-5xl font-bold text-foreground text-center mb-3">
            😴 SleepTight
          </Text>
          <Text className="text-xl text-neutrals400 text-center px-4">
            Cùng nhau ngủ sớm, sống khỏe mỗi ngày! 🌙✨
          </Text>
        </View>

        {/* CTA Buttons - Cute & Rounded */}
        <View className="gap-4 mb-12">
          <TouchableOpacity
            className="p-5 rounded-3xl items-center flex-row justify-center"
            style={{
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Sparkles size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text className="text-white text-lg font-bold">
              🚀 Bắt đầu ngay!
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-5 rounded-3xl items-center flex-row justify-center"
            style={{
              borderColor: colors.primary,
              borderWidth: 2,
              backgroundColor: `${colors.primary}10`,
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Moon size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text className="text-primary text-lg font-bold">Đăng nhập</Text>
          </TouchableOpacity>

          {/* Skip Login - For Demo */}
          <TouchableOpacity
            className="p-3 items-center"
            onPress={() => navigation.navigate("Dashboard" as never)}
          >
            <Text className="text-neutrals400 text-base">
              Xem thử trước →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around mb-12">
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">10K+</Text>
            <Text className="text-sm text-neutrals400">Users</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">50K+</Text>
            <Text className="text-sm text-neutrals400">Sleep Records</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">95%</Text>
            <Text className="text-sm text-neutrals400">Satisfaction</Text>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View className="px-6 pb-12">
        <Text className="text-2xl font-bold text-foreground mb-6 text-center">
          ✨ Amazing Features
        </Text>

        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <View
              key={index}
              className="mb-4 p-6 rounded-3xl bg-surfaceGlass border border-border"
            >
              <View className="flex-row items-start">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Icon size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-neutrals400">
                    {feature.description}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Social Proof */}
      <View className="px-6 pb-12">
        <View className="p-8 rounded-3xl bg-primary/10 border border-primary/20">
          <View className="items-center">
            <View className="flex-row mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  color={colors.warning}
                  fill={colors.warning}
                />
              ))}
            </View>
            <Text className="text-lg font-bold text-foreground mb-2">
              "Best sleep tracking app!"
            </Text>
            <Text className="text-sm text-neutrals400 text-center">
              Join thousands of users who improved their sleep quality with
              SleepTight
            </Text>
          </View>
        </View>
      </View>

      {/* Final CTA */}
      <View className="px-6 pb-20">
        <View className="p-8 rounded-3xl bg-primary items-center">
          <Zap size={48} color="#FFFFFF" />
          <Text className="text-2xl font-bold text-white mt-4 mb-2 text-center">
            Ready to Sleep Better?
          </Text>
          <Text className="text-white/80 text-center mb-6">
            Start your journey to better sleep tonight
          </Text>
          <TouchableOpacity
            className="px-8 py-4 rounded-full bg-white"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-primary text-lg font-bold">
              Join Now - It's Free!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LandingScreen;
