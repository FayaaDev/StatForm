# Quick Test Guide - Template Sync Fix

## Quick Test Steps

### 1. Deploy a New Template (Web App)
```
1. Go to https://vazhs.com
2. Login as HQ admin
3. Create a new template or find an existing one
4. Click "Deploy" button
5. Note the template name and disease
6. ⏰ IMPORTANT: Wait 3-5 seconds before syncing mobile app
   (Give database time to commit the transaction)
```

### 2. Assign Disease to Test User (If HQ Template)
```
1. Go to User Manager in web app
2. Find your test user (e.g., "CholeGuy")
3. Make sure the template's disease is assigned to the user
4. Save
```

### 3. Test in Mobile App
```
1. Open mobile app
2. Go to Templates screen
3. Pull down to refresh (or tap sync button)
4. ✅ NEW TEMPLATE SHOULD APPEAR IMMEDIATELY
5. Check console logs for detailed sync information
```

### 3. Verify Logs
Open React Native debugger or console and look for:
```
[syncTemplates] Fetching templates from server...
[syncTemplates] Fetched X templates from server
  - Template: "Your New Template" (isDeployed: true)
[TemplateListScreen] After filtering: X templates
```

## What Changed?

### Before (❌ BROKEN):
- Template deployed in web
- Pull to refresh in mobile
- Template doesn't appear
- Need to sign out/in to see it

### After (✅ FIXED):
- Template deployed in web
- Pull to refresh in mobile
- **Template appears immediately!**
- No sign out/in needed

## Troubleshooting

If template still doesn't appear:

1. **Check template deployment status in web app**
   - Must have "Deployed" badge
   - Should have deployment ID

2. **Check console logs**
   - Is template being fetched? (should see in sync logs)
   - Is it being filtered out? (check filter logs)

3. **Check user permissions**
   - Does user have access to this disease/template?
   - Regional users need disease assignments

4. **Force full refresh**
   - Close and reopen app
   - Or sign out and sign in (last resort)

## Console Log Examples

### Successful Sync:
```
[TemplateListScreen] Starting refresh - syncing with server...
[syncTemplates] Fetching templates from server...
[syncTemplates] Fetched 3 templates from server
  - Template: "Malaria Investigation" (ID: 1, isDeployed: true, deploymentId: abc123)
  - Template: "TB Screening" (ID: 2, isDeployed: true, deploymentId: def456)
  - Template: "NEW TEMPLATE HERE" (ID: 3, isDeployed: true, deploymentId: ghi789)
[syncTemplates] After filtering: 3 templates (User: test_user)
[syncTemplates] Successfully synced 3 templates to local database
[TemplateListScreen] Sync completed, reloading templates...
[TemplateListScreen] Loaded 3 templates from local DB
[TemplateListScreen] After filtering: 3 templates (User: test_user)
[TemplateListScreen] Refresh completed successfully
```

### Template Filtered Out (Not Deployed):
```
Template "Draft Template" filtered out - not deployed (isDeployed: false, deploymentId: undefined)
```

## Testing Checklist

- [ ] Deploy new template in web app
- [ ] Pull to refresh in mobile app
- [ ] Verify template appears in list
- [ ] Tap on template - should open fill form
- [ ] Navigate away and back - template persists
- [ ] Check console logs - no errors
- [ ] Try with different user permissions
- [ ] Verify sync indicator shows during refresh

