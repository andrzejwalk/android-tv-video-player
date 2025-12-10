# Backlog

## Must Have (Core Features)

### Foundation
(All foundation tasks completed)

### Core Features

### Testing
- [TV-08] Write integration test (Home → Details → Player flow + error handling)

### Documentation
- [TV-09] Create README (setup, libraries, testing, limitations, TODOs)

## Nice to Have (If Time Permits)
- [TV-10] Optimize data fetching with retry mechanism
- [TV-11] Add video buffering indicators
- [TV-12] Improve error recovery UX
- [TV-13] Add focus state animations
- [TV-14] Basic accessibility (screen reader labels, semantic roles) - ~30-45 min
- [TV-15] Add initial focus to the first catalog item
- [TV-16] Handle Android TV back button on Home (prevent accidental exit)
- [TV-17] Cleanup pass (remove temp logs, inline mocks, artificial delays where appropriate)
- [TV-18] Explicitly pause playback on unmount/back (current hook cleanup is sufficient)

## Done
- [TV-01] Set up TypeScript configuration (strict mode, resolveJsonModule)
- [TV-02] Set up React Navigation stack navigator. Set up Jest and React Testing Library.
- [TV-03] Create HomeScreen with catalog grid (6 items, TV focus), fetch catalog data, loading + error states, inline mock fallback, unit test
- [TV-04] Create DetailsScreen (poster, title, description, Play button, inline mock data) + unit test
- [TV-05] Create PlayerScreen with video playback (expo-video integration) + unit test
- [TV-06] Audit loading states (catalog fetching, video buffering)
- [TV-07] Audit error handling (network errors, playback errors)




# Task details

## [TV-03] HomeScreen
- Goal: Build Android TV-friendly HomeScreen showing a 6-item catalog grid (thumbnail + title) with D-pad focusable tiles using React Native, fetching catalog data with loading and error states (inline mock fallback allowed).
- Plan:
  - Layout: FlatList grid (3 columns) with D-pad focusable tiles.
  - Focused tile: highlight with border + light scale.
  - Data: fetch catalog; allow `items` override; optional `onSelect` callback for future navigation; inline mock fallback.
  - Loading: show spinner while fetching.
  - Error: show friendly message on fetch failure.
- Edge cases:
  - Empty state: show friendly message.
  - Long titles: truncate.
  - Missing thumbnail: show placeholder.
- Tests:
  - Empty state -> message shown.
  - All 6 tiles rendered.
  - Loading state -> spinner shown.
  - Error state -> friendly error message shown.

## [TV-04] DetailsScreen
- Goal: Build DetailsScreen showing poster, title, description, Play button with TV-friendly focus; navigate from Home.
- Plan:
  - Types: Created shared `RootStackParamList` in `navigation/types.ts`.
  - Navigation: Updated `AppNavigator` with Details route; Home navigates to Details on tile press.
  - Layout: Horizontal layout with poster (left) and info section (right).
  - Play button: focusable, styled, no-op for now (TV-05 will wire to Player).
  - Inline mock: Fallback item if no route params provided.
- Edge cases:
  - Missing thumbnail: show placeholder.
  - Duration formatting: MM:SS format.
- Tests:
  - Renders title, description, duration from provided item.
  - Renders poster when thumbnail provided.
  - Renders placeholder when thumbnail missing.
  - Calls onPlay callback when Play pressed.
  - Uses inline mock when no item provided.

## [TV-05] PlayerScreen
- Goal: Play video streamUrl with native controls and TV-friendly error states.
- Plan:
  - Added Player route; uses expo-video with native controls.
  - Buffering indicator and error overlay; friendly messages for 404 and catch-all.
- Edge cases:
  - Buffering overlay shows when status=loading.
  - Friendly messaging for missing streams; generic block for other errors.
- Tests:
  - Renders player component.
  - Buffering state toggles via status events.
  - Error states render friendly messages (404 and catch-all).

## [TV-06] Loading states audit
- Goal: Ensure loading/buffering indicators are present for catalog fetch and playback.
- Plan:
  - Home: spinner while catalog loads (existing).
  - Player: buffering overlay driven by status events; initial buffering defaults to visible until ready.
- Tests:
  - Buffering overlay initially visible; hides on ready; reappears on loading.
  - Existing catalog loading test coverage retained via mocks.

## [TV-07] Error handling audit
- Goal: Verify friendly errors for network/catalog and playback failures.
- Plan:
  - Home: friendly message on catalog fetch failure (existing).
  - Player: friendly error overlay; custom 404 text; catch-all “No pasaran!” for other errors.
- Tests:
  - Home shows error on fetch rejection.
  - Player shows friendly messages for 404 and catch-all error paths.