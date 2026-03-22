import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { useAppStore } from '../store/appStore';
import { useDrops } from '../hooks/useDrops';
import { colors, spacing, radii } from '../theme';
import type { Drop } from '../types';
import DropDetailSheet from '../components/DropDetailSheet';
import { useNavigation } from '@react-navigation/native';

const PICKUP_RANGE = 50;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const VOTD_VERSES = [
  { ref: 'Psalm 118:24', text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.' },
  { ref: 'Lamentations 3:22-23', text: "It is of the LORD's mercies that we are not consumed. They are new every morning: great is thy faithfulness." },
  { ref: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.' },
  { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
  { ref: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.' },
  { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God.' },
  { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.' },
];

function getVotd() {
  const day = Math.floor(Date.now() / 86400000);
  return VOTD_VERSES[day % VOTD_VERSES.length];
}

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const userLocation = useAppStore((s) => s.userLocation);
  const nearbyDrops = useAppStore((s) => s.nearbyDrops);
  const selectedDrop = useAppStore((s) => s.selectedDrop);
  const setSelectedDrop = useAppStore((s) => s.setSelectedDrop);
  const [showVotd, setShowVotd] = useState(true);
  const [centeredOnce, setCenteredOnce] = useState(false);
  const navigation = useNavigation<any>();
  const { refresh } = useDrops();
  const votd = getVotd();

  // Center map on first location fix
  useEffect(() => {
    if (userLocation && mapRef.current && !centeredOnce) {
      mapRef.current.animateToRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
      setCenteredOnce(true);
    }
  }, [userLocation, centeredOnce]);

  const handleRecenter = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  }, [userLocation]);

  const handleOrbPress = useCallback((drop: Drop) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDrop(drop);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: drop.latitude,
        longitude: drop.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }, 400);
    }
  }, [setSelectedDrop]);

  const inRangeCount = nearbyDrops.filter(
    (d) => (d.distance_meters ?? Infinity) <= PICKUP_RANGE && !d.is_picked_up
  ).length;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        initialRegion={{
          latitude: 39.7392,
          longitude: -104.9903,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <>
            <Circle
              center={{ latitude: userLocation.lat, longitude: userLocation.lng }}
              radius={200}
              fillColor="rgba(212, 162, 69, 0.04)"
              strokeColor="rgba(212, 162, 69, 0.15)"
              strokeWidth={1}
            />
            <Marker
              coordinate={{ latitude: userLocation.lat, longitude: userLocation.lng }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerOuter} />
                <View style={styles.userMarkerInner} />
              </View>
            </Marker>
          </>
        )}

        {/* Drop orbs */}
        {nearbyDrops.map((drop) => {
          const isPickedUp = drop.is_picked_up;
          const isInRange = (drop.distance_meters ?? Infinity) <= PICKUP_RANGE;
          return (
            <Marker
              key={drop.id}
              coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => handleOrbPress(drop)}
              tracksViewChanges={false}
            >
              <View style={[
                styles.orbContainer,
                isPickedUp && styles.orbPickedUp,
                isInRange && !isPickedUp && styles.orbInRange,
              ]}>
                <View style={[
                  styles.orb,
                  isPickedUp ? styles.orbGray : styles.orbGold,
                  isInRange && !isPickedUp && styles.orbGlow,
                ]} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Header branding */}
      <View style={styles.header} pointerEvents="none">
        <Text style={styles.brand}>VERSEDROP</Text>
      </View>

      {/* Verse of the Day */}
      {showVotd && (
        <View style={styles.votdCard}>
          <TouchableOpacity style={styles.votdClose} onPress={() => setShowVotd(false)}>
            <Text style={styles.votdCloseText}>x</Text>
          </TouchableOpacity>
          <Text style={styles.votdLabel}>VERSE OF THE DAY</Text>
          <Text style={styles.votdText}>&ldquo;{votd.text}&rdquo;</Text>
          <Text style={styles.votdRef}>&mdash; {votd.ref}</Text>
        </View>
      )}

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.controlBtn} onPress={handleRecenter}>
          <Text style={styles.controlIcon}>+</Text>
        </TouchableOpacity>

        {nearbyDrops.length > 0 && (
          <View style={styles.nearbyBadge}>
            <View style={styles.nearbyDot} />
            <Text style={styles.nearbyText}>
              {nearbyDrops.filter(d => !d.is_picked_up).length} nearby
            </Text>
            {inRangeCount > 0 && (
              <Text style={styles.nearbyInRange}> · {inRangeCount} in range</Text>
            )}
          </View>
        )}
      </View>

      {/* FAB - Drop a Verse */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('DropComposer')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      {selectedDrop && (
        <DropDetailSheet
          drop={selectedDrop}
          onClose={() => setSelectedDrop(null)}
          onPickedUp={refresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  map: { flex: 1 },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 54, paddingBottom: 12,
    alignItems: 'center',
  },
  brand: {
    fontSize: 13, fontWeight: '700', letterSpacing: 3,
    color: colors.gold, opacity: 0.7,
  },

  votdCard: {
    position: 'absolute', top: 90, left: 16, right: 16,
    maxWidth: 360,
    backgroundColor: colors.card, borderRadius: radii.lg,
    padding: 14, paddingRight: 36,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
    elevation: 8,
  },
  votdClose: {
    position: 'absolute', top: 8, right: 8,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  votdCloseText: { color: colors.textSecondary, fontSize: 12 },
  votdLabel: {
    fontSize: 10, fontWeight: '700', letterSpacing: 1.5,
    color: colors.gold, marginBottom: 6,
  },
  votdText: { fontSize: 13, lineHeight: 19, color: colors.text, fontStyle: 'italic', marginBottom: 4 },
  votdRef: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  bottomControls: {
    position: 'absolute', bottom: 100, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  controlBtn: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8,
    elevation: 4,
  },
  controlIcon: { color: colors.textSecondary, fontSize: 18, fontWeight: '300' },

  nearbyBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.card, borderRadius: radii.full,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  nearbyDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold },
  nearbyText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  nearbyInRange: { fontSize: 12, fontWeight: '600', color: colors.gold },

  fab: {
    position: 'absolute', bottom: 100, right: 16,
    width: 52, height: 52, borderRadius: radii.lg,
    backgroundColor: colors.gold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { color: colors.white, fontSize: 26, fontWeight: '300' },

  userMarker: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  userMarkerOuter: {
    position: 'absolute', width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(212, 162, 69, 0.15)',
  },
  userMarkerInner: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: colors.gold, borderWidth: 3, borderColor: colors.bg,
  },

  orbContainer: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  orb: { width: 20, height: 20, borderRadius: 10 },
  orbGold: {
    backgroundColor: colors.gold,
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8,
    elevation: 4,
  },
  orbGray: { backgroundColor: '#3F3F46', opacity: 0.4 },
  orbGlow: {
    shadowColor: colors.gold, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 16,
    elevation: 8,
  },
  orbPickedUp: { opacity: 0.5 },
  orbInRange: {},
});

// Google Maps dark style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6a6a7a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a2a3a' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1a1a28' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#5a5a6a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e1a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e1e2e' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#5a5a6a' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2a1a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#1e1e2e' }] },
];
