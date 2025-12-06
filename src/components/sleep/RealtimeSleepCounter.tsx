import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Users, Moon } from 'lucide-react-native';

const RealtimeSleepCounter = () => {
  const colors = useColors();
  const [count, setCount] = useState(1247); // Fake initial count
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      clearInterval(interval);
      pulse.stop();
    };
  }, []);

  return (
    <View
      className="p-6 rounded-3xl items-center"
      style={{
        backgroundColor: `${colors.primary}15`,
        borderWidth: 2,
        borderColor: `${colors.primary}30`,
      }}
    >
      <View className="flex-row items-center mb-3">
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.success }}
          />
        </Animated.View>
        <Text className="text-sm text-neutrals400 font-semibold">
          ĐANG NGỦ CÙNG BẠN
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Users size={32} color={colors.primary} strokeWidth={2.5} />
        <Text
          className="text-5xl font-bold ml-3"
          style={{ color: colors.primary }}
        >
          {count.toLocaleString()}
        </Text>
      </View>

      <Text className="text-base text-neutrals400 text-center">
        người đang chuẩn bị đi ngủ 🌙
      </Text>

      <View className="flex-row gap-2 mt-4">
        <View className="px-3 py-1 rounded-full bg-primary/20">
          <Text className="text-xs text-primary font-semibold">
            +{Math.floor(Math.random() * 20)} vừa tham gia
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RealtimeSleepCounter;

