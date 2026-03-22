import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing, radii } from '../theme';
import { fetchMyPickups } from '../lib/api';
import type { Drop } from '../types';

interface PickupDrop extends Drop {
  picked_up_at?: string;
}

export default function LibraryScreen() {
  const [drops, setDrops] = useState<PickupDrop[]>([]);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchMyPickups();
      setDrops(data.drops || []);
      setStreak(data.streak || 0);
      setTotal(data.total || 0);
    } catch {}
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const renderItem = ({ item }: { item: PickupDrop }) => (
    <View style={styles.card}>
      <Text style={styles.cardRef}>{item.verse_reference}</Text>
      <Text style={styles.cardText} numberOfLines={4}>
        &ldquo;{item.verse_text}&rdquo;
      </Text>
      <View style={styles.cardFooter}>
        {item.picked_up_at && (
          <Text style={styles.cardDate}>
            Collected{' '}
            {new Date(item.picked_up_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        )}
        <View style={styles.pickupBadge}>
          <Text style={styles.pickupBadgeText}>
            {'\u{1F64F}'} {item.pickup_count} {item.pickup_count === 1 ? 'pickup' : 'pickups'}
          </Text>
        </View>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View style={styles.headerSection}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.statsRow}>
        {streak > 0 && (
          <View style={styles.statChip}>
            <Text style={styles.statIcon}>{'\u{1F525}'}</Text>
            <Text style={styles.statChipText}>{streak} day streak</Text>
          </View>
        )}
        <View style={styles.statChip}>
          <Text style={styles.statIcon}>{'\u{1F4D6}'}</Text>
          <Text style={styles.statChipText}>
            {total} {total === 1 ? 'verse' : 'verses'}
          </Text>
        </View>
      </View>
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>{'\u{1F4CD}'}</Text>
      <Text style={styles.emptyTitle}>No verses collected yet</Text>
      <Text style={styles.emptyDesc}>
        Head to the map and walk near glowing verse drops to pick them up!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={drops}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.gold}
            colors={[colors.gold]}
          />
        }
      />
    </View>
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
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: 100,
  },

  headerSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statChip: {
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
  statIcon: {
    fontSize: 14,
  },
  statChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardRef: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  pickupBadge: {
    backgroundColor: colors.goldDim,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  pickupBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gold,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
