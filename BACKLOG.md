# Backlog

## Must Have (Core Features)

### Foundation
(All foundation tasks completed)

### Core Features
- [TV-04] Create DetailsScreen (poster, title, description, Play button, inline mock data) + unit test
- [TV-05] Create PlayerScreen with video playback (react-native-video integration) + unit test
- [TV-06] Audit loading states (catalog fetching, video buffering)
- [TV-07] Audit error handling (network errors, playback errors)

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

## Done
- [TV-01] Set up TypeScript configuration (strict mode, resolveJsonModule)
- [TV-02] Set up React Navigation stack navigator. Set up Jest and React Testing Library.
- [TV-03] Create HomeScreen with catalog grid (6 items, TV focus), fetch catalog data, loading + error states, inline mock fallback, unit test




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