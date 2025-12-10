// src/screens/__tests__/App.integration.test.tsx
import React, { useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import DetailsScreen from '../DetailsScreen';
import PlayerScreen from '../PlayerScreen';
import catalogData from '../../data/catalog.json';
import type { CatalogItem } from '../../services/catalogService';

jest.mock('expo-video', () => {
  const ReactActual = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const MockVideoView = ReactActual.forwardRef((props: object, ref: React.Ref<typeof View>) => (
    <View ref={ref} {...props} />
  ));
  MockVideoView.displayName = 'MockVideoView';
  return {
    VideoView: MockVideoView,
    useVideoPlayer: jest.fn(() => ({
      addListener: jest.fn(),
      play: jest.fn(),
    })),
  };
});

const defaultItems = (catalogData as { items: CatalogItem[] }).items;

describe('Integration: Home → Details → Player', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates from Home to Details to Player on Play press', async () => {
    function Harness() {
      const [stage, setStage] = useState<'home' | 'details' | 'player'>('home');
      const [selected, setSelected] = useState<CatalogItem | null>(null);

      if (stage === 'home') {
        return (
          <HomeScreen
            items={defaultItems}
            onSelect={item => {
              setSelected(item);
              setStage('details');
            }}
          />
        );
      }

      if (stage === 'details' && selected) {
        return (
          <DetailsScreen
            item={selected}
            onPlay={item => {
              setSelected(item);
              setStage('player');
            }}
            route={undefined as never}
            navigation={undefined as never}
          />
        );
      }

      return (
        <PlayerScreen
          item={selected ?? defaultItems[0]}
          route={
            {
              key: 'Player',
              name: 'Player',
              params: { item: selected ?? defaultItems[0] },
            } as never
          }
          navigation={undefined as never}
        />
      );
    }

    const screen = render(<Harness />);

    await waitFor(() => expect(screen.getByTestId('catalog-tile-bbb-hls')).toBeTruthy());

    fireEvent.press(screen.getByTestId('catalog-tile-bbb-hls'));

    await waitFor(() => expect(screen.getByTestId('details-play-button')).toBeTruthy());

    fireEvent.press(screen.getByTestId('details-play-button'));

    await waitFor(() => expect(screen.getByTestId('player-video')).toBeTruthy());
  });
});
