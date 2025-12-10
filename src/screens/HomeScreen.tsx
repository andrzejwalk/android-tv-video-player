import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchCatalog, type CatalogItem } from '../services/catalogService';
import type { RootStackParamList } from '../navigation/types';

type CatalogCardProps = {
  item: Pick<CatalogItem, 'id' | 'title' | 'thumbnail'>;
  isFocused: boolean;
  onPress: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

/**
 * CatalogCard displays a single video item in the catalog.
 * Co-located with HomeScreen because tightly coupled; extract to separate file if reused elsewhere.
 * Wrap in React.memo if list grows. Currently, memoization would be premature.
 */
function CatalogCard({ item, isFocused, onPress, onFocus, onBlur }: CatalogCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  return (
    <Pressable
      testID={`catalog-tile-${item.id}`}
      focusable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles.card, isFocused && styles.cardFocused]}
    >
      {item.thumbnail && !hasImageError ? (
        <Image
          testID={`catalog-thumbnail-${item.id}`}
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <View
          testID={`catalog-thumbnail-placeholder-${item.id}`}
          style={styles.thumbnailPlaceholder}
          accessibilityLabel={`${item.title} thumbnail unavailable`}
        />
      )}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {item.title}
      </Text>
    </Pressable>
  );
}

type HomeScreenProps = {
  items?: CatalogItem[]; // For testing/override
  onSelect?: (item: CatalogItem) => void; // Additive side-effects (analytics/tests); navigation still runs
};

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen({ items: itemsProp, onSelect }: HomeScreenProps) {
  const navigation = useNavigation<HomeNavigationProp>();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);

  useEffect(() => {
    // If items provided via prop, use them (for testing/override)
    if (itemsProp) {
      setItems(itemsProp);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Otherwise, fetch from service
    async function loadCatalog() {
      try {
        setError(null);
        const catalogItems = await fetchCatalog();
        setItems(catalogItems);
      } catch (err) {
        // later track error with Bugsnag or Sentry
        console.error('Failed to load catalog:', err);
        setError('Catalog took a coffee break. Check your Wi‑Fi and try again.');
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadCatalog();
  }, [itemsProp]);

  /** minor optimization - clear focusedItemId if item is not in list, e.g. catalog modified during runtime */
  const isValidFocus = focusedItemId !== null && items.some(({ id }) => id === focusedItemId);
  const handleFocus = (id: string) => setFocusedItemId(id);
  const handleBlur = (id: string) => setFocusedItemId(current => (current === id ? null : current));
  const handleNavigateToDetails = (selected: CatalogItem) => {
    onSelect?.(selected);
    navigation.navigate('Details', { item: selected });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#61dafb" />
        <Text style={styles.loadingText}>Loading catalog...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        numColumns={3}
        keyExtractor={item => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No videos available</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CatalogCard
            item={item}
            isFocused={isValidFocus && focusedItemId === item.id}
            onPress={() => handleNavigateToDetails(item)}
            onFocus={() => handleFocus(item.id)}
            onBlur={() => handleBlur(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1115',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: 220,
    height: 260,
    backgroundColor: '#1a1d23',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardFocused: {
    borderColor: '#61dafb',
    transform: [{ scale: 1.03 }],
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#2a2f38',
  },
  title: {
    color: '#f5f7fb',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1115',
  },
  emptyText: {
    color: '#f5f7fb',
    fontSize: 18,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1115',
  },
  loadingText: {
    color: '#f5f7fb',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f1115',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#f5f7fb',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
