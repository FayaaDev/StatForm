# Mobile App Deployment Guide

## Prerequisites

1. **Expo Account**
   - Sign up at https://expo.dev
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

2. **Apple Developer Account** (for iOS)
   - Enroll at https://developer.apple.com
   - Cost: $99/year

3. **Google Play Console** (for Android)
   - Sign up at https://play.google.com/console
   - One-time fee: $25

## Initial Setup

### 1. Configure EAS

```bash
cd mobile-app
eas init
```

This will create an `eas.json` file. Update it:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "autoIncrement": true
      },
      "android": {
        "autoIncrement": true
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-asc-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

### 2. Update API Configuration

Update `src/shared/services/apiClient.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://your-production-api.com/api'; // Update this!
```

### 3. Configure App Icons

Replace placeholder icons:
- `assets/icon.png` (1024x1024)
- `assets/adaptive-icon.png` (1024x1024 for Android)
- `assets/splash-icon.png` (2048x2048)

## Development Builds

### iOS Simulator

```bash
eas build --profile development --platform ios
```

### Android Emulator

```bash
eas build --profile development --platform android
```

## Preview/Staging Builds

### iOS (TestFlight)

```bash
# Build
eas build --profile preview --platform ios

# Submit to TestFlight
eas submit --platform ios --latest
```

### Android (Internal Testing)

```bash
# Build APK
eas build --profile preview --platform android

# Or build AAB for Play Store
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android --latest
```

## Production Builds

### iOS App Store

```bash
# 1. Build
eas build --profile production --platform ios

# 2. Submit
eas submit --platform ios --latest

# 3. Monitor status
# Go to App Store Connect: https://appstoreconnect.apple.com
```

### Android Play Store

```bash
# 1. Build
eas build --profile production --platform android

# 2. Submit
eas submit --platform android --latest

# 3. Monitor status
# Go to Play Console: https://play.google.com/console
```

## Over-the-Air (OTA) Updates

For minor updates that don't require native code changes:

```bash
# Create update channel
eas update:configure

# Publish update
eas update --branch production --message "Bug fixes and improvements"

# View updates
eas update:list --branch production
```

## Environment Variables

Create `.env` files for different environments:

### `.env.development`
```
API_URL=http://localhost:3001/api
```

### `.env.production`
```
API_URL=https://your-production-api.com/api
```

## CI/CD with GitHub Actions

Create `.github/workflows/mobile-build.yml`:

```yaml
name: Mobile Build

on:
  push:
    branches: [main]
    paths:
      - 'mobile-app/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        working-directory: mobile-app
        run: npm ci
        
      - name: Build iOS
        working-directory: mobile-app
        run: eas build --platform ios --non-interactive --no-wait
        
      - name: Build Android
        working-directory: mobile-app
        run: eas build --platform android --non-interactive --no-wait
```

## Release Checklist

### Pre-Release
- [ ] Update version in `app.json`
- [ ] Update changelog
- [ ] Run all tests
- [ ] Test on real devices
- [ ] Review app permissions
- [ ] Update API endpoints
- [ ] Generate new icons if needed
- [ ] Update screenshots for stores

### iOS Submission
- [ ] Build with production profile
- [ ] Submit to TestFlight
- [ ] Test TestFlight build
- [ ] Submit for App Store review
- [ ] Prepare App Store listing
  - Screenshots (6.5" and 5.5")
  - App description (Arabic & English)
  - Keywords
  - Support URL
  - Privacy policy URL

### Android Submission
- [ ] Build AAB with production profile
- [ ] Test internal release
- [ ] Promote to beta testing
- [ ] Submit for production
- [ ] Prepare Play Store listing
  - Screenshots (phone & tablet)
  - Feature graphic
  - App description (Arabic & English)
  - Privacy policy URL

### Post-Release
- [ ] Monitor crash reports
- [ ] Monitor user reviews
- [ ] Track analytics
- [ ] Plan next iteration

## Monitoring & Analytics

### Crash Reporting
```bash
# Install Sentry
npm install @sentry/react-native

# Configure in App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: __DEV__ ? 'development' : 'production',
});
```

### Analytics
```bash
# Install Firebase Analytics
npm install @react-native-firebase/app @react-native-firebase/analytics
```

## Troubleshooting

### Build Failures
```bash
# Clear cache
eas build:clear-cache

# View build logs
eas build:list
eas build:view [build-id]
```

### Submission Issues
```bash
# Check submission status
eas submit:list

# View submission details
eas submit:view [submission-id]
```

## Version Management

### Semantic Versioning
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features
- **Patch** (1.0.1): Bug fixes

### Build Numbers
- iOS: Auto-incremented by EAS
- Android: Auto-incremented by EAS

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **EAS Update**: https://docs.expo.dev/eas-update/introduction/

## Cost Estimation

### Development
- Expo (Free tier): $0/month
- Expo (Production): $29/month (recommended)

### Distribution
- Apple Developer: $99/year
- Google Play: $25 one-time

### Infrastructure
- Backend hosting: Variable
- Database: Variable
- CDN: Variable

Total estimated: ~$500-1000/year

