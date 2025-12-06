import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import MainTabNavigator from "./MainTabNavigator";
import SettingsScreen from "@/screens/SettingsScreen";
import CustomScreenHeader from "@/navigation/components/ScreenHeader.tsx";
import LoginScreen from "@/screens/auth/LoginScreen";
import RegisterScreen from "@/screens/auth/RegisterScreen";
import AboutScreen from "@/screens/AboutScreen";

// SleepTight Screens
import DashboardScreen from "@/screens/sleep/DashboardScreen";
import SleepTrackerScreen from "@/screens/sleep/SleepTrackerScreen";
import SocialSleepScreen from "@/screens/sleep/SocialSleepScreen";
import GroupDetailScreen from "@/screens/sleep/GroupDetailScreen";
import IdolSelectionScreen from "@/screens/sleep/IdolSelectionScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Main Dashboard - Default Screen */}
      <Stack.Screen name="Dashboard" component={DashboardScreen} />

      {/* Sleep Screens */}
      <Stack.Screen name="SleepTracker" component={SleepTrackerScreen} />
      <Stack.Screen name="SocialSleep" component={SocialSleepScreen} />
      <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
      <Stack.Screen name="IdolSelection" component={IdolSelectionScreen} />

      {/* Auth Screens */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Settings */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}
