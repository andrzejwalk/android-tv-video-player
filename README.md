# android-tv-video-player
React Native TV video player for Android TV using Expo and the React Native TV fork.

- Uses the [React Native TV fork](https://github.com/react-native-tvos/react-native-tvos) for TV targets (Android TV and Apple TV).
- Applies the [React Native TV config plugin](https://github.com/react-native-tvos/config-tv/tree/main/packages/config-tv) to adjust native files during Expo prebuild.

## Quick start
- Install dependencies: `pnpm install`
- TV prebuild (cleans and applies TV modifications): `EXPO_TV=1 pnpm prebuild:tv`
- Run for Apple TV: `pnpm ios`
- Run for Android TV: `pnpm android`
- Run for web: `pnpm web`

## Notes
- `EXPO_TV=1` enables the config-tv plugin. You can also set `isTV` in `app.json`.
- Metro can resolve TV-specific extensions like `*.ios.tv.tsx`, `*.android.tv.tsx`, and `*.tv.tsx` if you enable the sample `metro.config.js`.
- Replace placeholder TV assets (banner, icons, top-shelf images) with your own. Apple TV assets must match required dimensions.
