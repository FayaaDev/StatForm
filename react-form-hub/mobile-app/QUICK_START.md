# Quick Start Guide

## Get the Mobile App Running in 5 Minutes

### 1. Install Dependencies (1 minute)

```bash
cd /Users/fayaa/Desktop/App/MalariaForm/mobile-app
npm install
```

### 2. Start the Backend Server (1 minute)

In a separate terminal:

```bash
cd /Users/fayaa/Desktop/App/MalariaForm
npm run dev:backend
```

Make sure your backend is running on `http://localhost:3001`

### 3. Start the Mobile App (1 minute)

```bash
cd /Users/fayaa/Desktop/App/MalariaForm/mobile-app
npm start
```

### 4. Run on Device/Simulator (2 minutes)

Choose one:

**Option A: iOS Simulator** (Mac only)
- Press `i` in the terminal
- Or scan QR code with Camera app on iPhone

**Option B: Android Emulator**
- Press `a` in the terminal
- Or scan QR code with Expo Go app on Android

**Option C: Physical Device**
1. Install Expo Go app from App Store or Play Store
2. Scan the QR code shown in terminal
3. App will load on your device

### 5. Test the App

1. **Login** with a regional user account:
   - Username: (your regional user)
   - Password: (your password)

2. **View Templates**:
   - Should see list of assigned templates
   - Pull down to refresh

3. **Fill a Form**:
   - Tap "ملء النموذج" on any template
   - Fill in some fields
   - Tap "حفظ كمسودة" to save as draft

4. **View Cases**:
   - Go back to template list
   - Tap "إدارة الحالات" on same template
   - Should see your saved case

5. **Test Offline**:
   - Turn off WiFi/data on device
   - Try filling another form
   - Turn WiFi/data back on
   - Pull down to sync

## Troubleshooting

### "SQLite.openDatabase is not a function"
- **Fixed!** The database has been updated to use Expo SDK 54+ async API
- If you still see this, try: `npm start -- --clear`

### "Cannot connect to server"
- Make sure backend is running on port 3001
- Check `src/shared/services/apiClient.ts` has correct URL
- For physical device, use your computer's IP instead of localhost

### "Database error"
- Clear app data and restart
- Or run: `npm start -- --clear`

### "Module not found"
- Run: `npm install`
- Clear cache: `npm start -- --clear`

### iOS Simulator not opening
- Make sure Xcode is installed
- Run: `xcode-select --install`

### Android Emulator not opening
- Make sure Android Studio is installed
- Create an AVD in Android Studio first

## What's Next?

- Read [README.md](./README.md) for full documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for testing procedures
- Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment

## Need Help?

- Check console logs for errors
- Look at [MOBILE_APP_IMPLEMENTATION_SUMMARY.md](../MOBILE_APP_IMPLEMENTATION_SUMMARY.md)
- Review [MOBILE_AUDIT.md](../mobile/MOBILE_AUDIT.md) for API details

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Reload" to refresh

### Debug Menu
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Debug Remote JS" to use Chrome DevTools

### View Logs
```bash
# All logs
npx react-native log-ios
npx react-native log-android

# Or in Expo
# Logs appear in the terminal where you ran 'npm start'
```

### Clear Everything
```bash
npm start -- --clear
```

That's it! You're ready to develop the mobile app. 🚀

