# Backscreen OTT (Android TV)

Android TV demo app: browse catalog, view details, play video with expo-video, friendly loading/error states, and tests.

## Setup
- Requirements: Node 18+, pnpm, Android TV emulator/device.
- Install deps: `pnpm install`
- Prebuild for TV: `pnpm prebuild:tv`
- Run Android TV: `pnpm android`
- Start Metro for dev client: `pnpm dev`

## Running tests
- Unit + integration: `pnpm test`

## Features
- Home: 3x2 grid (6 items) with thumbnail + title, focusable with D-pad.
- Details: poster, title, description, Play button.
- Player: expo-video with native controls; buffering overlay; friendly errors (404 custom, catch-all “No pasaran!”).
- Data: bundled `src/data/catalog.json` from assignment.
- Loading: spinner on catalog fetch; buffering overlay on player start.
- Error states: catalog fetch friendly message; playback friendly overlay.

## Libraries (why)
- `expo-video`: playback with native controls on Expo/TV.
- `@react-navigation/native-stack`: simple stack navigation for Home → Details → Player.
- `@testing-library/react-native`: screen-level tests (unit + integration).

## Known limitations / TODOs
- Integration test covers Home → Details → Player; no APK/recording included.
- TV-18 (nice-to-have): explicit pause on unmount/back; current hook cleanup is sufficient.
- If any stream URL returns 403/404, user sees friendly copy; URLs are from the provided mock and may occasionally fail.

## How to run on Android TV emulator
1) Create Android TV AVD (Android TV image).  
2) `pnpm install`  
3) `pnpm prebuild:tv`  
4) `pnpm android` (installs dev client on emulator)  
5) In another terminal: `pnpm dev`  
6) Open the dev client on the TV emulator; select the project from Metro.

## Tests included
- HomeScreen: loading, error, empty, renders 6 tiles.
- DetailsScreen: poster/placeholder, description, play handler, mock fallback.
- PlayerScreen: buffering overlay, 404 and catch-all friendly errors.
- Integration: Home → Details → Player flow via navigation.
