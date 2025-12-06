import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { Trophy, Moon, Crown, AlertCircle } from 'lucide-react-native';
import { GroupMember } from '@/types/sleep';
import { GroupService } from '@/services/group.service';

const GroupDetailScreen = ({ route, navigation }: any) => {
  const { groupId } = route.params;
  const { t } = useTranslation();
  const colors = useColors();
  
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const groupMembers = await GroupService.getGroupMembers(groupId);
    setMembers(groupMembers);
    setLoading(false);
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return colors.warning; // Gold
      case 2:
        return colors.neutrals400; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return colors.neutrals600;
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Crown size={20} color={getRankColor(rank)} />;
    }
    return null;
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t('GROUP_RANKING')}
        </Text>
        <Text className="text-base text-neutrals400">
          Who sleeps earliest wins! 🏆
        </Text>
      </View>

      {/* Ranking List */}
      <View className="mx-6 mb-6">
        {loading ? (
          <View className="p-8 rounded-3xl bg-surfaceGlass border border-border items-center">
            <Text className="text-neutrals400">{t('LOADING')}</Text>
          </View>
        ) : members.length === 0 ? (
          <View className="p-8 rounded-3xl bg-surfaceGlass border border-border items-center">
            <Text className="text-neutrals400">{t('NO_DATA')}</Text>
          </View>
        ) : (
          members.map((member, index) => (
            <View
              key={member.id}
              className="mb-3 p-4 rounded-2xl border"
              style={{
                backgroundColor: member.stats.isLatestSleeper
                  ? 'rgba(239, 68, 68, 0.1)'
                  : colors.surfaceGlass,
                borderColor: member.stats.isLatestSleeper
                  ? colors.error
                  : colors.border,
              }}
            >
              <View className="flex-row items-center">
                {/* Rank */}
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{
                    backgroundColor:
                      member.stats.rank <= 3
                        ? `${getRankColor(member.stats.rank)}20`
                        : colors.neutrals800,
                  }}
                >
                  {member.stats.rank <= 3 ? (
                    getRankIcon(member.stats.rank)
                  ) : (
                    <Text
                      className="text-lg font-bold"
                      style={{ color: colors.neutrals400 }}
                    >
                      {member.stats.rank}
                    </Text>
                  )}
                </View>

                {/* Member Info */}
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-semibold text-foreground">
                      {member.username}
                    </Text>
                    {member.stats.isLatestSleeper && (
                      <View className="ml-2 px-2 py-1 rounded-full bg-error/20">
                        <Text className="text-xs font-bold text-error">
                          😴 Latest
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Moon size={14} color={colors.neutrals400} />
                    <Text className="text-sm text-neutrals400 ml-1">
                      Avg: {member.stats.averageSleepTime}
                    </Text>
                    {member.stats.streak > 0 && (
                      <>
                        <Text className="text-neutrals600 mx-2">•</Text>
                        <Text className="text-sm text-warning">
                          🔥 {member.stats.streak} days
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Trophy for top 3 */}
                {member.stats.rank <= 3 && (
                  <Trophy size={24} color={getRankColor(member.stats.rank)} />
                )}
              </View>

              {/* Shame message for latest sleeper */}
              {member.stats.isLatestSleeper && (
                <View className="mt-3 p-3 rounded-xl bg-error/10 flex-row items-start">
                  <AlertCircle size={16} color={colors.error} />
                  <Text className="flex-1 text-xs text-error ml-2">
                    Oops! You're the latest sleeper in the group. Try to sleep earlier! 😅
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Info Card */}
      <View className="mx-6 mb-8 p-6 rounded-3xl bg-surfaceGlass border border-border">
        <Text className="text-lg font-bold text-foreground mb-3">
          📊 How Ranking Works
        </Text>
        <View className="space-y-2">
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Members are ranked by average sleep time
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Earlier sleepers get better ranks
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              The latest sleeper gets "shamed" (friendly motivation!)
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-primary mr-2">•</Text>
            <Text className="flex-1 text-sm text-neutrals300">
              Keep your streak going for bonus points
            </Text>
          </View>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default GroupDetailScreen;

