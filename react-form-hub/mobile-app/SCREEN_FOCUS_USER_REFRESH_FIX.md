# Screen Focus User Refresh Fix

## Problem

When navigating away from the template list screen and returning (e.g., going to "إدارة الحالات" and back), templates would disappear even though they were visible before.

### Logs Showing the Issue
```
LOG  Loaded 1 templates for user wwq          ← After pull-to-refresh
LOG  Screen focused, reloading templates...
LOG  Loaded 0 templates for user wwq          ← After navigation back
```

## Root Cause

The `useFocusEffect` hook was loading templates with **stale user data** from the AuthContext.

**Timeline:**
1. Template deployed and assigned to user AFTER deployment
2. User pulls to refresh → `syncNow()` refreshes user data → user gets new assignment → 1 template visible ✅
3. User navigates to "إدارة الحالات" → leaves screen
4. User returns to home → `useFocusEffect` runs → `loadTemplates()` uses **cached user from context** → filters out template → 0 templates visible ❌

The problem was that `useFocusEffect` only called `loadTemplates()` which used the stale `user` object, but didn't refresh the user's assignments from the server.

## Solution

Modified `useFocusEffect` to refresh user data before loading templates, ensuring assignments are always current when returning to the screen.

### Changes Made

```typescript
// Before (Broken)
useFocusEffect(
  React.useCallback(() => {
    console.log('Screen focused, reloading templates...');
    loadTemplates();
    loadPendingCases();
  }, [loadTemplates, loadPendingCases])
);

// After (Fixed)
useFocusEffect(
  React.useCallback(() => {
    console.log('Screen focused, refreshing user and reloading templates...');
    
    const refreshAndLoad = async () => {
      try {
        await refreshUser();
        console.log('User data refreshed on screen focus');
      } catch (error) {
        console.warn('Could not refresh user on focus:', error);
      }
      
      await loadTemplates();
      await loadPendingCases();
    };
    
    refreshAndLoad();
  }, [loadTemplates, loadPendingCases, refreshUser])
);
```

## How It Works Now

### Before (Broken)
```
Navigate to home
  ↓
Screen focus triggered
  ↓
Load templates with STALE user data
  ↓
Filter templates (user missing new assignments)
  ↓
Templates disappear ❌
```

### After (Fixed)
```
Navigate to home
  ↓
Screen focus triggered
  ↓
Refresh user data from server (/auth/me)
  ↓
Load templates with FRESH user data
  ↓
Filter templates (user has current assignments)
  ↓
Templates stay visible ✅
```

## Expected Logs After Fix

```
Screen focused, refreshing user and reloading templates...
User data refreshed on screen focus
Loaded 1 templates for user wwq          ← Stays at 1 after navigation!
```

## Benefits

1. Templates no longer disappear when navigating back
2. User assignments always fresh on screen focus
3. No manual refresh needed
4. Consistent behavior across navigation
5. Works for newly assigned templates

## Testing

After this fix:

1. Deploy a template
2. Assign it to a user
3. Pull to refresh in app → template appears
4. Navigate to "إدارة الحالات"
5. Return to home screen
6. Template should still be visible ✅

## Files Modified

- `mobile-app/src/screens/templates/TemplateListScreen.tsx`
  - Added `refreshUser` from AuthContext
  - Modified `useFocusEffect` to refresh user before loading templates

## Related Fixes

This complements the earlier fix where we added user refresh to `syncNow()`. Now both:
- Pull to refresh (syncNow) → refreshes user data
- Screen focus (useFocusEffect) → refreshes user data

This ensures user assignments are always current regardless of how you return to the screen.

## Technical Notes

- Refresh happens only on screen focus, not on every render
- Graceful error handling if refresh fails
- Async refresh doesn't block UI
- User data cached in AuthContext until next refresh
- Templates load with fresh user data after refresh completes

