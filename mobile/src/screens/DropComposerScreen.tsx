import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, radii } from '../theme';
import { searchVerses, createDrop } from '../lib/api';
import { useAppStore } from '../store/appStore';
import type { VerseResult } from '../types';

export default function DropComposerScreen() {
  const navigation = useNavigation();
  const userLocation = useAppStore((s) => s.userLocation);
  const showToast = useAppStore((s) => s.showToast);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VerseResult[]>([]);
  const [selected, setSelected] = useState<VerseResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const verses = await searchVerses(query);
      setResults(verses);
    } catch {
      setResults([]);
    }
    setIsSearching(false);
  }, [query]);

  const handleDrop = async () => {
    if (!selected || !userLocation) return;
    setIsDropping(true);
    try {
      await createDrop({
        verse_reference: selected.reference,
        verse_text: selected.text,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      });
      showToast(`Dropped ${selected.reference}`);
      navigation.goBack();
    } catch {
      showToast('Failed to drop verse');
    }
    setIsDropping(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drop a Verse</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search verses... (love, faith, peace)"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.searchBtn, isSearching && styles.searchBtnDisabled]}
          onPress={handleSearch}
          disabled={isSearching}
          activeOpacity={0.8}
        >
          {isSearching ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.searchBtnText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView
        style={styles.resultsScroll}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {results.length === 0 && !isSearching && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>{'\u{1F50D}'}</Text>
            <Text style={styles.emptyText}>
              Search for a verse to drop at your current location
            </Text>
          </View>
        )}

        {results.map((v) => {
          const isSelected = selected?.reference === v.reference;
          return (
            <TouchableOpacity
              key={v.reference}
              style={[styles.resultCard, isSelected && styles.resultCardSelected]}
              onPress={() => setSelected(v)}
              activeOpacity={0.7}
            >
              <Text style={styles.resultRef}>{v.reference}</Text>
              <Text style={styles.resultText} numberOfLines={3}>
                {v.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected preview */}
      {selected && (
        <View style={styles.selectedPreview}>
          <View style={styles.selectedCard}>
            <Text style={styles.selectedRef}>{selected.reference}</Text>
            <Text style={styles.selectedText} numberOfLines={2}>
              {selected.text}
            </Text>
          </View>
        </View>
      )}

      {/* Drop button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.dropBtn, !selected && styles.dropBtnDisabled]}
          onPress={() => setShowConfirm(true)}
          disabled={!selected}
          activeOpacity={0.8}
        >
          <Text style={[styles.dropBtnText, !selected && styles.dropBtnTextDisabled]}>
            Drop Here
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation modal */}
      <Modal
        visible={showConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <TouchableOpacity
          style={styles.confirmOverlay}
          activeOpacity={1}
          onPress={() => setShowConfirm(false)}
        >
          <TouchableOpacity
            style={styles.confirmSheet}
            activeOpacity={1}
            onPress={() => {}}
          >
            <Text style={styles.confirmTitle}>Drop this verse?</Text>

            <View style={styles.confirmVerseCard}>
              <Text style={styles.confirmVerseRef}>{selected?.reference}</Text>
              <Text style={styles.confirmVerseText}>{selected?.text}</Text>
            </View>

            <Text style={styles.confirmLocationText}>
              {'\u{1F4CD}'} At your current location
            </Text>

            <TouchableOpacity
              style={styles.confirmDropBtn}
              onPress={handleDrop}
              disabled={isDropping}
              activeOpacity={0.8}
            >
              {isDropping ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.confirmDropBtnText}>Drop It</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmCancelBtn}
              onPress={() => setShowConfirm(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },

  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBtnDisabled: {
    opacity: 0.7,
  },
  searchBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },

  resultsScroll: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },

  resultCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCardSelected: {
    borderColor: colors.gold,
    backgroundColor: colors.goldDim,
  },
  resultRef: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  resultText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
    opacity: 0.85,
  },

  selectedPreview: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  selectedCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  selectedRef: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  selectedText: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
  },

  bottomBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dropBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dropBtnDisabled: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  dropBtnTextDisabled: {
    color: colors.textMuted,
  },

  // Confirmation modal
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
  },
  confirmSheet: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  confirmVerseCard: {
    backgroundColor: colors.card,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmVerseRef: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  confirmVerseText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  confirmLocationText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  confirmDropBtn: {
    backgroundColor: colors.gold,
    borderRadius: radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  confirmDropBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  confirmCancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
