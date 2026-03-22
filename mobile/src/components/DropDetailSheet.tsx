import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radii } from '../theme';
import { pickupDrop, reactToDrop } from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { Drop } from '../types';

const PICKUP_RANGE = 50;

interface DropDetailSheetProps {
  drop: Drop;
  onClose: () => void;
  onPickedUp: () => void;
}

export default function DropDetailSheet({ drop, onClose, onPickedUp }: DropDetailSheetProps) {
  const updateDrop = useAppStore((s) => s.updateDrop);
  const showToast = useAppStore((s) => s.showToast);
  const [isPickingUp, setIsPickingUp] = useState(false);

  const isInRange = (drop.distance_meters ?? Infinity) <= PICKUP_RANGE;
  const isPickedUp = !!drop.is_picked_up;

  const distanceText =
    drop.distance_meters != null
      ? drop.distance_meters < 1000
        ? `${Math.round(drop.distance_meters)}m away`
        : `${(drop.distance_meters / 1000).toFixed(1)}km away`
      : '';

  const handlePickup = async () => {
    setIsPickingUp(true);
    try {
      await pickupDrop(drop.id);
      updateDrop(drop.id, {
        is_picked_up: true,
        pickup_count: drop.pickup_count + 1,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(`Collected ${drop.verse_reference}`);
      onPickedUp();
    } catch (err: any) {
      if (err?.status === 409) {
        showToast('Already in your library');
      } else {
        showToast('Failed to pick up verse');
      }
    }
    setIsPickingUp(false);
  };

  const handleReact = async (type: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const data = await reactToDrop(drop.id, type);
      updateDrop(drop.id, { reactions: data.reactions });
    } catch {}
  };

  const reactionButtons: { key: string; label: string; emoji: string }[] = [
    { key: 'amen', label: 'Amen', emoji: '\u{1F64F}' },
    { key: 'heart', label: 'Heart', emoji: '\u{2764}\u{FE0F}' },
    { key: 'pray', label: 'Pray', emoji: '\u{1F64C}' },
  ];

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.sheet}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* Handle bar */}
          <View style={styles.handleRow}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Verse display */}
            <View style={styles.verseCard}>
              <Text style={styles.verseRef}>{drop.verse_reference}</Text>
              <Text style={styles.verseText}>
                &ldquo;{drop.verse_text}&rdquo;
              </Text>
            </View>

            {/* Custom message */}
            {drop.custom_message ? (
              <Text style={styles.customMessage}>
                &ldquo;{drop.custom_message}&rdquo;
              </Text>
            ) : null}

            {/* Meta row */}
            <View style={styles.metaRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>
                  {isPickedUp ? '\u2713 Collected' : distanceText}
                </Text>
              </View>
              <Text style={styles.metaText}>
                {drop.pickup_count} {drop.pickup_count === 1 ? 'pickup' : 'pickups'}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Reactions */}
            <View style={styles.reactionRow}>
              {reactionButtons.map((r) => {
                const count = drop.reactions[r.key as keyof typeof drop.reactions] as number;
                const isActive = drop.reactions.user_reaction === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[styles.reactionBtn, isActive && styles.reactionBtnActive]}
                    onPress={() => handleReact(r.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                    <Text style={[styles.reactionCount, isActive && styles.reactionCountActive]}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Action button */}
            <View style={styles.actionArea}>
              {isPickedUp ? (
                <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDisabled]}>
                    In Your Library {'\u2713'}
                  </Text>
                </View>
              ) : isInRange ? (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnGold]}
                  onPress={handlePickup}
                  disabled={isPickingUp}
                  activeOpacity={0.8}
                >
                  {isPickingUp ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Text style={styles.actionBtnText}>Pick Up This Verse</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={[styles.actionBtn, styles.actionBtnDisabled]}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDisabled]}>
                    Get closer to pick up
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '80%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  verseCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  verseRef: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontStyle: 'italic',
  },
  customMessage: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.md,
    fontSize: 13,
    paddingLeft: spacing.xs,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  pill: {
    backgroundColor: colors.card,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  reactionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.card,
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionBtnActive: {
    borderColor: colors.goldBorder,
    backgroundColor: colors.goldDim,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reactionCountActive: {
    color: colors.gold,
  },

  actionArea: {
    marginBottom: spacing.xxl,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnGold: {
    backgroundColor: colors.gold,
  },
  actionBtnDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  actionBtnTextDisabled: {
    color: colors.textMuted,
  },
});
