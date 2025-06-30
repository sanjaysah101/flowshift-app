import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView, // <-- Add this import
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Target, Heart, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { signInAsGuest } = useAuth();

  const handleGetStarted = () => {
    router.push('/(auth)/login');
  };

  const handleGuestMode = () => {
    signInAsGuest();
    router.replace('/(tabs)');
  };

  const features = [
    {
      icon: Brain,
      title: 'Smart Interventions',
      description: 'AI-powered suggestions for mindful digital habits',
      color: '#3B82F6',
    },
    {
      icon: Target,
      title: 'Focus Sessions',
      description: 'Structured focus time with personalized modes',
      color: '#10B981',
    },
    {
      icon: Heart,
      title: 'Mindful Breaks',
      description: 'Gentle reminders to pause and breathe',
      color: '#EF4444',
    },
    {
      icon: Zap,
      title: 'Progress Insights',
      description: 'Track your digital wellness journey',
      color: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EFF6FF', '#DBEAFE', '#FAFAFA']}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(800)}
            style={styles.header}
          >
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.logo}>
              <Brain size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.title}>FlowShift</Text>
            <Text style={styles.subtitle}>Your mindful digital companion</Text>
          </Animated.View>

          {/* Features */}
          <Animated.View
            entering={FadeInUp.duration(800).delay(200)}
            style={styles.featuresContainer}
          >
            <View style={styles.featuresCard}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Animated.View
                    key={feature.title}
                    entering={FadeInUp.duration(600).delay(400 + index * 100)}
                    style={styles.featureRow}
                  >
                    <View
                      style={[
                        styles.featureIcon,
                        { backgroundColor: feature.color + '22' },
                      ]}
                    >
                      <Icon size={26} color={feature.color} />
                    </View>
                    <View style={styles.featureContent}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
          {/* Add bottom padding so last item is not hidden behind CTA */}
          <View style={{ height: 140 }} />
        </ScrollView>

        {/* Floating CTA */}
        <View style={styles.floatingCtaContainer} pointerEvents="box-none">
          <BlurView intensity={60} tint="light" style={styles.blurBg}>
            <LinearGradient
              colors={['#FFFFFFDD', '#F3F4F6DD']}
              style={styles.ctaGradient}
            >
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGetStarted}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleGuestMode}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Try as Guest</Text>
              </TouchableOpacity>
              <Text style={styles.disclaimer}>
                Start your journey to mindful digital habits
              </Text>
            </LinearGradient>
          </BlurView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  background: {
    flex: 1,
    paddingHorizontal: 0,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    gap: 8,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  featuresContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    marginTop: 8,
  },
  featuresCard: {
    backgroundColor: '#FFFFFFEE',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: width * 0.92,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 8,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  floatingCtaContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 0,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    alignItems: 'center',
    zIndex: 10,
  },
  blurBg: {
    width: width,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: width,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(59,130,246,0.07)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 160, // ensures content is not hidden behind CTA
  },
});
