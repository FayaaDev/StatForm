# Deleted Template Cleanup Fix

## Problem

When templates were deleted on the server, they remained in the mobile app's local database. During sync, the app would try to fetch cases for these deleted templates, causing errors:

```
ERROR  Error fetching cases: [Error: Failed to fetch cases]
LOG  Skipping cases for template Apptest6 (may have been deleted)
```

This happened for every deleted template on every sync.

## Root Cause

The sync process only added or updated templates but never removed them. So:

1. Template synced to local SQLite database
2. Template deleted on server
3. Mobile app still had it locally
4. Tried to fetch cases for deleted template
5. Server returned 404 error

## Solution

Modified the sync process to:

1. Compare local templates vs server templates
2. Identify templates that exist locally but not on server
3. Delete those templates and their cases from local database
4. Prevent case fetch errors for non-existent templates

## Changes Made

### 1. Enhanced Template Sync (`syncService.ts`)

```typescript
// Get current local templates
const localTemplates = await templateQueries.getAllTemplates();

// Find templates that exist locally but not on server (deleted templates)
const serverTemplateIds = new Set(filteredTemplates.map(t => t.id));
const deletedTemplates = localTemplates.filter(t => !serverTemplateIds.has(t.id));

// Delete templates that no longer exist on server
for (const deletedTemplate of deletedTemplates) {
  if (deletedTemplate.template_data?.id) {
    // Delete cases for this template first
    await caseQueries.deleteCasesForTemplate(deletedTemplate.template_data.id);
    // Then delete the template
    await templateQueries.deleteTemplate(deletedTemplate.template_data.id);
  }
}
```

### 2. Added Case Cleanup Function (`caseQueries.ts`)

```typescript
// Delete all cases for a template
deleteCasesForTemplate: async (templateId: string): Promise<void> => {
  const db = await openDatabase();
  await db.runAsync('DELETE FROM cases WHERE template_id = ?', [templateId]);
}
```

## How It Works Now

### Before (Broken)
```
1. Templates A, B, C synced locally
2. Template B deleted on server
3. Sync fetches templates A, C
4. Template B still in local DB
5. Try to fetch cases for A, B, C
6. Error fetching cases for B ❌
```

### After (Fixed)
```
1. Templates A, B, C synced locally
2. Template B deleted on server
3. Sync fetches templates A, C
4. Compare: B exists locally but not on server
5. Delete B and its cases from local DB
6. Only fetch cases for A, C
7. No errors ✅
```

## Benefits

1. No more "Failed to fetch cases" errors for deleted templates
2. Cleaner local database (no orphaned data)
3. Faster sync (fewer templates to process)
4. Automatic cleanup on every sync
5. Better user experience (no error messages)

## Testing

After this fix:

1. Delete a template on the server
2. Pull to refresh in mobile app
3. Should see: `✅ Synced X templates, removed Y deleted`
4. No error messages
5. Deleted template disappears from list

## Files Modified

- `mobile-app/src/services/syncService.ts` - Template sync with cleanup
- `mobile-app/src/database/caseQueries.ts` - Added deleteCasesForTemplate function

## Technical Notes

- Templates are soft-deleted (is_active = 0) for data integrity
- Cases are hard-deleted (removed from DB) to save space
- Cleanup happens before upserting new templates
- Atomic operation ensures consistency
- No user data loss (only removes server-deleted templates)

