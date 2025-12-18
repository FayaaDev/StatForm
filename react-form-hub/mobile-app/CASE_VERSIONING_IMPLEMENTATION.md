# Case Versioning Implementation - Mobile App

## Overview

The mobile app now follows the same case versioning logic as the web application. When editing an existing case, instead of directly updating it, the system creates a **new version** of the case, preserving the edit history.

## Changes Made

### 1. Added `createCaseVersion` Method to Case Service
**File:** `src/shared/services/caseService.ts`

```typescript
async createCaseVersion(
  originalCaseId: number,
  caseData: Partial<CaseData>,
  versionLabel?: string
): Promise<CaseData>
```

This method:
- Creates a new version of an existing case
- Calls the server's versioning endpoint: `/cases/${caseId}/versions?templateId=${templateId}`
- Includes a version label with timestamp and username
- Returns the newly created version

### 2. Updated `handleSave` in Case Detail Screen
**File:** `src/screens/cases/CaseDetailScreen.tsx`

The save handler now:
- Creates a new version when editing online (instead of direct update)
- Generates version label: `تعديل ${date} - ${time} - ${username}`
- Updates local database with the new version's ID
- Shows success message: "تم إنشاء نسخة جديدة من الحالة بنجاح"

## Behavior

### Online Mode (Connected to Server)
When a user edits a case while online:
1. **New version is created** on the server with:
   - All form data changes
   - Updated investigation status
   - Updated case classification
   - Version label with timestamp and username
2. Local database is updated with the new version
3. Success message confirms version creation

### Offline Mode (No Connection)
When a user edits a case while offline:
1. Changes are saved locally
2. Case status is marked as `pending`
3. Message informs user: "سيتم إنشاء نسخة جديدة عند المزامنة"
4. When synced later, a new version will be created on the server

## Benefits

### 1. **Complete Edit History**
- Every edit creates a new version
- Original case data is preserved
- All versions are tracked with labels

### 2. **Audit Trail**
- Each version includes:
  - Date and time of edit
  - Username of the editor
  - All changes made

### 3. **Consistency with Web App**
- Mobile and web now use the same versioning logic
- Users get consistent behavior across platforms
- Data integrity is maintained

### 4. **Version Management**
- Cases can have multiple versions
- Original case ID is preserved
- Version numbers are automatically incremented

## Version Label Format

Arabic format: `تعديل ${date} - ${time} - ${username}`

Example: `تعديل ١٠/١١/٢٠٢٥ - ٠٣:٤٥ م - أحمد محمد`

## Technical Details

### API Endpoint
```
POST /api/cases/:caseId/versions?templateId=${templateId}
```

### Version Data Structure
```typescript
{
  case_data: Record<string, any>,
  case_name: string,
  patient_identifier: string,
  template_id: string,
  template_name: string,
  region: string,
  disease: string,
  city_id: string,
  city_name: string,
  investigation_status: 'open' | 'closed',
  case_classification: 'confirmed' | 'probable' | 'not_a_case',
  version_label: string // Auto-generated
}
```

### Database Fields
- `original_case_id`: Links to the first version
- `version_number`: Sequential number (1, 2, 3...)
- `version_label`: User-friendly label with timestamp
- `version_count`: Total number of versions (for original case)

## User Experience

### Before (Direct Update)
```
Edit Case → Save → Case Updated ✓
(Original data lost)
```

### After (Version Creation)
```
Edit Case → Save → New Version Created ✓
(Original data preserved, history tracked)
```

## Testing Checklist

- [ ] Edit a case while online
- [ ] Verify new version is created on server
- [ ] Check version label format is correct
- [ ] Edit a case while offline
- [ ] Verify changes are saved locally
- [ ] Sync and verify version is created
- [ ] Check investigation status updates create versions
- [ ] Check case classification updates create versions
- [ ] Verify local database is updated correctly

## Related Files

1. **Case Service**: `src/shared/services/caseService.ts`
2. **Case Detail Screen**: `src/screens/cases/CaseDetailScreen.tsx`
3. **Types**: `src/shared/types/index.ts`
4. **Database Queries**: `src/database/caseQueries.ts`

## Compatibility

- ✅ Works with existing server API
- ✅ Compatible with web app versioning
- ✅ Backward compatible with non-versioned cases
- ✅ Supports offline editing and sync

## Notes

1. The `updateCase` method still exists for backward compatibility and status updates
2. Only full case edits create new versions
3. Investigation status and classification changes are included in versions
4. Version labels use Arabic date/time format for consistency with web app

## Troubleshooting

### Case Disappears After Editing

**Issue:** After editing a case and creating a new version, the case disappears from the case list.

**Root Cause:** The server returns only the **latest version** of each case when fetching cases for a template. When a new version is created with a new server_id, the local database needs to be properly updated to reflect this change.

**Solution:** The implementation has been updated to:
1. Update the local record with the new version's complete data (not just the ID)
2. Update the server_id to point to the new version
3. Add comprehensive logging to track sync operations
4. Ensure database transactions complete before navigation

**Key Code Changes:**
- `CaseDetailScreen.tsx`: Uses data from `newVersion` response to update local database
- `caseQueries.ts`: Added detailed logging in `syncRemoteCases` to track case updates and deletions

**Debugging:**
Check the console logs for:
- `[syncRemoteCases]` messages showing which cases are being synced
- `✅ Local case X updated with new version Y` confirming the update
- Any deletion messages showing how many obsolete cases were removed

### Sync Behavior

When the app syncs:
1. Fetches latest versions from server (not all versions, just the most recent)
2. Updates existing local cases that match the server_ids
3. Creates new local cases for new server cases
4. **Deletes** only synced cases whose server_ids are not in the remote list
5. **Preserves** draft and pending cases (not yet synced to server)

## Future Enhancements

Potential improvements:
- Add version history viewer in mobile app
- Allow comparing different versions
- Add version restore functionality
- Show version count badge on case items
- Add pull-to-refresh after editing to immediately sync latest data

