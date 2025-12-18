# Disease Surveillance Mobile App

A React Native mobile application for regional health employees to manage disease surveillance forms and cases offline.

## Features

- ✅ Regional user authentication
- ✅ Offline template caching
- ✅ Offline form filling with draft support
- ✅ Case management with sync status
- ✅ Automatic background synchronization
- ✅ RTL support for Arabic
- ✅ Native mobile UX with smooth scrolling
- ✅ Secure token storage
- ✅ Network status monitoring

## Tech Stack

- **Framework**: Expo (Managed Workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Database**: SQLite (expo-sqlite)
- **Secure Storage**: Expo SecureStore
- **Network**: @react-native-community/netinfo

## Project Structure

```
mobile-app/
├── src/
│   ├── shared/              # Shared types and services
│   ├── contexts/            # React contexts (Auth, Sync)
│   ├── database/            # SQLite schema and queries
│   ├── services/            # Network and sync services
│   ├── screens/             # Screen components
│   ├── navigation/          # Navigation setup
│   └── components/          # Reusable components
├── App.tsx                  # Entry point
├── app.json                 # Expo configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
cd mobile-app
npm install
```

### Development

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on physical device
# Scan QR code with Expo Go app
```

### Configuration

Update API endpoint in `src/shared/services/apiClient.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api'  // Development
  : 'https://your-api.com/api';  // Production
```

## Usage

### Login
1. Open the app
2. Enter regional user credentials
3. App will sync templates automatically

### Fill Form Offline
1. Select a template from the list
2. Tap "ملء النموذج" (Fill Form)
3. Fill in the form fields
4. Save as draft or submit for sync
5. Form will sync when internet is available

### Manage Cases
1. Select a template from the list
2. Tap "إدارة الحالات" (Manage Cases)
3. View all cases with sync status
4. Tap a case to view details (TODO)

### Manual Sync
- Pull down on template list to refresh
- Pull down on case list to sync

## Database Schema

### Templates Table
- Stores cached templates from server
- Includes full template definition with sections/fields

### Cases Table
- Stores draft and pending cases
- Tracks sync status (draft, pending, synced, error)
- Links to templates via template_id

### Sync Queue Table
- Tracks pending sync operations
- Handles retry logic for failed syncs

## Offline Behavior

### What Works Offline
- View cached templates
- Fill forms
- Save drafts
- View cached cases
- Search templates

### What Requires Online
- Login/logout
- Sync templates
- Submit cases
- Update cases
- Delete cases

## Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing procedures.

```bash
# Run tests
npm test

# Run E2E tests
npm run e2e:ios
npm run e2e:android
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

```bash
# Build for iOS
eas build --profile production --platform ios

# Build for Android
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Known Limitations

1. **Form Renderer**: Simplified version - only supports text/textarea inputs
   - TODO: Implement all field types (radio, checkbox, select, date, etc.)
   - TODO: Implement conditional logic
   - TODO: Implement field validation

2. **Case Detail Screen**: Not implemented yet
   - TODO: View full case details
   - TODO: Edit case functionality
   - TODO: Delete case functionality

3. **Advanced Features**: Not yet implemented
   - TODO: Image/file attachments
   - TODO: Push notifications
   - TODO: Biometric authentication
   - TODO: Export to Excel/PDF
   - TODO: Advanced filtering

## Roadmap

### Phase 1 (Current)
- [x] Basic authentication
- [x] Template list
- [x] Simplified form filling
- [x] Case list
- [x] Offline sync

### Phase 2 (Next)
- [ ] Complete form renderer
- [ ] Case detail/edit screen
- [ ] Advanced filtering
- [ ] Better error handling
- [ ] Performance optimizations

### Phase 3 (Future)
- [ ] Image attachments
- [ ] Push notifications
- [ ] Biometric auth
- [ ] Export functionality
- [ ] Analytics dashboard

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## License

Proprietary - All rights reserved

## Version History

### 1.0.0 (Current)
- Initial release
- Basic offline functionality
- Regional user support
- Template and case management

