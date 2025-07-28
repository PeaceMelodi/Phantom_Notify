# Phantom Notify

A React Native task reminder app with local notifications.

## Issues Fixed

✅ **Missing key props** - Fixed React warnings about missing key props in lists
✅ **Expo notifications compatibility** - Configured for development builds to support notifications

## Quick Start

### For Development (with notifications support)

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Build development client**:
   ```bash
   eas build --profile development --platform android
   ```

4. **Install the development build** on your device

5. **Run the development server**:
   ```bash
   npx expo start --dev-client
   ```

### For Testing (without notifications)

If you want to test quickly without notifications:

```bash
npx expo start
```

Then scan the QR code with Expo Go (notifications won't work in Expo Go with SDK 53).

## Features

- ✅ Task creation with reminders
- ✅ Local notifications
- ✅ Dark/Light theme toggle
- ✅ Custom fonts
- ✅ Search functionality
- ✅ Task editing and deletion

## Development

- **MainPage**: Task list with search
- **NewTask**: Create/edit tasks with date/time picker
- **Settings**: Theme and font customization
- **Welcome**: Landing screen

## Notifications

The app uses `expo-notifications` for **local scheduled notifications** (not push notifications). These work in both Expo Go and development builds.

**Note**: You may see a warning about push notifications being removed from Expo Go in SDK 53, but this doesn't affect local notifications which are what this app uses.

## Build Commands

- **Development build**: `eas build --profile development --platform android`
- **Preview build**: `eas build --profile preview --platform android`
- **Production build**: `eas build --profile production --platform android` 