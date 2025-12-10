// src/screens/__tests__/DetailsScreen.test.tsx
import { fireEvent, render } from '@testing-library/react-native';
import DetailsScreen from '../DetailsScreen';
import type { CatalogItem } from '../../services/catalogService';

const mockItem: CatalogItem = {
  id: 'test-movie',
  title: 'Test Movie Title',
  description: 'A great movie for testing purposes.',
  thumbnail: 'https://example.com/poster.jpg',
  streamUrl: 'https://example.com/stream.m3u8',
  duration: 3661, // 61 minutes, 1 second
};

describe('DetailsScreen', () => {
  it('renders title, description, and duration from provided item', () => {
    const screen = render(
      <DetailsScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );

    expect(screen.getByTestId('details-title')).toHaveTextContent('Test Movie Title');
    expect(screen.getByTestId('details-description')).toHaveTextContent(
      'A great movie for testing purposes.'
    );
    expect(screen.getByTestId('details-duration')).toHaveTextContent('61:01');
  });

  it('renders poster image when thumbnail is provided', () => {
    const screen = render(
      <DetailsScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );

    expect(screen.getByTestId('details-poster-test-movie')).toBeTruthy();
  });

  it('falls back to placeholder when poster fails to load', () => {
    const screen = render(
      <DetailsScreen item={mockItem} route={undefined as never} navigation={undefined as never} />
    );

    fireEvent(screen.getByTestId('details-poster-test-movie'), 'onError');

    expect(screen.getByTestId('details-poster-placeholder')).toBeTruthy();
  });

  it('renders placeholder when thumbnail is missing', () => {
    const itemWithoutThumbnail = { ...mockItem, thumbnail: '' };
    const screen = render(
      <DetailsScreen
        item={itemWithoutThumbnail}
        route={undefined as never}
        navigation={undefined as never}
      />
    );

    expect(screen.getByTestId('details-poster-placeholder')).toBeTruthy();
  });

  it('calls onPlay callback when Play button is pressed', () => {
    const onPlayMock = jest.fn();
    const screen = render(
      <DetailsScreen
        item={mockItem}
        onPlay={onPlayMock}
        route={undefined as never}
        navigation={undefined as never}
      />
    );

    fireEvent.press(screen.getByTestId('details-play-button'));

    expect(onPlayMock).toHaveBeenCalledTimes(1);
    expect(onPlayMock).toHaveBeenCalledWith(mockItem);
  });

  it('uses inline mock item when no item prop or route params provided', () => {
    const screen = render(
      <DetailsScreen route={undefined as never} navigation={undefined as never} />
    );

    // The inline mock has title "Sample Movie"
    expect(screen.getByTestId('details-title')).toHaveTextContent('Sample Movie');
  });
});
