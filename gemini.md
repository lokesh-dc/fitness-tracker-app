# FitTrack Mobile Rules & Guidelines

## 1. Technical Stack
- **Framework**: Expo (React Native) with Expo Router (file-based routing).
- **Styling**: NativeWind (Tailwind CSS). Use Tailwind classes for all styling.
- **State Management**: React Hooks and Context (or specific library if implemented).
- **Networking**: Use `fetch` or a dedicated client with Bearer token authentication.

## 2. UI & Design
- **NativeWind**: Use standard Tailwind classes. For platform-specific styles, use `ios:` or `android:` prefixes if necessary.
- **Typography**: Use standard mobile font scales. Avoid hardcoding pixel values where possible; prefer Tailwind spacing/sizing.
- **Calendar/Week Logic**: Always start the week from **Sunday**. Ensure all UI components (e.g., WeekStrip, Plans) follow this convention.
- **Components**: Keep components modular and reusable in the `src/components` directory.
- **Loading/Error States**: Every screen must have a proper loading state and error handling to prevent app crashes or blank screens.

## 3. Architecture & Data
- **Expo Router**: Follow the file-based routing conventions in the `app/` directory.
- **Data Fetching**: Prefer parallel data fetching where possible to improve performance.
- **Authentication**: Ensure all authenticated requests include the Bearer token. Handle token expiration and 401 errors gracefully.
- **TypeScript**: Use strict typing. Define interfaces for API responses and component props. Avoid `any`.

## 4. Assistant Workflow
- **Small Commits/Changes**: Break down large features into manageable chunks.
- **Preserve Context**: Always read existing code (especially in `src/` and `app/`) before implementing new features to ensure consistency.
- **Console Logs**: Remove all `console.log` statements before finalizing a feature.
- **Build Verification**: Ensure changes don't break the Expo dev server or cause linting errors.
