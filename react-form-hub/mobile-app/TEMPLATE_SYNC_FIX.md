# Template Sync Fix - Mobile App

## Problem
When a template was created in the web app (DeployedForm.tsx), it wasn't appearing in the mobile app unless the user signed out and signed in again. Pull-to-refresh and the sync button didn't show the new template.

## Root Cause
The mobile app's template filtering logic was too strict:

1. **Filtering Logic**: The `filterTemplatesForUser` function in `templateService.ts` was only checking for `template.template_data?.isDeployed === true`
2. **Deployment Flag**: When templates are initially created, they might not have the `isDeployed` flag set immediately, or only have a `deploymentId` set
3. **Sync Timing**: The sync process was working correctly, but the filtering was preventing newly synced templates from appearing in the list

## Solution Implemented

### 1. Updated Template Filtering Logic
**File**: `mobile-app/src/shared/services/templateService.ts`

Changed the filtering logic to accept templates that have either:
- `isDeployed: true` flag, OR
- A valid `deploymentId` field

```typescript
// Old (too strict):
if (!template.is_active || !template.template_data?.isDeployed) {
  return false;
}

// New (more flexible):
if (!template.is_active) {
  return false;
}

const isDeployed = template.template_data?.isDeployed === true || 
                  !!template.template_data?.deploymentId;

if (!isDeployed) {
  console.log(`Template "${template.name}" filtered out - not deployed`);
  return false;
}
```

### 2. Added Comprehensive Logging
**Files**: 
- `mobile-app/src/services/syncService.ts`
- `mobile-app/src/screens/templates/TemplateListScreen.tsx`

Added detailed logging to help diagnose sync issues:
- Log when templates are fetched from the server
- Log template details (name, ID, deployment status)
- Log filtering results
- Log when sync starts and completes
- Log when templates are loaded from local database

## How to Test

### 1. Deploy a New Template
1. Open the web app at `https://vazhs.com`
2. Go to Admin Dashboard
3. Create and deploy a new template
4. Note the template name and deployment ID

### 2. Test Mobile App Sync
1. Open the mobile app
2. **Check logs** - You should see:
   ```
   [syncTemplates] Fetching templates from server...
   [syncTemplates] Fetched X templates from server
     - Template: "New Template Name" (ID: X, isDeployed: true, deploymentId: xyz)
   [syncTemplates] After filtering: X templates
   ```

3. **Pull to refresh** on the template list:
   - Pull down on the list
   - Wait for sync to complete
   - New template should appear immediately

4. **Tap sync button** (if available):
   - Sync should fetch and display new template
   - Check logs for sync progress

5. **Navigate away and back**:
   - Go to another screen
   - Return to template list
   - Template should persist (loaded from local DB)

### 3. Verify Logs
Check the console/debugger for these log patterns:

**During Sync:**
```
[syncTemplates] Fetching templates from server...
[syncTemplates] Fetched 5 templates from server
  - Template: "Malaria Form" (ID: 1, isDeployed: true, deploymentId: abc123)
  - Template: "New Template" (ID: 2, isDeployed: true, deploymentId: xyz789)
[syncTemplates] After filtering: 5 templates (User: john_doe)
[syncTemplates] Successfully synced 5 templates to local database
```

**During Load:**
```
[TemplateListScreen] Loading templates from local database...
[TemplateListScreen] Loaded 5 templates from local DB
  - Local template: "Malaria Form" (ID: 1, isDeployed: true, deploymentId: abc123)
[TemplateListScreen] After filtering: 5 templates (User: john_doe)
```

**If a Template is Filtered Out:**
```
Template "Draft Template" filtered out - not deployed (isDeployed: false, deploymentId: undefined)
```

## Expected Behavior After Fix

### ✅ Before Sign Out/In
- Create template in web app
- Deploy template
- Open mobile app
- **Pull to refresh** → New template appears immediately
- **Or tap sync button** → New template appears immediately

### ✅ Template Visibility
Templates are now shown if they have:
- `is_active: true` AND
- (`isDeployed: true` OR valid `deploymentId`)

### ✅ Troubleshooting
If a template still doesn't appear after sync:

1. **Check logs** to see if template was fetched:
   - Look for template in sync logs
   - Check deployment status values
   
2. **Verify template in web app**:
   - Template must be marked as deployed
   - Template should have `isDeployed: true` or `deploymentId` set
   
3. **Check user permissions**:
   - Regional users need proper disease assignments
   - HQ templates require explicit assignment

4. **Force full sync**:
   - Sign out
   - Sign in
   - This clears and resyncs all data

## Technical Details

### Database Schema
Templates are stored in SQLite with these key fields:
- `server_id`: Backend template ID (UNIQUE)
- `template_id`: Template deployment ID (UNIQUE)
- `template_data`: Full template JSON (includes `isDeployed` and `deploymentId`)
- `is_active`: Active status flag

### Sync Flow
1. User pulls to refresh or taps sync button
2. `syncNow()` is called (from SyncContext)
3. `syncTemplates()` fetches all templates from API
4. Templates are filtered based on user permissions
5. Filtered templates are upserted to local database
6. `loadTemplates()` reads from local database
7. Templates are filtered again (client-side)
8. UI updates with new template list

### Why Sign Out/In Was Working
- Sign out clears local database
- Sign in triggers full sync
- Fresh data includes all deployed templates
- No filtering inconsistencies

## Related Files
- `mobile-app/src/shared/services/templateService.ts` - Template filtering logic
- `mobile-app/src/services/syncService.ts` - Sync orchestration
- `mobile-app/src/screens/templates/TemplateListScreen.tsx` - Template list UI
- `mobile-app/src/database/templateQueries.ts` - Database operations
- `components/AdminDashboard.tsx` - Template deployment (sets `isDeployed` flag)

## Future Improvements
1. Add visual indicator when sync completes
2. Add toast notification when new templates are detected
3. Add "force sync" button for troubleshooting
4. Add sync timestamp display
5. Add template count badges (new/total)

