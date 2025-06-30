import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Pause, Clock, Zap, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface InterventionCard {
  id: string;
  type: 'break' | 'mindful' | 'focus' | 'reflection';
  title: string;
  message: string;
  action: string;
  color: string;
}

export default function HomeTab() {
  const { user, isGuest } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [interventions, setInterventions] = useState<InterventionCard[]>([]);
  const [todayStats, setTodayStats] = useState({
    screenTime: '3h 24m',
    breaks: 12,
    mindfulMoments: 8,
    focusScore: 76,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate AI-powered interventions
    const mockInterventions: InterventionCard[] = [
      {
        id: '1',
        type: 'break',
        title: 'Time for a mindful break',
        message: "You've been focused for 45 minutes. How about a gentle stretch?",
        action: 'Take Break',
        color: '#10B981',
      },
      {
        id: '2',
        type: 'mindful',
        title: 'Mindful browsing',
        message: 'Before opening that app, take a breath. What are you hoping to find?',
        action: 'Reflect',
        color: '#3B82F6',
      },
      {
        id: '3',
        type: 'focus',
        title: 'Focus opportunity',
        message: 'Your energy is high right now. Perfect time for deep work.',
        action: 'Start Focus',
        color: '#8B5CF6',
      },
    ];
    
    setInterventions(mockInterventions);
    
    return () => clearInterval(timer);
  }, []);

  const handleIntervention = (intervention: InterventionCard) => {
    switch (intervention.type) {
      case 'break':
        Alert.alert(
          'Mindful Break',
          'Take a moment to breathe deeply and stretch. Your mind and body will thank you!',
          [{ text: 'OK' }]
        );
        break;
      case 'mindful':
        Alert.alert(
          'Mindful Moment',
          'Pause and ask yourself: What am I hoping to achieve right now? Is this aligned with my intentions?',
          [{ text: 'Reflect' }]
        );
        break;
      case 'focus':
        router.push('/(tabs)/focus');
        break;
      default:
        console.log('Intervention action:', intervention.action);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'break':
        Alert.alert(
          'Break Time',
          'Step away from your screen for a few minutes. Try some deep breathing or light stretching.',
          [{ text: 'OK' }]
        );
        break;
      case 'focus':
        router.push('/(tabs)/focus');
        break;
      case 'reflect':
        Alert.alert(
          'Reflection',
          'Take a moment to reflect on your current digital habits. What would you like to change?',
          [{ text: 'Continue Reflecting' }]
        );
        break;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.time}>{formatTime(currentTime)}</Text>
          <Text style={styles.subtitle}>
            {isGuest ? 'Welcome to FlowShift' : 'Ready for a mindful day?'}
          </Text>
          {isGuest && (
            <View style={styles.guestBanner}>
              <Text style={styles.guestText}>
                You're in guest mode. Sign up to save your progress and unlock personalized insights!
              </Text>
              <TouchableOpacity 
                style={styles.signUpButton}
                onPress={() => router.push('/(auth)/welcome')}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.statsContainer}>
          <LinearGradient
            colors={['#EFF6FF', '#DBEAFE']}
            style={styles.statsCard}
          >
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Clock size={20} color="#3B82F6" />
                <Text style={styles.statNumber}>{todayStats.screenTime}</Text>
                <Text style={styles.statLabel}>Screen time</Text>
              </View>
              <View style={styles.statItem}>
                <Pause size={20} color="#10B981" />
                <Text style={styles.statNumber}>{todayStats.breaks}</Text>
                <Text style={styles.statLabel}>Breaks taken</Text>
              </View>
              <View style={styles.statItem}>
                <Brain size={20} color="#8B5CF6" />
                <Text style={styles.statNumber}>{todayStats.mindfulMoments}</Text>
                <Text style={styles.statLabel}>Mindful moments</Text>
              </View>
              <View style={styles.statItem}>
                <Zap size={20} color="#F59E0B" />
                <Text style={styles.statNumber}>{todayStats.focusScore}%</Text>
                <Text style={styles.statLabel}>Focus score</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Smart Interventions */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.interventionsSection}>
          <Text style={styles.sectionTitle}>Smart Interventions</Text>
          <Text style={styles.sectionSubtitle}>AI-powered suggestions for your wellbeing</Text>
          
          {interventions.map((intervention, index) => (
            <Animated.View
              key={intervention.id}
              entering={FadeInUp.duration(500).delay(600 + index * 100)}
              style={styles.interventionCard}
            >
              <View style={styles.interventionContent}>
                <View style={[styles.interventionIcon, { backgroundColor: intervention.color + '20' }]}>
                  <Brain size={24} color={intervention.color} />
                </View>
                <View style={styles.interventionText}>
                  <Text style={styles.interventionTitle}>{intervention.title}</Text>
                  <Text style={styles.interventionMessage}>{intervention.message}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.interventionButton, { backgroundColor: intervention.color }]}
                onPress={() => handleIntervention(intervention)}
                activeOpacity={0.8}
              >
                <Text style={styles.interventionButtonText}>{intervention.action}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#FEF3C7' }]}
              onPress={() => handleQuickAction('break')}
              activeOpacity={0.7}
            >
              <Pause size={24} color="#F59E0B" />
              <Text style={styles.actionTitle}>Take Break</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#ECFDF5' }]}
              onPress={() => handleQuickAction('focus')}
              activeOpacity={0.7}
            >
              <Target size={24} color="#10B981" />
              <Text style={styles.actionTitle}>Start Focus</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: '#F3E8FF' }]}
              onPress={() => handleQuickAction('reflect')}
              activeOpacity={0.7}
            >
              <Brain size={24} color="#8B5CF6" />
              <Text style={styles.actionTitle}>Reflect</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 16,
  },
  guestBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  guestText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginBottom: 12,
    lineHeight: 20,
  },
  signUpButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsCard: {
    borderRadius: 20,
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  interventionsSection: {
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
  interventionCard: {
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
  interventionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  interventionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  interventionText: {
    flex: 1,
  },
  interventionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  interventionMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  interventionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  interventionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 8,
    textAlign: 'center',
  },
});