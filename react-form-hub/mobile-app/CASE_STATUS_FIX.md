# Case Status Fields Fix

## Problem
When creating new case versions in the mobile app, the `investigation_status` (حالة التقصي) and `case_classification` (تصنيف الحالة) fields were not being saved. New versions would always show:
- Investigation Status: "مفتوح" (open) - the default value
- Case Classification: "-" (empty)

## Root Cause
The backend was not extracting or storing these fields when creating case versions:

1. **Backend Route (`server/routes/cases.ts`)**: The POST `/cases/:id/versions` endpoint was not extracting `investigation_status` and `case_classification` from the request body.

2. **Insert Function (`server/database/init.ts`)**: The `insertCaseWithColumns` function's metadata parameter did not include these fields, and they were not being added to the SQL INSERT statement.

## Solution

### 1. Updated `server/routes/cases.ts`

**For Case Version Creation** (POST `/cases/:id/versions`):
- Added extraction of `investigation_status` and `case_classification` from request body
- Passed these values to `insertCaseWithColumns` function
- Added debug logging to trace the values

**For New Case Creation** (POST `/cases`):
- Also updated to support these fields for consistency

### 2. Updated `server/database/init.ts`

**Function: `insertCaseWithColumns`**:
- Added `investigationStatus` and `caseClassification` to the metadata parameter type
- Added these fields to the SQL INSERT columns list
- Set default value of `'open'` for `investigation_status` if not provided
- Set default value of `null` for `case_classification` if not provided

## Changes Made

### File: `server/routes/cases.ts`

```typescript
// Extracting from request body
const { 
  case_data, 
  case_name, 
  patient_identifier, 
  template_id, 
  city_id,
  city_name,
  version_label,
  investigation_status,    // ✅ Added
  case_classification      // ✅ Added
} = req.body;

// Passing to insertCaseWithColumns
const result = await insertCaseWithColumns(
  finalTemplateId as string,
  case_data,
  {
    caseName: case_name,
    patientIdentifier: patient_identifier,
    cityId: city_id,
    cityName: city_name,
    versionNumber: nextVersionNumber,
    investigationStatus: investigation_status,     // ✅ Added
    caseClassification: case_classification        // ✅ Added
  }
);
```

### File: `server/database/init.ts`

```typescript
// Updated metadata type
export const insertCaseWithColumns = async (
  templateId: string,
  caseData: Record<string, any>,
  metadata: {
    caseName?: string;
    patientIdentifier?: string;
    cityId?: string;
    cityName?: string;
    versionNumber?: number;
    originalCaseId?: number;
    versionLabel?: string;
    investigationStatus?: string;      // ✅ Added
    caseClassification?: string;       // ✅ Added
  }
): Promise<any> => {
  // ...

  // Updated columns and values arrays
  const columns: string[] = [
    'case_name', 
    'patient_identifier', 
    'city_id', 
    'city_name', 
    'investigation_status',    // ✅ Added
    'case_classification'      // ✅ Added
  ];
  
  const values: any[] = [
    metadata.caseName || null,
    metadata.patientIdentifier || null,
    metadata.cityId || null,
    metadata.cityName || null,
    metadata.investigationStatus || 'open',     // ✅ Added with default
    metadata.caseClassification || null         // ✅ Added
  ];
  
  // ...
}
```

## Testing

### Prerequisites
1. Restart the backend server to apply the changes
2. Ensure the mobile app is connected to the backend

### Test Steps

1. **Create a New Case**:
   - Open the mobile app
   - Navigate to a template
   - Create a new case with form data
   - Set investigation status to "مفتوح" (open)
   - Set case classification to "مؤكدة" (confirmed)
   - Save the case

2. **Edit and Create New Version**:
   - Open the case detail screen
   - Change investigation status to "مغلق" (closed)
   - Change case classification to "محتملة" (probable)
   - Click "حفظ التغييرات" (Save Changes)
   - This creates a new version

3. **Verify Version History**:
   - Click "📜 عرض سجل النسخ" (View Version History)
   - You should see the new version listed
   - Click on the new version to view details

4. **Verify Status Fields**:
   - In the version detail screen, check:
     - ✅ Investigation Status should show "مغلق" (closed)
     - ✅ Case Classification should show "محتملة" (probable)
   - Go back and view the original version
   - Check that it still shows the original values:
     - ✅ Investigation Status: "مفتوح" (open)
     - ✅ Case Classification: "مؤكدة" (confirmed)

### Expected Results
- ✅ New versions should correctly save and display the updated investigation_status
- ✅ New versions should correctly save and display the updated case_classification
- ✅ Each version maintains its own independent status values
- ✅ The version history should show the correct values for each version

## Frontend Compatibility

The frontend (mobile app) already sends these fields correctly:
- `CaseDetailScreen.tsx` sends both fields when creating versions (lines 171-172)
- `CaseVersionDetailScreen.tsx` correctly displays these fields from the backend response
- No frontend changes are required

## Notes

- The default value for `investigation_status` is `'open'` if not provided
- The default value for `case_classification` is `null` if not provided
- These fields are indexed in the database for performance (see `createFreshTable` in `init.ts`)
- All existing cases will continue to work as expected

