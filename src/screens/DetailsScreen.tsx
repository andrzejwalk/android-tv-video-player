// src/screens/DetailsScreen.tsx
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { CatalogItem } from '../services/catalogService';

/** Inline mock for testing/fallback when no route params provided */
const MOCK_ITEM: CatalogItem = {
  id: 'mock-details',
  title: 'Sample Movie',
  description: 'A sample movie description for testing purposes.',
  thumbnail: 'https://i.imgur.com/8GVG6Zp.jpeg',
  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  duration: 600,
};

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'> & {
  /** Override item for testing */
  item?: CatalogItem;
  /** Called when Play pressed; wired to navigation in TV-05 */
  onPlay?: (item: CatalogItem) => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function DetailsScreen({ route, item: itemProp, onPlay }: DetailsScreenProps) {
  const item = itemProp ?? route?.params?.item ?? MOCK_ITEM;
  const [isPlayFocused, setIsPlayFocused] = useState(false);
  const [hasPosterError, setHasPosterError] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePlay = () => {
    if (onPlay) {
      onPlay(item);
    } else {
      // TODO [TV-17]: remove console.log in the clean up task
      console.log('Play pressed for:', item.title);
      navigation.navigate('Player', { item });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Poster */}
      {item.thumbnail && !hasPosterError ? (
        <Image
          testID={`details-poster-${item.id}`}
          source={{ uri: item.thumbnail }}
          style={styles.poster}
          resizeMode="cover"
          accessibilityLabel={`${item.title} poster`}
          onError={() => setHasPosterError(true)}
        />
      ) : (
        <View testID="details-poster-placeholder" style={styles.posterPlaceholder} />
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text testID="details-title" style={styles.title}>
          {item.title}
        </Text>

        <Text testID="details-duration" style={styles.duration}>
          {formatDuration(item.duration)}
        </Text>

        <Text testID="details-description" style={styles.description}>
          {item.description}
        </Text>

        {/* Play Button */}
        <Pressable
          testID="details-play-button"
          focusable
          accessibilityRole="button"
          accessibilityLabel={`Play ${item.title}`}
          onPress={handlePlay}
          onFocus={() => setIsPlayFocused(true)}
          onBlur={() => setIsPlayFocused(false)}
          style={[styles.playButton, isPlayFocused && styles.playButtonFocused]}
        >
          <Text style={styles.playButtonText}>▶ Play</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  content: {
    padding: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  poster: {
    width: 320,
    height: 180,
    borderRadius: 12,
    marginRight: 32,
  },
  posterPlaceholder: {
    width: 320,
    height: 180,
    borderRadius: 12,
    marginRight: 32,
    backgroundColor: '#2a2f38',
  },
  infoSection: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    color: '#f5f7fb',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  duration: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    color: '#d1d5db',
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 24,
  },
  playButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#61dafb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  playButtonFocused: {
    borderColor: '#fff',
    transform: [{ scale: 1.05 }],
  },
  playButtonText: {
    color: '#0f1115',
    fontSize: 18,
    fontWeight: '700',
  },
});
