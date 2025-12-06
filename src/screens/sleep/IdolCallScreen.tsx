import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Phone, PhoneOff, Volume2, Mic, Video } from 'lucide-react-native';

interface IdolCallScreenProps {
  route: {
    params: {
      idolName: string;
      idolEmoji: string;
      message: string;
    };
  };
  navigation: any;
}

const IdolCallScreen = ({ route, navigation }: IdolCallScreenProps) => {
  const colors = useColors();
  const { idolName, idolEmoji, message } = route.params;
  const [pulseAnim] = useState(new Animated.Value(1));
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
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

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      pulse.stop();
      clearInterval(timer);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  return (
    <View
      className="flex-1 justify-between"
      style={{ backgroundColor: colors.background }}
    >
      {/* Top Section */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Idol Avatar with Pulse */}
        <Animated.View
          className="w-40 h-40 rounded-full items-center justify-center mb-8"
          style={{
            backgroundColor: `${colors.primary}20`,
            transform: [{ scale: pulseAnim }],
          }}
        >
          <Text className="text-8xl">{idolEmoji}</Text>
        </Animated.View>

        {/* Idol Name */}
        <Text className="text-3xl font-bold text-foreground mb-2">
          {idolName}
        </Text>

        {/* Call Status */}
        <Text className="text-base text-neutrals400 mb-8">
          Đang gọi... {formatDuration(callDuration)}
        </Text>

        {/* Message */}
        <View
          className="p-6 rounded-3xl max-w-sm"
          style={{
            backgroundColor: `${colors.primary}15`,
            borderWidth: 2,
            borderColor: `${colors.primary}30`,
          }}
        >
          <Text className="text-base text-foreground text-center leading-6">
            💬 "{message}"
          </Text>
        </View>
      </View>

      {/* Bottom Controls */}
      <View className="px-6 pb-12">
        {/* Action Buttons */}
        <View className="flex-row justify-center gap-6 mb-8">
          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: `${colors.neutrals400}30` }}
          >
            <Mic size={24} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: `${colors.neutrals400}30` }}
          >
            <Volume2 size={24} color={colors.foreground} />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: `${colors.neutrals400}30` }}
          >
            <Video size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* End Call Button */}
        <TouchableOpacity
          className="p-6 rounded-full items-center flex-row justify-center"
          style={{
            backgroundColor: colors.error,
            shadowColor: colors.error,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={handleEndCall}
        >
          <PhoneOff size={24} color="#FFFFFF" />
          <Text className="text-white text-lg font-bold ml-3">
            Kết thúc cuộc gọi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IdolCallScreen;

