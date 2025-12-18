# Mobile App Testing Guide

## Testing Matrix

### Device Coverage

#### iOS
- **Minimum Version**: iOS 13.0+
- **Test Devices**:
  - iPhone SE (small screen)
  - iPhone 14 Pro (standard)
  - iPad Air (tablet)

#### Android
- **Minimum Version**: Android 8.0 (API 26)+
- **Test Devices**:
  - Samsung Galaxy A series (mid-range)
  - Google Pixel (standard)
  - Tablet (10" screen)

### Test Scenarios

#### 1. Authentication Flow
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout and verify token removal
- [ ] Auto-login on app restart
- [ ] Session expiration handling

#### 2. Template Management
- [ ] Load templates from server on first login
- [ ] Display filtered templates based on user permissions
- [ ] Search templates by name/disease
- [ ] View template details
- [ ] Handle empty template list

#### 3. Form Filling (Offline)
- [ ] Fill form while online
- [ ] Fill form while offline
- [ ] Save as draft
- [ ] Submit for sync
- [ ] Validate required fields
- [ ] Handle all field types correctly
- [ ] RTL text input and display

#### 4. Case Management
- [ ] View list of cases for a template
- [ ] Filter cases by status
- [ ] View case details
- [ ] Edit case (if permission allows)
- [ ] Delete case (if permission allows)
- [ ] Handle empty case list

#### 5. Offline/Online Sync
- [ ] Queue cases while offline
- [ ] Auto-sync when coming online
- [ ] Manual sync trigger
- [ ] Handle sync errors gracefully
- [ ] Display sync status indicators
- [ ] Resolve conflicts (last-write-wins)
- [ ] Retry failed syncs

#### 6. Network Scenarios
- [ ] Start app offline
- [ ] Go offline while using app
- [ ] Come back online
- [ ] Handle intermittent connectivity
- [ ] Handle slow network
- [ ] Handle timeout errors

#### 7. Data Persistence
- [ ] Data survives app restart
- [ ] Data survives app update
- [ ] Database migrations work correctly
- [ ] No data loss on errors

#### 8. UI/UX
- [ ] RTL layout for Arabic
- [ ] Proper text alignment
- [ ] Smooth scrolling
- [ ] Pull-to-refresh works
- [ ] Loading indicators display correctly
- [ ] Error messages are clear
- [ ] Success feedback is visible
- [ ] Navigation is intuitive

#### 9. Performance
- [ ] App starts in < 3 seconds
- [ ] Forms render quickly
- [ ] List scrolling is smooth (60fps)
- [ ] No memory leaks
- [ ] Battery usage is reasonable
- [ ] Database queries are fast

#### 10. Security
- [ ] Tokens stored securely
- [ ] No sensitive data in logs
- [ ] HTTPS only for API calls
- [ ] Proper session management
- [ ] Data encryption at rest

## Manual Testing Checklist

### Pre-Release Testing

1. **Fresh Install**
   - Install app on clean device
   - Complete first-time setup
   - Verify all permissions requested

2. **Update Testing**
   - Install previous version
   - Add some data
   - Update to new version
   - Verify data migration

3. **Edge Cases**
   - Very long form submissions
   - Special characters in inputs
   - Large number of cases (100+)
   - Multiple simultaneous syncs
   - App backgrounding during operations

4. **Accessibility**
   - Test with screen reader
   - Test with large text sizes
   - Test with reduced motion
   - Test color contrast

## Automated Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Detox)
```bash
# iOS
npm run e2e:ios

# Android
npm run e2e:android
```

## Bug Reporting Template

```
**Environment:**
- Device: [e.g., iPhone 14 Pro]
- OS Version: [e.g., iOS 17.1]
- App Version: [e.g., 1.0.0]
- Network: [Online/Offline/Slow]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**

**Actual Behavior:**

**Screenshots/Videos:**

**Logs:**
```

## Performance Benchmarks

### Target Metrics
- App startup: < 3s
- Template list load: < 1s
- Form render: < 500ms
- Case save: < 200ms
- Sync operation: < 5s per case
- Memory usage: < 150MB
- Battery drain: < 5% per hour of active use

## Test Data

### Test Users
- Username: `test_regional`
- Password: `test123`
- City: Test City
- Assigned diseases: Malaria, Dengue

### Test Templates
- Simple form (5 fields)
- Medium form (20 fields)
- Complex form (50+ fields with conditionals)

## Known Issues

### Current Limitations
1. Form renderer is simplified (TODO: implement all field types)
2. Case detail screen not implemented
3. No image/file attachments yet
4. No push notifications
5. No biometric authentication

### Future Enhancements
- Full form field type support
- Advanced case filtering
- Export to Excel/PDF
- Offline maps for location fields
- Voice input for text fields
- Camera integration for evidence

