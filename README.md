# Video Player - Android TV

Android TV demo app: browse catalog, view details, play video with expo-video, friendly loading/error states, and tests.


<video src="https://github.com/user-attachments/assets/7eaae4e1-9043-4299-bb63-8b986836207e" controls></video>



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
- Expo is good for a small project with limited scope but if you need robust protected playback (DRM), we need custom native module probably
- if you need TV-specific native hooks, advanced remote events, you probably need config plugins or bare workflow;
- Memory is not an issue with a small app like this but in production optimizations can make or break the app

## How to run on Android TV emulator
1) Create Android TV AVD (Android TV image).  
2) `pnpm install`  
3) `pnpm prebuild:tv`  
4) `pnpm android` (installs dev client on emulator)  
5) In another terminal: `pnpm dev`  

## Tests included
- HomeScreen: loading, error, empty, renders 6 tiles.
- DetailsScreen: poster/placeholder, description, play handler, mock fallback.
- PlayerScreen: buffering overlay, 404 and catch-all friendly errors.
- Integration: Home → Details → Player flow via navigation.
