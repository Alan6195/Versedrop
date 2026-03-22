import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors, spacing, radii } from '../theme';
import { useAppStore } from '../store/appStore';

export default function Toast() {
  const toastMessage = useAppStore((s) => s.toastMessage);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toastMessage) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      // Reset to hidden position
      translateY.setValue(-100);
      opacity.setValue(0);
    }
  }, [toastMessage, translateY, opacity]);

  if (!toastMessage) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <View style={styles.accent} />
        <Text style={styles.checkmark}>{'\u2713'}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {toastMessage}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    maxWidth: 400,
    width: '100%',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.gold,
    borderTopLeftRadius: radii.md,
    borderBottomLeftRadius: radii.md,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gold,
    marginRight: spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
