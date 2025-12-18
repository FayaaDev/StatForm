# Mobile App Architecture

## Technology Stack

### Core
- **Framework**: Expo (Managed Workflow)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **State Management**: React Context API

### Offline & Storage
- **Local Database**: Expo SQLite
- **Secure Storage**: Expo SecureStore (for auth tokens)
- **Key-Value Storage**: AsyncStorage (for preferences)
- **Network Monitoring**: @react-native-community/netinfo

### UI & UX
- **Styling**: React Native StyleSheet with RTL support
- **Safe Areas**: react-native-safe-area-context
- **Status Bar**: expo-status-bar

## Project Structure

```
mobile-app/
├── src/
│   ├── shared/              # Shared code from web app
│   │   ├── types/           # TypeScript interfaces
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   │
│   ├── contexts/            # React contexts
│   │   ├── AuthContext.tsx
│   │   └── SyncContext.tsx
│   │
│   ├── screens/             # Screen components
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── templates/
│   │   │   ├── TemplateListScreen.tsx
│   │   │   └── FillFormScreen.tsx
│   │   └── cases/
│   │       ├── CaseListScreen.tsx
│   │       └── CaseDetailScreen.tsx
│   │
│   ├── components/          # Reusable components
│   │   ├── forms/           # Form field components
│   │   ├── ui/              # UI components
│   │   └── layout/          # Layout components
│   │
│   ├── navigation/          # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── database/            # SQLite database
│   │   ├── schema.ts
│   │   ├── migrations.ts
│   │   └── queries.ts
│   │
│   ├── services/            # Mobile-specific services
│   │   ├── syncService.ts
│   │   ├── storageService.ts
│   │   └── networkService.ts
│   │
│   └── hooks/               # Custom hooks
│       ├── useAuth.ts
│       ├── useSync.ts
│       └── useOfflineQueue.ts
│
├── App.tsx                  # Entry point
├── app.json                 # Expo configuration
└── package.json
```

## Navigation Structure

```
Root Navigator (Stack)
├── Auth Stack (when not authenticated)
│   └── Login Screen
│
└── Main Navigator (Bottom Tabs, when authenticated)
    ├── Templates Tab (Stack)
    │   ├── Template List Screen
    │   └── Fill Form Screen
    │
    └── Cases Tab (Stack)
        ├── Case List Screen
        └── Case Detail Screen
```

## Data Flow

### Online Mode
1. User authenticates → Token stored in SecureStore
2. Fetch templates → Cache in SQLite
3. Fill form → Submit to API → Store in SQLite
4. View cases → Fetch from API → Cache in SQLite

### Offline Mode
1. Use cached templates from SQLite
2. Fill form → Store draft in SQLite with status='pending'
3. View cached cases from SQLite
4. Queue operations for sync

### Sync Process
1. Monitor network status with NetInfo
2. When online, check for pending operations
3. Push pending submissions to API
4. Pull updated data from API
5. Update local cache and status

## Database Schema

### Tables

#### templates
```sql
CREATE TABLE templates (
  id INTEGER PRIMARY KEY,
  template_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template_data TEXT NOT NULL, -- JSON
  disease TEXT,
  is_active INTEGER DEFAULT 1,
  synced_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### cases
```sql
CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  server_id INTEGER, -- NULL if not synced yet
  template_id TEXT NOT NULL,
  case_data TEXT NOT NULL, -- JSON
  case_name TEXT,
  patient_identifier TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'synced', 'error'
  sync_error TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  synced_at TEXT,
  FOREIGN KEY (template_id) REFERENCES templates(template_id)
);
```

#### sync_queue
```sql
CREATE TABLE sync_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  operation TEXT NOT NULL, -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL, -- 'case'
  entity_id INTEGER NOT NULL,
  payload TEXT NOT NULL, -- JSON
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## State Management

### AuthContext
- User authentication state
- Login/logout methods
- Token management
- User profile data

### SyncContext
- Sync status (idle, syncing, error)
- Pending operations count
- Manual sync trigger
- Network status
- Last sync timestamp

## Security Considerations

1. **Token Storage**: Use SecureStore for auth tokens
2. **API Communication**: Use HTTPS only
3. **Data Validation**: Validate all inputs before storage
4. **Sensitive Data**: Don't log sensitive information
5. **Session Management**: Auto-logout on token expiration

## Performance Optimizations

1. **Lazy Loading**: Load templates on demand
2. **Pagination**: Implement pagination for case lists
3. **Caching**: Cache API responses in SQLite
4. **Debouncing**: Debounce search inputs
5. **Background Sync**: Use AppState to sync when app becomes active

## RTL Support

1. **I18nManager**: Enable RTL layout for Arabic
2. **Flexbox**: Use flexDirection with RTL awareness
3. **Text Alignment**: Default to right for Arabic text
4. **Icons**: Mirror icons when appropriate

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- Database queries

### Integration Tests
- Auth flow
- Sync process
- Form submission

### E2E Tests (with Expo)
- Login → Template List → Fill Form → Submit
- Offline form fill → Go online → Sync
- View cases → Edit case → Sync

## Deployment

### Development
```bash
npm start  # Start Expo dev server
npm run ios  # Run on iOS simulator
npm run android  # Run on Android emulator
```

### Staging/Production
```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
eas submit --platform ios
eas submit --platform android
```

### Over-the-Air Updates
```bash
eas update --branch production
```

## Environment Configuration

### Development
- API_URL: http://localhost:3001/api

### Production
- API_URL: https://your-production-api.com/api

## Next Steps

1. ✅ Initialize Expo project
2. ✅ Install dependencies
3. ⏳ Create shared types package
4. ⏳ Implement database schema
5. ⏳ Build authentication flow
6. ⏳ Create navigation structure
7. ⏳ Implement template list
8. ⏳ Build form renderer
9. ⏳ Implement case manager
10. ⏳ Add sync functionality
11. ⏳ Test offline scenarios
12. ⏳ Set up EAS build

