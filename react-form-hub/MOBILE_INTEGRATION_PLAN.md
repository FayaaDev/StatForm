# StatForm Integration into Vazhs Mobile App - Implementation Plan

## Overview
Integrate all 14 StatForm medical and PHA forms into the Vazhs mobile app, replacing the current Vazhs template system. Forms will be loaded dynamically from a new StatForm backend API and submitted to Google Sheets via Google Apps Script.

## User Requirements Summary
- **Integration**: Load forms dynamically from StatForm backend (not bundled)
- **Submission**: Use StatForm's Google Apps Script (Google Sheets)
- **Migration**: Replace Vazhs forms completely with StatForm forms
- **Coverage**: All 14 forms (3 PHA + 11 medical forms)

## Key Insight from Exploration
The Vazhs mobile app already has a **comprehensive form rendering system** in `FillFormScreen.tsx` that supports:
- All necessary field types (text, number, email, phone, date, textarea, radio, checkbox, select, autocomplete, unitNumber, conditional, separator)
- Advanced conditional logic with `showIf` (all/any conditions)
- RTL support and Arabic numerals
- Draft auto-save
- Section-based rendering

**This means we don't need to rewrite the form renderer** - we just need to convert StatForm's Composer-based forms to the JSON format that FillFormScreen already understands!

---

## Implementation Phases

### Phase 1: StatForm Backend API (3-4 days)

Create a new Node.js/Express backend in StatForm to serve forms as JSON.

#### 1.1 Create API Server Structure
**Location**: `/Users/fayaa/MyProjects/StatForm/backend/`

Create:
- `backend/package.json` - Express server dependencies
- `backend/server.js` - Main Express app
- `backend/routes/forms.js` - Form routes
- `backend/routes/submit.js` - Submission handler
- `backend/converters/composerToMobile.js` - Core converter
- `backend/config.js` - Configuration (Google Script URL, etc.)

#### 1.2 API Endpoints to Implement

**GET /api/forms**
- Returns list of all 14 forms with metadata
- Response format:
```json
[
  {
    "id": "chest-pain",
    "name": { "en": "Chest Pain", "ar": "ألم الصدر" },
    "category": "internal-medicine",
    "theme": "personal",
    "slideCount": 32
  },
  ...
]
```

**GET /api/forms/:formId**
- Dynamically creates form using Composer
- Converts to Vazhs mobile JSON format
- Response format matches Vazhs `LocalTemplate` structure

**POST /api/submit**
- Accepts form submission from mobile app
- Forwards to Google Apps Script
- Returns success/error response

#### 1.3 Composer-to-Mobile Converter

**Critical file**: `backend/converters/composerToMobile.js`

**Field Type Mapping**:
| StatForm Composer | Vazhs Mobile | Conversion Notes |
|------------------|--------------|------------------|
| `textInput()` | `type: "text"` | Direct mapping |
| `numberInput()` | `type: "number"` | Direct mapping |
| `emailInput()` | `type: "email"` | Direct mapping |
| `telInput()` | `type: "phone"` | Direct mapping |
| `dateInput()` | `type: "date"` | Direct mapping |
| `choiceInput(single)` | `type: "radio"` | Convert `choices` to `options` array |
| `choiceInput(multiple)` | `type: "checkbox"` | Convert `choices` to `options` array |
| `selectBox()` | `type: "select"` | Convert `choices` to `options` array |
| `ratingInput()` | `type: "radio"` | Convert 1-5 scale to radio options |
| `pictureChoice()` | `type: "radio"` | Text labels only (skip images) |
| `fileInput()` | **SKIP** | Phase 2 feature |

**Slide-to-Section Conversion**:
- Each `composer.slide()` becomes a section in mobile
- Section title derived from first question or slide number
- All fields between slides grouped into one section
- Mobile app renders all sections in scrollable form (no pagination)

