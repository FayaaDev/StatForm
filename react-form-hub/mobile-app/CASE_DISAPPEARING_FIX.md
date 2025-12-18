# Case Disappearing Fix - Mobile App

## Problem

When a user edits a case in the mobile app, a new version is successfully created on the server, but the case disappears from the case list ("ادارة الحالات").

## Root Cause Analysis

### How Case Versioning Works

1. **Original Case**: User has a case with `server_id=1`, `local_id=5`
2. **Edit Case**: User edits the case in the mobile app
3. **Version Created**: Server creates a new version with `server_id=2`, `original_case_id=1`
4. **Server Response**: Returns only the **latest version** (id=2) when fetching cases
5. **Local Update**: Mobile app updates `local_id=5` to have `server_id=2`

### The Issue

When the case list screen loads or syncs:
1. It queries the local database for cases with the template ID
2. If sync happens, `syncRemoteCases()` fetches the latest versions from the server
3. Server returns `[case id=2]` (the new version)
4. `syncRemoteCases()` should find the local case with `server_id=2` and update it
5. **BUT** if the local database wasn't properly updated with the new version's data, or if there's a timing issue, the case might not appear correctly

## Solutions Implemented

### 1. Update Local Database with Complete Version Data

**File:** `src/screens/cases/CaseDetailScreen.tsx`

**Change:**
```typescript
// Before: Only updated with local formData
await caseQueries.updateCase(caseItem.local_id, formData, caseName, patientId, ...);

// After: Uses data from server's newVersion response
await caseQueries.updateCase(
  caseItem.local_id,
  newVersion.case_data || formData,  // Use server data first
  newVersion.case_name || caseName,
  newVersion.patient_identifier || patientId,
  newVersion.investigation_status || investigationStatus,
  newVersion.case_classification || caseClassification
);
```

**Why:** Ensures the local database has the exact same data structure as the server, preventing any mismatch issues.

### 2. Add Comprehensive Logging

**File:** `src/database/caseQueries.ts`

**Changes:**
- Log sync operations: "Syncing X remote cases for template Y"
- Log remote IDs being processed
- Log updates: "Updating existing local case X with server ID Y"
- Log insertions: "Inserting new local case for server ID X"
- Log deletions: "Deleted X obsolete cases"
- Log completion: "✅ Sync completed successfully"

**Why:** Makes it easy to debug sync issues and understand what's happening during the sync process.

### 3. Add Success Logging in Case Detail

**File:** `src/screens/cases/CaseDetailScreen.tsx`

```typescript
console.log(`✅ Local case ${caseItem.local_id} updated with new version ${newVersion.id}`);
```

**Why:** Confirms the local database update succeeded before navigation.

## How the Fix Works

### Before Fix
```
1. Edit case (server_id=1, local_id=5)
2. Create version → server returns version (server_id=2)
3. Update local DB with formData and server_id=2
4. Navigate back to list
5. Sync happens
6. Server returns [case id=2]
7. syncRemoteCases() might have issues because local data doesn't match server exactly
8. Case might disappear or not display correctly
```

### After Fix
```
1. Edit case (server_id=1, local_id=5)
2. Create version → server returns version (server_id=2)
3. Update local DB with newVersion.case_data and server_id=2  ✓
4. Log: "✅ Local case 5 updated with new version 2"
5. Navigate back to list
6. useFocusEffect triggers loadCases()
7. Case is correctly loaded from local DB  ✓
8. Later, when sync happens:
   - Server returns [case id=2]
   - syncRemoteCases() finds local case with server_id=2
   - Updates it (already correct, no change needed)
   - Logs: "Updating existing local case 5 with server ID 2"
   - Logs: "Deleted 0 obsolete cases"
   - Logs: "✅ Sync completed successfully"
```

## Testing the Fix

### Test Case 1: Edit Case While Online
1. Open a case in the mobile app
2. Edit some fields
3. Save the case
4. **Expected:** Success message "تم إنشاء نسخة جديدة من الحالة بنجاح"
5. Navigate back to case list
6. **Expected:** Case appears in the list with updated data
7. Check console logs:
   - Should see: "✅ Local case X updated with new version Y"
   - Should NOT see errors

### Test Case 2: Edit Then Pull to Refresh
1. Edit and save a case (as above)
2. Navigate back to case list
3. Pull down to refresh (triggers sync)
4. **Expected:** Case remains in the list
5. Check console logs:
   - Should see: "[syncRemoteCases] Syncing X remote cases..."
   - Should see: "[syncRemoteCases] Updating existing local case..."
   - Should see: "[syncRemoteCases] Deleted 0 obsolete cases"
   - Should see: "[syncRemoteCases] ✅ Sync completed successfully"

### Test Case 3: Multiple Edits
1. Edit a case, save it (creates version 2)
2. Case appears in list ✓
3. Edit the same case again, save it (creates version 3)
4. Case still appears in list ✓
5. Check console:
   - First edit: "Local case X updated with new version Y"
   - Second edit: "Local case X updated with new version Z"
   - Sync shows only latest version

## Console Log Examples

### Successful Version Creation
```
Creating new version of case: 1
[API] POST /api/cases/1/versions?templateId=abc123
New version created: { id: 2, case_data: {...}, ... }
✅ Local case 5 updated with new version 2
```

### Successful Sync
```
[syncRemoteCases] Syncing 3 remote cases for template abc123
[syncRemoteCases] Remote IDs: [2, 4, 7]
[syncRemoteCases] Updating existing local case 5 with server ID 2
[syncRemoteCases] Updating existing local case 6 with server ID 4
[syncRemoteCases] Updating existing local case 8 with server ID 7
[syncRemoteCases] Deleted 0 obsolete cases
[syncRemoteCases] ✅ Sync completed successfully
```

## Key Points

1. **Server Behavior**: The server returns only the **latest version** of each case, not all versions
2. **Local Storage**: The mobile app stores one local record per case, updating the `server_id` when versions are created
3. **Sync Safety**: Only synced cases with server_ids not in the remote list are deleted; draft and pending cases are preserved
4. **Data Integrity**: Using the server's response data (not just local form data) ensures consistency

## Related Files

- `src/screens/cases/CaseDetailScreen.tsx` - Case editing and version creation
- `src/database/caseQueries.ts` - Database operations and sync
- `src/services/syncService.ts` - Sync orchestration
- `src/screens/cases/CaseListScreen.tsx` - Case list display

## Rollback Plan

If issues persist:
1. The `updateCase` method still exists and can be used instead of `createCaseVersion`
2. Logs can be removed if they cause performance issues
3. The old behavior can be restored by reverting the `handleSave` function in `CaseDetailScreen.tsx`

