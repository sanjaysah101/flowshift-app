import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Target, 
  Award, 
  TrendingUp, 
  Moon,
  Smartphone,
  Heart,
  ChevronRight,
  LogOut
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  onPress?: () => void;
  icon: any;
  color: string;
}

export default function ProfileTab() {
  const { user, isGuest, signOut } = useAuth();
  const [settings, setSettings] = useState({
    smartNotifications: true,
    breakReminders: true,
    darkMode: false,
    dataSharing: false,
  });

  const userStats = {
    totalFocusTime: '127h 32m',
    longestStreak: '14 days',
    completedSessions: 234,
    mindfulnesScore: 85,
  };

  const achievements = [
    { id: '1', title: 'Focus Master', description: '100 focus sessions', color: '#3B82F6', earned: true },
    { id: '2', title: 'Mindful Week', description: '7 days streak', color: '#10B981', earned: true },
    { id: '3', title: 'Early Bird', description: 'Morning sessions', color: '#F59E0B', earned: false },
    { id: '4', title: 'Deep Thinker', description: '5h+ focus day', color: '#8B5CF6', earned: true },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/welcome');
          }
        }
      ]
    );
  };

  const handleSignIn = () => {
    router.push('/(auth)/welcome');
  };

  const settingsData: SettingItem[] = [
    {
      id: 'notifications',
      title: 'Smart Notifications',
      description: 'AI-powered intervention alerts',
      type: 'toggle',
      value: settings.smartNotifications,
      icon: Bell,
      color: '#3B82F6',
      onPress: () => setSettings(prev => ({ ...prev, smartNotifications: !prev.smartNotifications })),
    },
    {
      id: 'breaks',
      title: 'Break Reminders',
      description: 'Gentle nudges to take breaks',
      type: 'toggle',
      value: settings.breakReminders,
      icon: Heart,
      color: '#EF4444',
      onPress: () => setSettings(prev => ({ ...prev, breakReminders: !prev.breakReminders })),
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      description: 'Manage your data preferences',
      type: 'navigation',
      icon: Shield,
      color: '#10B981',
      onPress: () => Alert.alert('Privacy Settings', 'Privacy settings would open here'),
    },
    {
      id: 'goals',
      title: 'Personal Goals',
      description: 'Set your focus targets',
      type: 'navigation',
      icon: Target,
      color: '#F59E0B',
      onPress: () => Alert.alert('Goals', 'Goal setting would open here'),
    },
    {
      id: 'darkmode',
      title: 'Dark Mode',
      description: 'Easier on the eyes',
      type: 'toggle',
      value: settings.darkMode,
      icon: Moon,
      color: '#6B7280',
      onPress: () => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode })),
    },
  ];

  const handleSettingPress = (setting: SettingItem) => {
    if (setting.onPress) {
      setting.onPress();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.profileHeader}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color="#FFFFFF" />
              </View>
            </View>
            {isGuest ? (
              <>
                <Text style={styles.userName}>Guest User</Text>
                <Text style={styles.userEmail}>Sign up to save your progress</Text>
                <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                  <Text style={styles.signInButtonText}>Sign Up / Sign In</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.userName}>{user?.user_metadata?.full_name || 'FlowShift User'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.joinDate}>Mindful since {new Date(user?.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
              </>
            )}
          </LinearGradient>
        </Animated.View>

        {/* Stats Overview */}
        {!isGuest && (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <TrendingUp size={20} color="#3B82F6" />
                <Text style={styles.statValue}>{userStats.totalFocusTime}</Text>
                <Text style={styles.statLabel}>Total Focus</Text>
              </View>
              <View style={styles.statCard}>
                <Award size={20} color="#10B981" />
                <Text style={styles.statValue}>{userStats.longestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
              <View style={styles.statCard}>
                <Target size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{userStats.completedSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Heart size={20} color="#EF4444" />
                <Text style={styles.statValue}>{userStats.mindfulnesScore}%</Text>
                <Text style={styles.statLabel}>Mindfulness</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Achievements */}
        {!isGuest && (
          <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement, index) => (
                <Animated.View
                  key={achievement.id}
                  entering={FadeInDown.duration(500).delay(600 + index * 100)}
                  style={[
                    styles.achievementCard,
                    { opacity: achievement.earned ? 1 : 0.5 }
                  ]}
                >
                  <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
                    <Award size={20} color={achievement.color} />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Settings */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsData.map((setting, index) => (
            <Animated.View
              key={setting.id}
              entering={FadeInDown.duration(500).delay(800 + index * 100)}
              style={styles.settingItem}
            >
              <TouchableOpacity
                style={styles.settingContent}
                onPress={() => handleSettingPress(setting)}
                disabled={setting.type === 'toggle'}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
                    <setting.icon size={20} color={setting.color} />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    {setting.description && (
                      <Text style={styles.settingDescription}>{setting.description}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.settingRight}>
                  {setting.type === 'toggle' ? (
                    <Switch
                      value={setting.value}
                      onValueChange={() => setting.onPress?.()}
                      trackColor={{ false: '#F3F4F6', true: setting.color + '40' }}
                      thumbColor={setting.value ? setting.color : '#9CA3AF'}
                    />
                  ) : (
                    <ChevronRight size={20} color="#9CA3AF" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Sign Out Button */}
          {!isGuest && (
            <Animated.View
              entering={FadeInDown.duration(500).delay(1200)}
              style={styles.settingItem}
            >
              <TouchableOpacity
                style={styles.settingContent}
                onPress={handleSignOut}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIcon, { backgroundColor: '#FEF2F2' }]}>
                    <LogOut size={20} color="#EF4444" />
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: '#EF4444' }]}>Sign Out</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* App Info */}
        <Animated.View entering={FadeInDown.duration(600).delay(1000)} style={styles.appInfo}>
          <View style={styles.appInfoContent}>
            <Smartphone size={24} color="#3B82F6" />
            <View style={styles.appInfoText}>
              <Text style={styles.appName}>FlowShift</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
            </View>
          </View>
          <Text style={styles.appDescription}>
            Your mindful digital companion for breaking harmful patterns and building healthy digital habits.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    marginBottom: 32,
  },
  profileGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  settingRight: {
    marginLeft: 16,
  },
  appInfo: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  appInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appInfoText: {
    marginLeft: 16,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});