**Conditional Logic Translation**:
```javascript
// StatForm format
displayCondition: {
  conditions: [["gender", "equals", "Female"]],
  operator: "and"
}

// Converts to Vazhs format
showIf: {
  all: [
    { field: "gender", op: "equals", value: "Female" }
  ]
}
```

**Output Format** (matches Vazhs `LocalTemplate`):
```json
{
  "id": "chest-pain",
  "name": "ألم الصدر",
  "template_data": {
    "id": "chest-pain",
    "sections": [
      {
        "id": "section-1",
        "title": "معلومات أساسية",
        "fields": [
          {
            "id": "age",
            "type": "number",
            "label": "العمر",
            "required": true
          },
          {
            "id": "gender",
            "type": "radio",
            "label": "الجنس",
            "options": [
              { "value": "Male", "label": "ذكر" },
              { "value": "Female", "label": "أنثى" }
            ],
            "required": true
          }
        ]
      }
    ]
  }
}
```

---

### Phase 2: Mobile App Integration (4-5 days)

Update Vazhs mobile app to fetch from StatForm API instead of Vazhs backend.

#### 2.1 Create StatForm Service

**New file**: `/Users/fayaa/MyProjects/Vazhs/mobile-app/src/shared/services/statformService.ts`

```typescript
import { apiClient } from './apiClient';

const STATFORM_API_URL = 'http://localhost:3002/api'; // Dev
// const STATFORM_API_URL = 'https://statform-api.yourdomain.com/api'; // Prod

export const statformService = {
  // Fetch all forms
  async getAllForms() {
    const response = await fetch(`${STATFORM_API_URL}/forms`);
    return response.json();
  },

  // Fetch specific form with full field definitions
  async getForm(formId: string) {
    const response = await fetch(`${STATFORM_API_URL}/forms/${formId}`);
    return response.json();
  },

  // Submit form to Google Sheets
  async submitForm(formId: string, formData: any) {
    const response = await fetch(`${STATFORM_API_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formId, formData })
    });
    return response.json();
  }
};
```

#### 2.2 Update DataContext

**File to modify**: `/Users/fayaa/MyProjects/Vazhs/mobile-app/src/contexts/DataContext.tsx`

Changes:
- Add `loadStatFormTemplates()` method
- Replace `loadTemplates()` call with `loadStatFormTemplates()`
- Keep `createCase()` for backward compatibility with historical cases
- Add new `submitStatFormCase()` for StatForm submissions

```typescript
// New method in DataContext
const loadStatFormTemplates = async () => {
  if (!isOnline) {
    Alert.alert('خطأ', 'يلزم الاتصال بالإنترنت لتحميل النماذج');
    return;
  }

  try {
    setIsLoading(true);

    // Fetch form metadata from StatForm API
    const formList = await statformService.getAllForms();

    // Fetch full definitions for each form
    const templatesWithData = await Promise.all(
      formList.map(async (formMeta) => {
        const formDef = await statformService.getForm(formMeta.id);
        return {
          id: formMeta.id,
          name: formMeta.name.ar, // Default to Arabic
          template_data: formDef.template_data,
          sourceSystem: 'statform' as const,
          category: formMeta.category,
          theme: formMeta.theme,
        };
      })
    );

    // Cache in memory
    memoryStorage.setTemplates(templatesWithData);
    setTemplates(templatesWithData);

    console.log(`✅ Loaded ${templatesWithData.length} StatForm templates`);
  } catch (error) {
    console.error('Error loading StatForm templates:', error);
    Alert.alert('خطأ', 'فشل في تحميل النماذج');
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

#### 2.3 Update Types

**File to modify**: `/Users/fayaa/MyProjects/Vazhs/mobile-app/src/shared/types/index.ts`

Add:
```typescript
export interface LocalTemplate {
  id: string;
  name: string;
  template_data: TemplateData;
  sourceSystem?: 'vazhs' | 'statform'; // NEW
  category?: string; // NEW - medical category
  theme?: string; // NEW - pha or personal
  // ... existing fields
}
```

#### 2.4 Update FillFormScreen Submission

**File to modify**: `/Users/fayaa/MyProjects/Vazhs/mobile-app/src/screens/templates/FillFormScreen.tsx`

Changes in `handleSubmit()`:
```typescript
const handleSubmit = async () => {
  // ... validation code ...

  try {
    setIsSaving(true);

    const sanitizedFormData = sanitizeFormData(formData, allFields);

    // Check if this is a StatForm template
    if (template.sourceSystem === 'statform') {
      // Submit to Google Apps Script via StatForm API
      await statformService.submitForm(
        template.template_data.id,
        sanitizedFormData
      );
    } else {
      // Legacy: Submit to Vazhs backend
      await createCase({
        template_id: template.template_data.id,
        case_data: sanitizedFormData,
        // ... rest of case data
      });
    }

    // Delete draft after successful submission
    deleteDraft(draftKey);

    Alert.alert('تم الإرسال', 'تم إرسال النموذج بنجاح');
  } catch (error) {
    // ... error handling ...
  }
};
```

#### 2.5 Update TemplateListScreen

**File to modify**: `/Users/fayaa/MyProjects/Vazhs/mobile-app/src/screens/templates/TemplateListScreen.tsx`

Add category grouping for StatForm forms:
- Group by medical category (Internal Medicine, Surgery, etc.)
- Show form count per category
- Filter by PHA vs Personal theme

---

### Phase 3: Testing & Validation (3-4 days)

#### 3.1 Unit Testing
- Test converter with all 14 forms
- Verify field type mappings
- Test conditional logic conversion
- Test bilingual support (AR/EN)

#### 3.2 Integration Testing
- End-to-end flow: Fetch form → Render → Submit → Verify in Google Sheets
- Test all field types render correctly
- Test conditional fields show/hide properly
- Test draft saving
- Test offline error handling

#### 3.3 User Acceptance Testing
- Beta test with 5-10 medical users
- Test longest form (Epidemiology - 57 slides)
- Collect feedback on UX
- Fix bugs and edge cases

---

### Phase 4: Migration & Deployment (2-3 days)

#### 4.1 Data Migration Strategy
**Hard cutover approach**:

1. Deploy StatForm API to production server
2. Update mobile app to use StatForm API
3. Archive existing Vazhs templates (mark as `is_active: false`)
4. Keep existing cases in Vazhs DB for historical viewing
5. All new submissions go to Google Sheets

**Migration Steps**:
```sql
-- Archive Vazhs templates
UPDATE templates SET is_active = false WHERE source_system = 'vazhs';

-- Keep cases read-only (no code changes needed)
```

#### 4.2 Deployment Checklist
- [ ] Deploy StatForm API to production (e.g., Heroku, AWS, DigitalOcean)
- [ ] Configure environment variables (Google Script URL, CORS origins)
- [ ] Update mobile app API URL to production
- [ ] Build and deploy mobile app update (Expo/EAS)
- [ ] Test production end-to-end
- [ ] Monitor error rates and performance
- [ ] Announce to users

---

## Critical Files Summary

### New Files to Create (StatForm Backend)
1. **`/StatForm/backend/server.js`** - Express server entry point
2. **`/StatForm/backend/routes/forms.js`** - Form listing and retrieval endpoints
3. **`/StatForm/backend/routes/submit.js`** - Submission proxy to Google Apps Script
4. **`/StatForm/backend/converters/composerToMobile.js`** - Core converter logic
5. **`/StatForm/backend/package.json`** - Dependencies (express, cors, etc.)

### New Files to Create (Mobile App)
1. **`/Vazhs/mobile-app/src/shared/services/statformService.ts`** - StatForm API client

### Files to Modify (Mobile App)
1. **`/Vazhs/mobile-app/src/contexts/DataContext.tsx`** - Add StatForm template loading
2. **`/Vazhs/mobile-app/src/screens/templates/FillFormScreen.tsx`** - Update submission logic
3. **`/Vazhs/mobile-app/src/screens/templates/TemplateListScreen.tsx`** - Add category grouping
4. **`/Vazhs/mobile-app/src/shared/types/index.ts`** - Add sourceSystem field

---

## Technical Decisions

### Form Loading Strategy
- **Initial load**: Fetch all 14 form metadata on app start
- **On-demand**: Fetch full form definition when user taps a form
- **Caching**: Cache definitions in memory (session-only)
- **Future**: Store in AsyncStorage for offline access

### Language Support
- **Default**: Arabic (matching Vazhs audience)
- **API parameter**: `?lang=ar` or `?lang=en`
- **Mobile display**: Use Arabic labels by default

### Submission Flow
```
Mobile App → StatForm API /submit → Google Apps Script → Google Sheets
```

### Error Handling
- No internet → Show friendly error, don't crash
- API timeout → Retry with exponential backoff (max 3 retries)
- Form conversion error → Log warning, skip problematic field
- Submission failure → Save draft, allow retry

### Performance Targets
- Form metadata fetch: < 1 second
- Full form fetch: < 2 seconds
- Submission: < 5 seconds
- API uptime: > 99%

---

## Form Inventory (14 Forms)

**PHA Forms (3)**:
1. `epidemiology-form` (57 slides - longest)
2. `animal-assessment-form`
3. `entomology-form`

**Medical Forms (11)**:
4. `discharge-summary` (Patient General Assessment)
5. `soap-note` (Patient General Assessment)
6. `acute-abdomen` (General Surgery)
7. `chest-pain` (Internal Medicine - 32 slides)
8. `fever-unknown-origin` (Internal Medicine)
9. `cough-history` (Internal Medicine)
10. `dyspnea-history` (Internal Medicine)
11. `neurology-history` (Internal Medicine)
12. `depression-history` (Psychiatry)
13. `burnout-survey` (Psychiatry)
14. `pelvic-pain` (Obstetrics & Gynaecology)

---

## Success Criteria
- [ ] All 14 forms load and render correctly in mobile app
- [ ] All field types display properly (text, number, radio, checkbox, etc.)
- [ ] Conditional logic works (fields show/hide based on conditions)
- [ ] Submissions save successfully to Google Sheets (>95% success rate)
- [ ] Arabic RTL layout works correctly
- [ ] Draft auto-save works
- [ ] Beta users rate experience 4+/5 stars
- [ ] Zero data loss incidents
- [ ] API response time < 2 seconds
- [ ] Mobile app doesn't crash

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Field type conversion errors | High | Comprehensive testing with all 14 forms, manual review |
| Google Script rate limiting | Medium | Add retry logic, monitor submission rates |
| Complex conditional logic fails | High | Test all conditional fields, fallback to always-show |
| Large forms (57 slides) performance | Medium | Optimize rendering, use React.memo, lazy load sections |
| User adoption resistance | High | Training materials, gradual rollout, support channel |
| Data loss during migration | Critical | Keep Vazhs system running read-only, comprehensive backups |

---

## Timeline Estimate

- **Phase 1** (Backend API): 3-4 days
- **Phase 2** (Mobile Integration): 4-5 days
- **Phase 3** (Testing): 3-4 days
- **Phase 4** (Deployment): 2-3 days

**Total**: 12-16 days (2.5-3 weeks)

---

## Next Steps After Approval

1. Set up StatForm backend project structure
2. Implement core converter with 3 sample forms (ChestPain, Epidemiology, SOAP)
3. Test converter output matches Vazhs format
4. Create API endpoints and test with Postman
5. Integrate mobile app with dev API
6. Full testing cycle
7. Production deployment

---

## Notes

- The Vazhs mobile app's `FillFormScreen` is already production-ready and handles all field types we need
- No need to modify the form rendering logic - just provide the right JSON format
- StatForm's Composer API is well-structured and easy to parse
- Google Apps Script integration is already proven in StatForm web app
- Main complexity is the converter - everything else is straightforward API integration
