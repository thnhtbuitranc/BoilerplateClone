import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/useColors";
import { Moon, Users, Bell, TrendingUp, Star, Zap } from "lucide-react-native";
// import { LinearGradient } from 'expo-linear-gradient'; // Optional

const LandingScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();

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
      <View className="px-6 pt-20 pb-12">
        {/* Logo/Title */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-primary/20 items-center justify-center mb-4">
            <Moon size={48} color={colors.primary} />
          </View>
          <Text className="text-4xl font-bold text-foreground text-center mb-3">
            {t("APP_NAME")}
          </Text>
          <Text className="text-lg text-neutrals400 text-center">
            {t("LANDING_HERO_SUBTITLE")}
          </Text>
        </View>

        {/* CTA Buttons */}
        <View className="gap-3 mb-12">
          <TouchableOpacity
            className="p-4 rounded-2xl bg-primary items-center"
            onPress={() => navigation.navigate("Register")}
          >
            <Text className="text-white text-lg font-bold">
              {t("GET_STARTED")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="p-4 rounded-2xl border-2 items-center"
            style={{ borderColor: colors.primary }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text className="text-primary text-lg font-bold">{t("LOGIN")}</Text>
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
