import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Brain, Heart, Target } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

interface InterventionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'break' | 'mindful' | 'focus';
  title: string;
  message: string;
  primaryAction: string;
  secondaryAction?: string;
  onPrimaryAction: () => void;
  onSecondaryAction?: () => void;
}

export default function InterventionModal({
  visible,
  onClose,
  type,
  title,
  message,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
}: InterventionModalProps) {
  const getModalConfig = () => {
    switch (type) {
      case 'break':
        return {
          icon: Heart,
          colors: ['#ECFDF5', '#D1FAE5'],
          accentColor: '#10B981',
        };
      case 'mindful':
        return {
          icon: Brain,
          colors: ['#EFF6FF', '#DBEAFE'],
          accentColor: '#3B82F6',
        };
      case 'focus':
        return {
          icon: Target,
          colors: ['#F3E8FF', '#E9D5FF'],
          accentColor: '#8B5CF6',
        };
      default:
        return {
          icon: Brain,
          colors: ['#F9FAFB', '#F3F4F6'],
          accentColor: '#6B7280',
        };
    }
  };

  const config = getModalConfig();
  const Icon = config.icon;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
        <Animated.View entering={SlideInUp.duration(400).delay(100)} style={styles.modalContainer}>
          <LinearGradient colors={config.colors} style={styles.modal}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>

            {/* Icon */}
            <View style={[styles.iconContainer, { backgroundColor: config.accentColor + '20' }]}>
              <Icon size={32} color={config.accentColor} />
            </View>

            {/* Content */}
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalMessage}>{message}</Text>

            {/* Actions */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: config.accentColor }]}
                onPress={onPrimaryAction}
              >
                <Text style={styles.primaryButtonText}>{primaryAction}</Text>
              </TouchableOpacity>

              {secondaryAction && onSecondaryAction && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onSecondaryAction}
                >
                  <Text style={[styles.secondaryButtonText, { color: config.accentColor }]}>
                    {secondaryAction}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
  },
  modal: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});