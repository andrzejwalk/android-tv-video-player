// src/screens/__tests__/PlayerScreen.test.tsx
import { act, render } from '@testing-library/react-native';
import React from 'react';
import type { CatalogItem } from '../../services/catalogService';

const mockAddListener = jest.fn();
const mockPlayer = {
  addListener: mockAddListener,
  play: jest.fn(),
};

jest.mock('expo-video', () => {
  const ReactActual = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const MockVideoView = ReactActual.forwardRef((props: object, ref) => (
    <View ref={ref} {...props} />
  ));
  MockVideoView.displayName = 'MockVideoView';
  return {
    VideoView: MockVideoView,
    useVideoPlayer: jest.fn(() => mockPlayer),
  };
});

import PlayerScreen from '../PlayerScreen';

const mockItem: CatalogItem = {
  id: 'bbb-hls',
  title: 'Big Buck Bunny (HLS)',
  description: 'Short animated film used as a demo stream.',
  thumbnail: 'https://i.imgur.com/8GVG6Zp.jpeg',
  streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  duration: 596,
};

describe('PlayerScreen', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders video player with provided stream URL', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );

    expect(screen.getByTestId('player-video')).toBeTruthy();
    expect(mockAddListener).toHaveBeenCalled();
  });

  it('shows buffering indicator when buffering', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );
    const statusHandler = mockAddListener.mock.calls.find(
      ([event]) => event === 'statusChange'
    )?.[1];

    act(() => {
      statusHandler?.({ status: 'loading' });
    });
    expect(screen.getByText(/Buffering/i)).toBeTruthy();

    act(() => {
      statusHandler?.({ status: 'readyToPlay' });
    });
    expect(screen.queryByText(/Buffering/i)).toBeNull();
  });

  it('shows error message when playback fails', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );
    const statusHandler = mockAddListener.mock.calls.find(
      ([event]) => event === 'statusChange'
    )?.[1];

    act(() => {
      statusHandler?.({ status: 'error', error: { message: 'network' } });
    });

    expect(screen.getByText(/No pasaran!/i)).toBeTruthy();
  });

  it('shows friendly message for 404 errors', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );
    const statusHandler = mockAddListener.mock.calls.find(
      ([event]) => event === 'statusChange'
    )?.[1];

    act(() => {
      statusHandler?.({ status: 'error', error: { message: '404 Not Found' } });
    });

    expect(screen.getByText(/Missing in action/i)).toBeTruthy();
  });

  it('shows catch-all friendly message for other errors', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );
    const statusHandler = mockAddListener.mock.calls.find(
      ([event]) => event === 'statusChange'
    )?.[1];

    act(() => {
      statusHandler?.({ status: 'error', error: { message: '500 Internal Server Error' } });
    });

    expect(screen.getByText(/No pasaran/i)).toBeTruthy();
  });

  it('uses catch-all message for 403 errors', () => {
    const screen = render(
      <PlayerScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );
    const statusHandler = mockAddListener.mock.calls.find(
      ([event]) => event === 'statusChange'
    )?.[1];

    act(() => {
      statusHandler?.({ status: 'error', error: { message: '403 Forbidden' } });
    });

    expect(screen.getByText(/No pasaran/i)).toBeTruthy();
  });
});
