import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, Timer, Target, Zap } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type FocusMode = 'pomodoro' | 'deep' | 'mindful' | 'custom';

interface FocusSession {
  mode: FocusMode;
  duration: number;
  name: string;
  description: string;
  color: string;
  icon: any;
}

export default function FocusTab() {
  const { user, isGuest } = useAuth();
  const [selectedMode, setSelectedMode] = useState<FocusMode>('pomodoro');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500); // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const pulseAnimation = useSharedValue(1);
  const progressAnimation = useSharedValue(0);

  const focusModes: FocusSession[] = [
    {
      mode: 'pomodoro',
      duration: 1500,
      name: 'Pomodoro',
      description: '25 min focus + 5 min break',
      color: '#EF4444',
      icon: Timer,
    },
    {
      mode: 'deep',
      duration: 5400,
      name: 'Deep Work',
      description: '90 min of uninterrupted focus',
      color: '#8B5CF6',
      icon: Target,
    },
    {
      mode: 'mindful',
      duration: 600,
      name: 'Mindful Focus',
      description: '10 min mindful productivity',
      color: '#10B981',
      icon: Zap,
    },
  ];

  useEffect(() => {
    if (isActive) {
      pulseAnimation.value = withRepeat(
        withTiming(1.1, { duration: 1000 }),
        -1,
        true
      );
    } else {
      pulseAnimation.value = withTiming(1);
    }
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const selectedModeData = focusModes.find(m => m.mode === selectedMode);
          if (selectedModeData) {
            progressAnimation.value = withTiming(
              1 - (newTime / selectedModeData.duration)
            );
          }
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedMode]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setCurrentSession(prev => prev + 1);
    
    // Save session to database if user is authenticated
    if (user && !isGuest) {
      await saveFocusSession();
    }
    
    // Reset timer for next session
    const selectedModeData = focusModes.find(m => m.mode === selectedMode);
    if (selectedModeData) {
      setTimeLeft(selectedModeData.duration);
      progressAnimation.value = 0;
    }
    
    Alert.alert(
      'Session Complete!',
      `Great job! You completed a ${selectedModeData?.name} session.`,
      [{ text: 'OK' }]
    );
  };

  const saveFocusSession = async () => {
    if (!user) return;
    
    try {
      const selectedModeData = focusModes.find(m => m.mode === selectedMode);
      if (!selectedModeData) return;

      const { error } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          mode: selectedMode,
          duration: selectedModeData.duration,
          completed_duration: selectedModeData.duration,
          started_at: new Date(Date.now() - selectedModeData.duration * 1000).toISOString(),
          completed_at: new Date().toISOString(),
          is_completed: true,
        });

      if (error) {
        console.error('Error saving focus session:', error);
      }
    } catch (error) {
      console.error('Error saving focus session:', error);
    }
  };

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progressAnimation.value * 360}deg` }],
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const selectedModeData = focusModes.find(m => m.mode === selectedMode);
    if (selectedModeData) {
      setTimeLeft(selectedModeData.duration);
      progressAnimation.value = 0;
    }
  };

  const selectMode = (mode: FocusMode) => {
    setSelectedMode(mode);
    setIsActive(false);
    const modeData = focusModes.find(m => m.mode === mode);
    if (modeData) {
      setTimeLeft(modeData.duration);
      progressAnimation.value = 0;
    }
  };

  const selectedModeData = focusModes.find(m => m.mode === selectedMode);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.title}>Focus Mode</Text>
          <Text style={styles.subtitle}>Choose your focus session</Text>
          {isGuest && (
            <View style={styles.guestBanner}>
              <Text style={styles.guestText}>
                Sign up to save your progress and unlock insights
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Focus Mode Selection */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.modeSelection}>
          {focusModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.mode;
            
            return (
              <TouchableOpacity
                key={mode.mode}
                style={[
                  styles.modeCard,
                  isSelected && { borderColor: mode.color, borderWidth: 2 }
                ]}
                onPress={() => selectMode(mode.mode)}
                activeOpacity={0.7}
              >
                <View style={[styles.modeIcon, { backgroundColor: mode.color + '20' }]}>
                  <Icon size={24} color={mode.color} />
                </View>
                <Text style={styles.modeName}>{mode.name}</Text>
                <Text style={styles.modeDescription}>{mode.description}</Text>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        {/* Timer Circle */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.timerContainer}>
          <LinearGradient
            colors={selectedModeData ? [selectedModeData.color + '20', selectedModeData.color + '10'] : ['#F3F4F6', '#E5E7EB']}
            style={styles.timerBackground}
          >
            <Animated.View style={[styles.timerCircle, pulseStyle]}>
              <View style={styles.progressRing}>
                <Animated.View 
                  style={[
                    styles.progressIndicator, 
                    { backgroundColor: selectedModeData?.color },
                    progressStyle
                  ]} 
                />
              </View>
              <Text style={[styles.timerText, { color: selectedModeData?.color }]}>
                {formatTime(timeLeft)}
              </Text>
              <Text style={styles.timerLabel}>
                {isActive ? 'Focus time' : 'Ready to focus'}
              </Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Controls */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetTimer}
            activeOpacity={0.7}
          >
            <Square size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: selectedModeData?.color || '#3B82F6' }
            ]}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            {isActive ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Timer size={24} color="#6B7280" />
          </TouchableOpacity>
        </Animated.View>

        {/* Session Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.sessionStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{currentSession}</Text>
            <Text style={styles.statLabel}>Sessions today</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.5h</Text>
            <Text style={styles.statLabel}>Total focus time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day streak</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
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
  modeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  modeCard: {
    width: (width - 60) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modeName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  modeDescription: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 14,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  timerBackground: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  progressRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: '#F3F4F6',
  },
  progressIndicator: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -4,
    left: '50%',
    marginLeft: -4,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});