import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors, spacing, radii } from '../theme';
import { fetchUserProfile } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { UserStats } from '../types';

interface Badge {
  icon: string;
  label: string;
  desc: string;
  unlocked: boolean;
}

function getBadges(stats: UserStats): Badge[] {
  return [
    { icon: '\u{1F331}', label: 'First Steps', desc: 'Pick up your first verse', unlocked: stats.total_pickups >= 1 },
    { icon: '\u{270D}\u{FE0F}', label: 'First Drop', desc: 'Drop your first verse', unlocked: stats.total_drops >= 1 },
    { icon: '\u{1F4DA}', label: 'Collector', desc: 'Pick up 5 verses', unlocked: stats.total_pickups >= 5 },
    { icon: '\u{1F525}', label: 'On Fire', desc: '3 day streak', unlocked: stats.streak_days >= 3 },
    { icon: '\u{1F30D}', label: 'Spreader', desc: 'Drop 5 verses', unlocked: stats.total_drops >= 5 },
    { icon: '\u{2B50}', label: 'Devoted', desc: '7 day streak', unlocked: stats.streak_days >= 7 },
  ];
}

export default function ProfileScreen() {
  const userToken = useAuthStore((s) => s.userToken);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  const badges = getBadges(stats);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar / Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>VD</Text>
        </View>
        <Text style={styles.name}>Anonymous Explorer</Text>
        <Text style={styles.token}>
          {userToken ? `${userToken.slice(0, 8)}...` : ''}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total_drops}</Text>
          <Text style={styles.statLabel}>Drops</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total_pickups}</Text>
          <Text style={styles.statLabel}>Pickups</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.streak_days}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Achievements ({unlockedCount}/{badges.length})
        </Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge) => (
            <View
              key={badge.label}
              style={[styles.badgeCard, !badge.unlocked && styles.badgeCardLocked]}
            >
              <Text style={[styles.badgeIcon, !badge.unlocked && styles.badgeIconLocked]}>
                {badge.icon}
              </Text>
              <View style={styles.badgeInfo}>
                <Text style={[styles.badgeLabel, !badge.unlocked && styles.badgeLabelLocked]}>
                  {badge.label}
                </Text>
                <Text style={styles.badgeDesc}>{badge.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* VerseDrop Plus */}
      <View style={styles.plusCard}>
        <Text style={styles.plusTitle}>VerseDrop Plus</Text>
        <Text style={styles.plusDesc}>
          Add personal messages to your drops and unlock exclusive features. Coming soon!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: 100,
  },

  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  token: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Achievements
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  badgeGrid: {
    gap: spacing.sm,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeCardLocked: {
    opacity: 0.45,
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  badgeLabelLocked: {
    color: colors.textSecondary,
  },
  badgeDesc: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Plus card
  plusCard: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  plusTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  plusDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
  },
});
