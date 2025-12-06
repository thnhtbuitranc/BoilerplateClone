import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { Clock, Users, Check } from 'lucide-react-native';

interface TimeSlot {
  time: string;
  label: string;
  participants: number;
  emoji: string;
}

const SleepTimeSlots = ({ onSelectSlot }: { onSelectSlot?: (time: string) => void }) => {
  const colors = useColors();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots: TimeSlot[] = [
    { time: '21:00', label: 'Ngủ sớm', participants: 342, emoji: '🌅' },
    { time: '22:00', label: 'Lý tưởng', participants: 856, emoji: '🌙' },
    { time: '23:00', label: 'Phổ biến', participants: 623, emoji: '⭐' },
    { time: '00:00', label: 'Đêm khuya', participants: 289, emoji: '🌃' },
  ];

  const handleSelect = (time: string) => {
    setSelectedSlot(time);
    onSelectSlot?.(time);
  };

  return (
    <View>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-foreground">
          ⏰ Chọn khung giờ ngủ
        </Text>
        <View className="flex-row items-center">
          <Users size={16} color={colors.neutrals400} />
          <Text className="text-sm text-neutrals400 ml-1">
            {timeSlots.reduce((sum, slot) => sum + slot.participants, 0)}+ người
          </Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
        {timeSlots.map((slot) => {
          const isSelected = selectedSlot === slot.time;
          return (
            <TouchableOpacity
              key={slot.time}
              className="mr-3 p-5 rounded-3xl min-w-[140px]"
              style={{
                backgroundColor: isSelected ? colors.primary : `${colors.primary}10`,
                borderWidth: 2,
                borderColor: isSelected ? colors.primary : `${colors.primary}30`,
                shadowColor: isSelected ? colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: isSelected ? 5 : 0,
              }}
              onPress={() => handleSelect(slot.time)}
            >
              {/* Check icon for selected */}
              {isSelected && (
                <View className="absolute top-2 right-2">
                  <View
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#FFFFFF' }}
                  >
                    <Check size={14} color={colors.primary} strokeWidth={3} />
                  </View>
                </View>
              )}

              {/* Emoji */}
              <Text className="text-3xl mb-2">{slot.emoji}</Text>

              {/* Time */}
              <View className="flex-row items-center mb-1">
                <Clock
                  size={18}
                  color={isSelected ? '#FFFFFF' : colors.primary}
                  strokeWidth={2.5}
                />
                <Text
                  className="text-2xl font-bold ml-2"
                  style={{ color: isSelected ? '#FFFFFF' : colors.primary }}
                >
                  {slot.time}
                </Text>
              </View>

              {/* Label */}
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: isSelected ? '#FFFFFF' : colors.neutrals400 }}
              >
                {slot.label}
              </Text>

              {/* Participants */}
              <View
                className="flex-row items-center px-2 py-1 rounded-full"
                style={{
                  backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${colors.primary}20`,
                }}
              >
                <Users
                  size={12}
                  color={isSelected ? '#FFFFFF' : colors.primary}
                />
                <Text
                  className="text-xs font-bold ml-1"
                  style={{ color: isSelected ? '#FFFFFF' : colors.primary }}
                >
                  {slot.participants}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedSlot && (
        <View
          className="mt-4 p-4 rounded-2xl"
          style={{ backgroundColor: `${colors.success}15` }}
        >
          <Text className="text-sm text-success font-semibold text-center">
            ✅ Bạn đã chọn khung giờ {selectedSlot}. Chúng tôi sẽ nhắc bạn trước 30 phút!
          </Text>
        </View>
      )}
    </View>
  );
};

export default SleepTimeSlots;

