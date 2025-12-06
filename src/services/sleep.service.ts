import { supabase } from '@/config/supabase';
import { SleepRecord, SleepStats, HeatmapData } from '@/types/sleep';

export class SleepService {
  // Create a new sleep record
  static async createSleepRecord(userId: string, sleepTime: Date): Promise<SleepRecord | null> {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .insert({
          user_id: userId,
          sleep_time: sleepTime.toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        userId: data.user_id,
        sleepTime: new Date(data.sleep_time),
        wakeTime: data.wake_time ? new Date(data.wake_time) : undefined,
        quality: data.quality,
        createdAt: new Date(data.created_at),
      };
    } catch (error) {
      console.error('Error creating sleep record:', error);
      return null;
    }
  }

  // Update wake time and quality
  static async updateSleepRecord(
    recordId: string,
    wakeTime: Date,
    quality?: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sleep_records')
        .update({
          wake_time: wakeTime.toISOString(),
          quality: quality,
        })
        .eq('id', recordId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating sleep record:', error);
      return false;
    }
  }

  // Get user's sleep records
  static async getSleepRecords(
    userId: string,
    limit: number = 30
  ): Promise<SleepRecord[]> {
    try {
      const { data, error } = await supabase
        .from('sleep_records')
        .select('*')
        .eq('user_id', userId)
        .order('sleep_time', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map((record) => ({
        id: record.id,
        userId: record.user_id,
        sleepTime: new Date(record.sleep_time),
        wakeTime: record.wake_time ? new Date(record.wake_time) : undefined,
        quality: record.quality,
        duration: record.wake_time
          ? Math.floor(
              (new Date(record.wake_time).getTime() -
                new Date(record.sleep_time).getTime()) /
                60000
            )
          : undefined,
        createdAt: new Date(record.created_at),
      }));
    } catch (error) {
      console.error('Error fetching sleep records:', error);
      return [];
    }
  }

  // Calculate sleep statistics
  static async getSleepStats(userId: string): Promise<SleepStats | null> {
    try {
      const records = await this.getSleepRecords(userId, 90); // Last 90 days

      if (records.length === 0) {
        return null;
      }

      // Calculate averages
      const completedRecords = records.filter((r) => r.wakeTime);
      const totalDuration = completedRecords.reduce((sum, r) => sum + (r.duration || 0), 0);
      const totalQuality = completedRecords.reduce((sum, r) => sum + (r.quality || 0), 0);

      // Calculate average sleep time (HH:mm)
      const sleepTimes = records.map((r) => {
        const hours = r.sleepTime.getHours();
        const minutes = r.sleepTime.getMinutes();
        return hours * 60 + minutes;
      });
      const avgSleepMinutes = Math.floor(
        sleepTimes.reduce((sum, t) => sum + t, 0) / sleepTimes.length
      );
      const avgSleepHours = Math.floor(avgSleepMinutes / 60);
      const avgSleepMins = avgSleepMinutes % 60;

      // Calculate current streak
      const currentStreak = this.calculateStreak(records);

      // Weekly data for charts
      const weeklyData = this.getWeeklyData(records);

      return {
        averageSleepTime: `${avgSleepHours.toString().padStart(2, '0')}:${avgSleepMins
          .toString()
          .padStart(2, '0')}`,
        averageWakeTime: '07:00', // Placeholder
        averageDuration: completedRecords.length > 0 ? totalDuration / completedRecords.length / 60 : 0,
        averageQuality: completedRecords.length > 0 ? totalQuality / completedRecords.length : 0,
        totalNights: records.length,
        currentStreak,
        longestStreak: currentStreak, // Simplified
        weeklyData,
      };
    } catch (error) {
      console.error('Error calculating sleep stats:', error);
      return null;
    }
  }

  // Calculate streak
  private static calculateStreak(records: SleepRecord[]): number {
    if (records.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < records.length; i++) {
      const recordDate = new Date(records[i].sleepTime);
      recordDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Get weekly data for charts
  private static getWeeklyData(records: SleepRecord[]): any[] {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = days.map((day) => ({
      day,
      quality: 0,
      duration: 0,
    }));

    const lastWeekRecords = records.filter((r) => {
      const daysDiff = Math.floor(
        (new Date().getTime() - r.sleepTime.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysDiff < 7;
    });

    lastWeekRecords.forEach((record) => {
      const dayIndex = record.sleepTime.getDay();
      weekData[dayIndex].quality = record.quality || 0;
      weekData[dayIndex].duration = (record.duration || 0) / 60;
    });

    return weekData;
  }

  // Get heatmap data for consistency visualization
  static async getHeatmapData(userId: string, days: number = 90): Promise<HeatmapData[]> {
    try {
      const records = await this.getSleepRecords(userId, days);
      const heatmapData: HeatmapData[] = [];

      const today = new Date();
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const record = records.find((r) => {
          const recordDate = r.sleepTime.toISOString().split('T')[0];
          return recordDate === dateStr;
        });

        heatmapData.push({
          date: dateStr,
          value: record ? (record.quality ? Math.floor(record.quality / 2.5) : 2) : 0,
          quality: record?.quality,
        });
      }

      return heatmapData.reverse();
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      return [];
    }
  }
}

