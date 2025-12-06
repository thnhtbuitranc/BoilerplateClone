import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/useColors';
import { Users, Plus, Search, Trophy, Moon } from 'lucide-react-native';
import { SleepGroup, GroupMember } from '@/types/sleep';
import { GroupService } from '@/services/group.service';
import { useAppSelector } from '@/store/hooks';

const SocialSleepScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const colors = useColors();
  const { user } = useAppSelector((state) => state.auth);
  
  const [myGroups, setMyGroups] = useState<SleepGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SleepGroup[]>([]);
  const [sleepingCount, setSleepingCount] = useState(0);

  useEffect(() => {
    loadMyGroups();
    setSleepingCount(GroupService.getFakeSleepingCount());
  }, []);

  const loadMyGroups = async () => {
    if (!user?.id) return;
    const groups = await GroupService.getUserGroups(user.id);
    setMyGroups(groups);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    const results = await GroupService.searchGroups(searchQuery);
    setSearchResults(results);
  };

  const handleCreateGroup = () => {
    Alert.prompt(
      t('CREATE_GROUP'),
      t('GROUP_NAME'),
      async (name) => {
        if (!name || !user?.id) return;
        
        const group = await GroupService.createGroup(name, '', user.id);
        if (group) {
          Alert.alert(t('SUCCESS'), 'Group created successfully!');
          loadMyGroups();
        } else {
          Alert.alert(t('ERROR'), t('SOMETHING_WENT_WRONG'));
        }
      }
    );
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user?.id) return;
    
    const success = await GroupService.joinGroup(groupId, user.id);
    if (success) {
      Alert.alert(t('SUCCESS'), 'Joined group successfully!');
      loadMyGroups();
    } else {
      Alert.alert(t('ERROR'), 'Failed to join group');
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 pt-16 pb-8">
        <Text className="text-3xl font-bold text-foreground mb-2">
          {t('SOCIAL_SLEEP_TITLE')}
        </Text>
        <Text className="text-base text-neutrals400">
          Sleep better together
        </Text>
      </View>

      {/* Live Counter */}
      <View className="mx-6 mb-6 p-6 rounded-3xl bg-gradient-to-r from-sleepPrimary to-sleepSecondary">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white/80 text-sm mb-1">
              🌙 Live Now
            </Text>
            <Text className="text-white text-3xl font-bold">
              {sleepingCount.toLocaleString()}
            </Text>
            <Text className="text-white/80 text-xs mt-1">
              {t('PEOPLE_SLEEPING_NOW', { count: sleepingCount })}
            </Text>
          </View>
          <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
            <Moon size={40} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Create Group Button */}
      <View className="mx-6 mb-6">
        <TouchableOpacity
          className="p-4 rounded-2xl bg-primary flex-row items-center justify-center"
          onPress={handleCreateGroup}
        >
          <Plus size={20} color={colors.primaryForeground} />
          <Text className="text-primaryForeground font-semibold ml-2">
            {t('CREATE_GROUP')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* My Groups */}
      <View className="mx-6 mb-6">
        <Text className="text-xl font-bold text-foreground mb-4">
          {t('MY_GROUPS')}
        </Text>

        {myGroups.length === 0 ? (
          <View className="p-8 rounded-3xl bg-surfaceGlass border border-border items-center">
            <Users size={48} color={colors.neutrals500} />
            <Text className="text-neutrals400 mt-4 text-center">
              You haven't joined any groups yet
            </Text>
          </View>
        ) : (
          myGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              className="mb-3 p-4 rounded-2xl bg-surfaceGlass border border-border"
              onPress={() => navigation.navigate('GroupDetail', { groupId: group.id })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {group.name}
                  </Text>
                  <Text className="text-sm text-neutrals400 mt-1">
                    {group.memberCount} {t('GROUP_MEMBERS')}
                  </Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                  <Users size={24} color={colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Search Groups */}
      <View className="mx-6 mb-6">
        <Text className="text-xl font-bold text-foreground mb-4">
          {t('JOIN_GROUP')}
        </Text>

        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <TextInput
              className="p-4 rounded-2xl bg-surfaceGlass border border-border text-foreground"
              placeholder="Search groups..."
              placeholderTextColor={colors.neutrals500}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity
            className="w-14 h-14 rounded-2xl bg-secondary items-center justify-center"
            onPress={handleSearch}
          >
            <Search size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {searchResults.map((group) => (
          <View
            key={group.id}
            className="mb-3 p-4 rounded-2xl bg-surfaceGlass border border-border"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  {group.name}
                </Text>
                <Text className="text-sm text-neutrals400 mt-1">
                  {group.memberCount} members
                </Text>
              </View>
              <TouchableOpacity
                className="px-4 py-2 rounded-full bg-primary"
                onPress={() => handleJoinGroup(group.id)}
              >
                <Text className="text-primaryForeground font-semibold">
                  {t('JOIN_GROUP')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default SocialSleepScreen;

