import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  cancelAnimation,
  Easing 
} from 'react-native-reanimated';

interface BreathingExerciseProps {
  onComplete?: () => void;
  duration?: number; // in minutes
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export default function BreathingExercise({ onComplete, duration = 2 }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [cycleCount, setCycleCount] = useState(0);
  
  const breathingAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  const breathingPattern = {
    inhale: 4,   // 4 seconds
    hold: 4,     // 4 seconds  
    exhale: 6,   // 6 seconds
    pause: 1,    // 1 second
  };

  const phaseMessages = {
    inhale: 'Breathe in slowly...',
    hold: 'Hold your breath...',
    exhale: 'Breathe out gently...',
    pause: 'Relax...',
  };

  useEffect(() => {
    if (isActive) {
      startBreathingCycle();
    } else {
      cancelAnimation(breathingAnimation);
      cancelAnimation(pulseAnimation);
    }

    return () => {
      cancelAnimation(breathingAnimation);
      cancelAnimation(pulseAnimation);
    };
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startBreathingCycle = () => {
    const phases: BreathingPhase[] = ['inhale', 'hold', 'exhale', 'pause'];
    let currentPhaseIndex = 0;
    
    const runPhase = () => {
      const phase = phases[currentPhaseIndex];
      const duration = breathingPattern[phase] * 1000;
      
      setCurrentPhase(phase);
      
      if (phase === 'inhale') {
        breathingAnimation.value = withTiming(1, {
          duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        });
        pulseAnimation.value = withTiming(1.2, {
          duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        });
      } else if (phase === 'exhale') {
        breathingAnimation.value = withTiming(0, {
          duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        });
        pulseAnimation.value = withTiming(1, {
          duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        });
      }
      
      setTimeout(() => {
        if (isActive) {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          if (currentPhaseIndex === 0) {
            setCycleCount(prev => prev + 1);
          }
          runPhase();
        }
      }, duration);
    };
    
    runPhase();
  };

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetBreathing = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(duration * 60);
    setCycleCount(0);
    breathingAnimation.value = 0;
    pulseAnimation.value = 1;
  };

  const breathingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: 0.6 + (breathingAnimation.value * 0.4) }],
      opacity: 0.3 + (breathingAnimation.value * 0.7),
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EFF6FF', '#DBEAFE']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mindful Breathing</Text>
          <Text style={styles.timeRemaining}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathingContainer}>
          <Animated.View style={[styles.breathingCircleOuter, pulseStyle]}>
            <Animated.View style={[styles.breathingCircle, breathingStyle]}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.breathingInner}
              >
                <Text style={styles.breathingText}>
                  {Math.floor(breathingAnimation.value * 100)}%
                </Text>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Phase Instruction */}
        <View style={styles.instructionContainer}>
          <Text style={styles.phaseTitle}>{currentPhase.toUpperCase()}</Text>
          <Text style={styles.phaseMessage}>{phaseMessages[currentPhase]}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{cycleCount}</Text>
            <Text style={styles.statLabel}>Cycles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{breathingPattern[currentPhase]}s</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={resetBreathing}>
            <RotateCcw size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton} onPress={toggleBreathing}>
            {isActive ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <View style={styles.controlButton} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  timeRemaining: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  breathingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  breathingCircleOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  breathingInner: {
    flex: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    marginBottom: 4,
    letterSpacing: 2,
  },
  phaseMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 32,
  },
  statItem: {
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
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});