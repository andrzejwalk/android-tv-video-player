# Technical Decisions & Architecture

This document explains and justifies every configuration choice in this project.

---

## Project Stack Overview

| Layer | Technology | Version | Justification |
|-------|------------|---------|---------------|
| Runtime | React Native | 0.82.x | TV app development with native performance (includes React 19.1.1) |
| Framework | Expo | 54.x | Simplified RN tooling, TV support via @react-native-tvos/config-tv |
| Language | TypeScript | 5.9.x | Type safety, IDE support, catch errors at compile time |
| Navigation | React Navigation | 7.x | Standard RN navigation, TV remote support |
| Testing | Jest + RTL | 29.x / 13.x | React Native official testing stack (Jest 29.7.0, RTL 13.3.3) |
| Linting | ESLint 9 | 9.x | Flat config, modern plugin architecture |
| Formatting | Prettier | 3.x | Consistent code style, integrated with ESLint |

---

## Configuration Files

### `babel.config.js`

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@react-native/babel-preset'],
  };
};
```

**Decisions:**

1. **`api.cache(true)`** - Caches config permanently because our config is static (no environment-based logic). Improves build performance.

2. **`@react-native/babel-preset`** - The official RN preset (replaces deprecated `metro-react-native-babel-preset`). Includes:
   - `@babel/preset-typescript` - TypeScript syntax
   - `@babel/preset-react` - JSX transformation
   - `@babel/preset-flow` - Flow syntax (for RN internals)
   - Various RN-specific plugins

**Why not other options:**

- `@babel/preset-env`: Already included in RN preset
- `ts-jest`: Uses Babel for transforms instead (more consistent with runtime)
- Separate TypeScript preset: RN preset includes it

---

### `jest.config.js`

```javascript
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  clearMocks: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
```

**Decisions:**

1. **`preset: 'react-native'`** - Uses RN's official Jest preset which configures:
   - Transform rules for JS/TS/JSX
   - `transformIgnorePatterns` for node_modules
   - Test environment
   - Module resolution
   - Asset transformers

2. **`clearMocks: true`** - Automatically clears mock state between tests. Prevents test pollution.

3. **`moduleNameMapper` for assets** - Jest runs in Node.js which can't import binary files. Maps image imports to a string stub.

**Why not other options:**

- `ts-jest`: Uses `babel-jest` via preset (same as runtime, more consistent)
- Custom `transformIgnorePatterns`: Preset handles this correctly
- `testEnvironment: 'jsdom'`: RN preset uses custom RN environment

---

### `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true
  }
}
```

**Decisions:**

1. **`extends: "expo/tsconfig.base"`** - Inherits Expo's tested defaults, reduces config drift.

2. **`target: "ES2022"`** - Hermes (RN's JS engine) supports ES2022. No need to compile to older syntax.

3. **`moduleResolution: "bundler"`** - Tells TS to expect Metro bundler resolution (supports package.json `exports`, etc.).

4. **`jsx: "react-native"`** - Preserves JSX for Metro to transform. Different from web (`react-jsx`).

5. **`noEmit: true`** - TypeScript only type-checks; Babel/Metro handles actual transpilation.

6. **`isolatedModules: true`** - Required for Babel which processes files individually (can't do cross-file analysis).

7. **`strict: true`** - Enables all strict checks. Better type safety.

**Why not other options:**

- `moduleResolution: "node"`: Doesn't understand modern package.json exports
- `jsx: "react-jsx"`: Only for web React, not RN

---

### `eslint.config.cjs`

**Decisions:**

1. **Flat config format** - ESLint 9's new format. Single array, clearer precedence, better performance.

2. **`typescript-eslint`** - Unified package (v8+) replaces separate `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`. Simpler dependency tree.

3. **Separate configs for file types:**
   - Config files: CommonJS (`sourceType: 'script'`)
   - Test files: Jest globals
   - App code: ESM + React rules

4. **`prettier/prettier: 'error'`** - Formats code via ESLint. Single command for lint + format.

**Why not other options:**

- Legacy `.eslintrc`: Deprecated in ESLint 9
- Separate `@typescript-eslint/*` packages: Unified package is simpler

---

### `.prettierrc`

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

**Decisions:**

1. **`singleQuote: true`** - JS community convention, less visual noise than double quotes.

2. **`trailingComma: "es5"`** - Trailing commas in arrays/objects (cleaner git diffs), but not function params (ES5 compat for some tools).

3. **`printWidth: 100`** - Wider than 80 default. Modern monitors can handle it, reduces line wrapping.

4. **`arrowParens: "avoid"`** - `x => x` instead of `(x) => x`. Cleaner for simple lambdas.

---

### `.npmrc`

```ini
node-linker=hoisted
```

**Decision:** Use flat node_modules layout.

**Why:** pnpm's default strict isolation breaks Jest 29's internal module resolution. The `jest-config` package couldn't find `@jest/test-sequencer` due to pnpm's symlink structure.

**Tradeoff:** Loses some pnpm strictness benefits, but Jest works correctly.

---

## Dependency Decisions

### What's Installed (and Why)

**Runtime Dependencies:**

- `expo` with TV support - good for MVP, quick prototyping
- `react-native` - Core framework
- `@react-navigation/native` - Navigation (TV remote compatible); safer bet than Expo Router
- `expo-video` - Video playback with native controls (preferred over expo-av for current Expo guidance)

**Dev Dependencies:**

- `@babel/core` - Required by babel-jest
- `@react-native/babel-preset` - Official RN Babel config
- `babel-jest` - Jest's Babel integration
- `babel-preset-expo` - Expo Babel preset
- `jest` - Test runner
- `jest-expo` - Expo Jest preset
- `@testing-library/react-native` - Component testing utilities
- `react-test-renderer` - for test debugging
- `@types/jest`, `@types/react` - TypeScript definitions
- `typescript` - Type checker
- `eslint` + plugins - Linting
- `prettier` - Formatting

### What's NOT Installed (and Why)

| Package | Status | Reason |
|---------|--------|--------|
| `@babel/preset-env` | Removed | Included in `@react-native/babel-preset` |
| `@babel/preset-flow` | Removed | Included in `@react-native/babel-preset` |
| `@babel/preset-typescript` | Not needed | Included in `@react-native/babel-preset` |
| `ts-jest` | Removed | Using `babel-jest` (via preset) instead |
| `@typescript-eslint/parser` | Removed | Replaced by unified `typescript-eslint` |
| `@typescript-eslint/eslint-plugin` | Removed | Replaced by unified `typescript-eslint` |
| `@testing-library/jest-native` | Not needed | Deprecated; matchers built into RTL v12.4+ |
| `metro-react-native-babel-preset` | Removed | Deprecated; replaced by `@react-native/babel-preset` |
| `expo-av` | Removed | Deprecated Video component; replaced by `expo-video` per Expo guidance |

---

## Testing Strategy

### Unit Tests (current)

- Location: `src/**/__tests__/*.test.tsx`
- Tool: Jest + React Testing Library
- Approach: Render components, assert on output
- Mocks: Navigation hooks mocked in `jest.setup.js`

### Integration Tests

- `HomeToPlayer.integration.test.tsx` covers Home → Details → Player flow with inline harness (navigation mocked for determinism).

### What's Mocked

1. **React Navigation** - Avoids NavigationContainer setup complexity
2. **Static assets** - Images mapped to string stub

### Future Considerations

- E2E tests: Detox for TV remote simulation
- Integration tests: Could also exercise a full `NavigationContainer` if needed

---

## TV-Specific Considerations

1. **`EXPO_TV=1`** environment variable in npm scripts
2. **`@react-native-tvos/config-tv`** plugin for TV icons/banners
3. **Navigation** - React Navigation supports TV remote focus management
4. **Future**: May need custom focus management for complex UI

---

## File Structure Rationale

```text
├── src/
│   ├── screens/           # Screen components
│   │   └── __tests__/     # Co-located tests
│   └── navigation/        # Navigation config
├── __mocks__/             # Jest module mocks
├── assets/                # Static assets
└── [config files]         # Root-level configs
```

**Decisions:**

- Tests co-located with source (`__tests__/` folders) - easier to find related tests
- Flat config files at root - standard convention
- Separate `src/` directory - keeps source separate from config

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `pnpm start` | Start Metro bundler (TV mode) |
| `pnpm android` | Run on Android TV |
| `pnpm ios` | Run on Apple TV |
| `pnpm test` | Run Jest tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm lint` | Check code with ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm format` | Format code with Prettier |
