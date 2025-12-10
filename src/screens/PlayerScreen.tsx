import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import type { CatalogItem } from '../services/catalogService';

type PlayerScreenProps = NativeStackScreenProps<RootStackParamList, 'Player'> & {
  item?: CatalogItem; // testing override
};

export default function PlayerScreen({ route, item: itemProp }: PlayerScreenProps) {
  const item = itemProp ?? route.params.item;
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const player = useVideoPlayer(item.streamUrl, playerInstance => {
    playerInstance.play();
  });

  useEffect(() => {
    // TODO [TV-18]: explicitly pause on unmount/back; hook cleanup is sufficient for now
    const statusSubscription = player?.addListener?.(
      'statusChange',
      ({ status, error }: { status: string; error?: { message?: string } }) => {
        setIsBuffering(status === 'loading');
        if (status === 'error' && error) {
          setHasError(true);
          const rawMessage = error.message ?? 'Playback failed. Please try again.';
          const friendlyMessage = /404/.test(rawMessage)
            ? 'Missing in action (HTTP 404) — this stream took a detour. Try another title.'
            : 'No pasaran! Watch something else.';
          setErrorMessage(friendlyMessage);
        }
      }
    );

    return () => {
      statusSubscription?.remove?.();
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.playerWrapper}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {errorMessage ??
                'Playback hit a snag. Please check your connection or try again later.'}
            </Text>
          </View>
        ) : (
          <>
            <VideoView
              testID="player-video"
              player={player}
              style={styles.video}
              nativeControls
              contentFit="contain"
            />
            {isBuffering && (
              <View style={styles.bufferingOverlay}>
                <ActivityIndicator size="large" color="#61dafb" />
                <Text style={styles.bufferingText}>Buffering...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 16,
    paddingLeft: 4,
  },
  title: {
    color: '#f5f7fb',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    color: '#d1d5db',
    fontSize: 16,
  },
  playerWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingText: {
    marginTop: 12,
    color: '#f5f7fb',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#f87171',
    fontSize: 18,
    textAlign: 'center',
  },
});
