import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Clock, Brain, Target, Calendar, Award } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type TimeRange = 'today' | 'week' | 'month';

interface Insight {
  id: string;
  type: 'improvement' | 'achievement' | 'pattern' | 'suggestion';
  title: string;
  description: string;
  value?: string;
  trend?: 'up' | 'down' | 'stable';
  color: string;
}

export default function InsightsTab() {
  const { user, isGuest } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [userStats, setUserStats] = useState({
    totalFocusTime: '28.4h',
    breaksThisWeek: 47,
    mindfulnessScore: 82,
    focusSessionsCompleted: 0,
  });
  const [loading, setLoading] = useState(false);
  
  const timeRanges = [
    { key: 'today' as TimeRange, label: 'Today' },
    { key: 'week' as TimeRange, label: 'This Week' },
    { key: 'month' as TimeRange, label: 'This Month' },
  ];

  const mockInsights: Insight[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Focus Streak!',
      description: 'You completed 7 focus sessions this week - your best yet!',
      value: '7 sessions',
      trend: 'up',
      color: '#10B981',
    },
    {
      id: '2',
      type: 'pattern',
      title: 'Peak Focus Time',
      description: 'Your most productive hours are between 9-11 AM',
      value: '9-11 AM',
      color: '#3B82F6',
    },
    {
      id: '3',
      type: 'improvement',
      title: 'Screen Time Reduced',
      description: 'Down 23% from last week. Great progress!',
      value: '-23%',
      trend: 'down',
      color: '#8B5CF6',
    },
    {
      id: '4',
      type: 'suggestion',
      title: 'Break Reminder',
      description: 'You tend to skip breaks after 2 PM. Set reminders?',
      color: '#F59E0B',
    },
  ];

  const weeklyData = [
    { day: 'Mon', focus: 4.2, breaks: 8 },
    { day: 'Tue', focus: 3.8, breaks: 6 },
    { day: 'Wed', focus: 5.1, breaks: 10 },
    { day: 'Thu', focus: 4.7, breaks: 9 },
    { day: 'Fri', focus: 3.9, breaks: 7 },
    { day: 'Sat', focus: 2.1, breaks: 4 },
    { day: 'Sun', focus: 1.8, breaks: 3 },
  ];

  const maxFocus = Math.max(...weeklyData.map(d => d.focus));

  useEffect(() => {
    if (user && !isGuest) {
      loadUserData();
    } else {
      // Use mock data for guest users
      setInsights(mockInsights);
    }
  }, [user, isGuest, selectedTimeRange]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load focus sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('created_at', { ascending: false });

      if (sessionsError) {
        console.error('Error loading sessions:', sessionsError);
      } else {
        setUserStats(prev => ({
          ...prev,
          focusSessionsCompleted: sessions?.length || 0,
        }));
      }

      // Load insights
      const { data: insightsData, error: insightsError } = await supabase
        .from('insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (insightsError) {
        console.error('Error loading insights:', insightsError);
        setInsights(mockInsights);
      } else {
        setInsights(insightsData || mockInsights);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      setInsights(mockInsights);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Award;
      case 'pattern':
        return Brain;
      case 'improvement':
        return TrendingUp;
      case 'suggestion':
        return Target;
      default:
        return Brain;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.title}>Your Insights</Text>
          <Text style={styles.subtitle}>Understand your digital patterns</Text>
          {isGuest && (
            <View style={styles.guestBanner}>
              <Text style={styles.guestText}>
                Sign up to get personalized insights based on your actual usage patterns
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Time Range Selector */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.timeRangeContainer}>
          <View style={styles.timeRangeSelector}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeButton,
                  selectedTimeRange === range.key && styles.timeRangeButtonActive
                ]}
                onPress={() => setSelectedTimeRange(range.key)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.timeRangeText,
                  selectedTimeRange === range.key && styles.timeRangeTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Weekly Overview Chart */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Focus Time This Week</Text>
          <View style={styles.chart}>
            {weeklyData.map((data, index) => (
              <View key={data.day} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <Animated.View 
                    entering={FadeInRight.duration(800).delay(600 + index * 100)}
                    style={[
                      styles.bar,
                      { 
                        height: (data.focus / maxFocus) * 100,
                        backgroundColor: '#3B82F6',
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.day}</Text>
                <Text style={styles.barValue}>{data.focus}h</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Key Metrics */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <LinearGradient
              colors={['#EFF6FF', '#DBEAFE']}
              style={[styles.metricCard, { width: '100%' }]}
            >
              <View style={styles.metricHeader}>
                <Clock size={24} color="#3B82F6" />
                <Text style={styles.metricValue}>{userStats.totalFocusTime}</Text>
              </View>
              <Text style={styles.metricLabel}>Total Focus Time</Text>
              <Text style={styles.metricChange}>+12% from last week</Text>
            </LinearGradient>
            
            <View style={styles.metricRow}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.metricCard}
              >
                <View style={styles.metricHeader}>
                  <Target size={20} color="#10B981" />
                  <Text style={styles.metricValue}>{userStats.breaksThisWeek}</Text>
                </View>
                <Text style={styles.metricLabel}>Breaks Taken</Text>
                <Text style={styles.metricChange}>+8 this week</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#FEF3C7', '#FDE68A']}
                style={styles.metricCard}
              >
                <View style={styles.metricHeader}>
                  <Brain size={20} color="#F59E0B" />
                  <Text style={styles.metricValue}>{userStats.mindfulnessScore}%</Text>
                </View>
                <Text style={styles.metricLabel}>Mindfulness Score</Text>
                <Text style={styles.metricChange}>+5% improvement</Text>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>

        {/* AI Insights */}
        <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>
            {isGuest ? 'Sample Insights' : 'AI Insights'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {isGuest 
              ? 'See what insights you could get with a full account'
              : 'Personalized recommendations based on your patterns'
            }
          </Text>
          
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            
            return (
              <Animated.View
                key={insight.id}
                entering={FadeInDown.duration(500).delay(1000 + index * 100)}
                style={[styles.insightCard, isGuest && styles.insightCardGuest]}
              >
                <View style={styles.insightHeader}>
                  <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
                    <Icon size={20} color={insight.color} />
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    {insight.value && (
                      <Text style={[styles.insightValue, { color: insight.color }]}>
                        {insight.value}
                      </Text>
                    )}
                  </View>
                  {insight.trend && (
                    <View style={[styles.trendIcon, {
                      backgroundColor: insight.trend === 'up' ? '#ECFDF5' : '#FEF2F2'
                    }]}>
                      <TrendingUp 
                        size={16} 
                        color={insight.trend === 'up' ? '#10B981' : '#EF4444'}
                        style={{ 
                          transform: [{ rotate: insight.trend === 'down' ? '180deg' : '0deg' }] 
                        }}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.insightDescription}>{insight.description}</Text>
              </Animated.View>
            );
          })}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 16,
  },
  guestBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  guestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    textAlign: 'center',
  },
  timeRangeContainer: {
    marginBottom: 32,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeRangeButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  timeRangeTextActive: {
    color: '#1F2937',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  metricsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 20,
  },
  metricsGrid: {
    gap: 12,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  insightsContainer: {
    marginBottom: 32,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  insightCardGuest: {
    opacity: 0.8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  trendIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});