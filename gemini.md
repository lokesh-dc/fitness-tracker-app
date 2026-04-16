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
- **Small Commits/Changes**: Break down large features into manageable chunks. **Change Control**: If a task involves modifying more than 2 components, the assistant MUST create an implementation plan detailing the approach and rationale, then wait for explicit user sign-off before execution.
- **Preserve Context**: Always read existing code (especially in `src/` and `app/`) before implementing new features to ensure consistency.
- **Console Logs**: Remove all `console.log` statements before finalizing a feature.
- **Build Verification**: Ensure changes don't break the Expo dev server or cause linting errors.

## 5. Integration with Backend (fitness-tracker)

This application is the mobile companion to the **fitness-tracker** web project (located at `../fitness-tracker`).

- **API Source**: This app consumes the API endpoints defined in the web project. All API changes must be coordinated with the backend schemas.
- **Shared Logic**: 
  - **Sunday-start**: Both platforms MUST use a Sunday-start week convention.
  - **PR Definitions**: PR logic is managed on the backend but visualized here. Refer to the web project's core logic for accuracy.
- **Access Permissions**: The assistant is explicitly granted permission to read and reference the `../fitness-tracker` project at any time for API and logic alignment.
