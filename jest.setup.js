// jest.setup.js
// Runs after Jest environment is configured, before tests execute

/**
 * Mock React Navigation
 * Why: Navigation hooks require a NavigationContainer provider.
 * In unit tests, we mock these to avoid complex setup and test components in isolation.
 */
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: jest.fn(() => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
      setParams: jest.fn(),
      canGoBack: jest.fn(),
    })),
    useRoute: jest.fn(() => ({
      params: {},
    })),
    useFocusEffect: jest.fn(),
  };
});
