import { supabase } from '@/config/supabase';
import { SleepGroup, GroupMember } from '@/types/sleep';

export class GroupService {
  // Create a new sleep group
  static async createGroup(
    name: string,
    description: string,
    createdBy: string
  ): Promise<SleepGroup | null> {
    try {
      const { data, error } = await supabase
        .from('sleep_groups')
        .insert({
          name,
          description,
          created_by: createdBy,
        })
        .select()
        .single();

      if (error) throw error;

      // Automatically add creator as member
      await this.joinGroup(data.id, createdBy);

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdBy: data.created_by,
        memberCount: 1,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Error creating group:', error);
      return null;
    }
  }

  // Join a group
  static async joinGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('group_members').insert({
        group_id: groupId,
        user_id: userId,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  }

  // Leave a group
  static async leaveGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      return false;
    }
  }

  // Get user's groups
  static async getUserGroups(userId: string): Promise<SleepGroup[]> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(
          `
          group_id,
          sleep_groups (
            id,
            name,
            description,
            created_by,
            created_at
          )
        `
        )
        .eq('user_id', userId);

      if (error) throw error;

      const groups: SleepGroup[] = [];
      for (const item of data) {
        const group = (item as any).sleep_groups;
        if (group) {
          const memberCount = await this.getGroupMemberCount(group.id);
          groups.push({
            id: group.id,
            name: group.name,
            description: group.description,
            createdBy: group.created_by,
            memberCount,
            createdAt: new Date(group.created_at),
          });
        }
      }

      return groups;
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }
  }

  // Get group members with stats
  static async getGroupMembers(groupId: string): Promise<GroupMember[]> {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(
          `
          id,
          user_id,
          group_id,
          joined_at,
          profiles (
            username,
            avatar_url
          )
        `
        )
        .eq('group_id', groupId);

      if (error) throw error;

      const members: GroupMember[] = [];

      for (const item of data) {
        const profile = (item as any).profiles;
        
        // Get member's sleep stats
        const { data: sleepData } = await supabase
          .from('sleep_records')
          .select('sleep_time')
          .eq('user_id', item.user_id)
          .order('sleep_time', { ascending: false })
          .limit(7);

        // Calculate average sleep time
        let avgSleepTime = '23:00';
        if (sleepData && sleepData.length > 0) {
          const times = sleepData.map((r) => {
            const date = new Date(r.sleep_time);
            return date.getHours() * 60 + date.getMinutes();
          });
          const avgMinutes = Math.floor(times.reduce((a, b) => a + b, 0) / times.length);
          const hours = Math.floor(avgMinutes / 60);
          const mins = avgMinutes % 60;
          avgSleepTime = `${hours.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}`;
        }

        members.push({
          id: item.id,
          userId: item.user_id,
          groupId: item.group_id,
          username: profile?.username || 'Unknown',
          avatarUrl: profile?.avatar_url,
          joinedAt: new Date(item.joined_at),
          stats: {
            averageSleepTime: avgSleepTime,
            streak: 0, // Simplified
            rank: 0, // Will be calculated
            isLatestSleeper: false, // Will be calculated
          },
        });
      }

      // Calculate rankings based on average sleep time
      members.sort((a, b) => {
        const timeA = a.stats.averageSleepTime.split(':').map(Number);
        const timeB = b.stats.averageSleepTime.split(':').map(Number);
        const minutesA = timeA[0] * 60 + timeA[1];
        const minutesB = timeB[0] * 60 + timeB[1];
        return minutesA - minutesB;
      });

      // Assign ranks and mark latest sleeper
      members.forEach((member, index) => {
        member.stats.rank = index + 1;
        member.stats.isLatestSleeper = index === members.length - 1;
      });

      return members;
    } catch (error) {
      console.error('Error fetching group members:', error);
      return [];
    }
  }

  // Get group member count
  static async getGroupMemberCount(groupId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching group member count:', error);
      return 0;
    }
  }

  // Search public groups
  static async searchGroups(query: string): Promise<SleepGroup[]> {
    try {
      const { data, error } = await supabase
        .from('sleep_groups')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(20);

      if (error) throw error;

      const groups: SleepGroup[] = [];
      for (const group of data) {
        const memberCount = await this.getGroupMemberCount(group.id);
        groups.push({
          id: group.id,
          name: group.name,
          description: group.description,
          createdBy: group.created_by,
          memberCount,
          createdAt: new Date(group.created_at),
        });
      }

      return groups;
    } catch (error) {
      console.error('Error searching groups:', error);
      return [];
    }
  }

  // Get fake "people sleeping now" count for social proof
  static getFakeSleepingCount(): number {
    const hour = new Date().getHours();
    
    // More people "sleeping" during night hours
    if (hour >= 22 || hour <= 6) {
      return Math.floor(Math.random() * 5000) + 10000; // 10k-15k
    } else if (hour >= 7 && hour <= 9) {
      return Math.floor(Math.random() * 2000) + 3000; // 3k-5k (morning)
    } else {
      return Math.floor(Math.random() * 1000) + 500; // 500-1500 (daytime)
    }
  }
}

