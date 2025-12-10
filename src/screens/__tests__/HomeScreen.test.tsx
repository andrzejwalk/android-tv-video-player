import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import catalogData from '../../data/catalog.json';
import { fetchCatalog, type CatalogItem } from '../../services/catalogService';

jest.mock('../../services/catalogService');

const mockedFetchCatalog = fetchCatalog as jest.MockedFunction<typeof fetchCatalog>;
const defaultItems = (catalogData as { items: CatalogItem[] }).items;
let consoleErrorSpy: jest.SpyInstance;

beforeAll(() => {
  // Silence expected error logs from the rejection test while still asserting they happen.
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders six catalog tiles by default', async () => {
    mockedFetchCatalog.mockResolvedValue(defaultItems);
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getAllByTestId(/catalog-tile-/)).toHaveLength(6);
    });
    expect(screen.getByTestId('catalog-tile-bbb-hls')).toBeTruthy();
  });

  it('shows empty state when no items are provided', () => {
    const screen = render(<HomeScreen items={[]} />);

    expect(screen.getByText(/No videos available/i)).toBeTruthy();
  });

  it('shows an error message when catalog load fails', async () => {
    mockedFetchCatalog.mockRejectedValue(new Error('network'));
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Catalog took a coffee break/i)).toBeTruthy();
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load catalog:', expect.any(Error));
  });
});
