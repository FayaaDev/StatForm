# Form Creation Checklist

Use this checklist when adding a new form to the React Form Hub.

## Planning Phase

- [ ] Define the form's purpose and target audience
- [ ] Sketch out the form flow (what questions, in what order)
- [ ] Identify required vs optional fields
- [ ] Determine if conditional logic is needed
- [ ] Decide on submission endpoint (Google Sheets or custom)
- [ ] Plan multilingual content (English + Arabic minimum)

## Implementation Phase

### 1. Form Definition File

- [ ] Create file: `react-form-hub/src/forms/YourFormName.js`
- [ ] Import required utilities: `translate`, `getSharedFormConfig`
- [ ] Create composer function: `createYourFormComposer(localization)`
- [ ] Add Composer availability check: `if (!window.Composer)`
- [ ] Configure Composer with unique ID and shared config
- [ ] Set postUrl endpoint
- [ ] Add form header with `composer.h1()`
- [ ] Add start slide with localized button text
- [ ] Add all form slides with progress indicators
- [ ] Add all form fields with proper options
- [ ] Implement conditional logic (if needed)
- [ ] Add all translations (en + ar minimum)
- [ ] Export the composer function

### 2. Page Component

- [ ] Create file: `react-form-hub/src/pages/YourFormPage.jsx`
- [ ] Import dependencies: `useOutletContext`, `useEffect`, `useState`
- [ ] Import `FormRenderer` component
- [ ] Import `FormProgressBar` component
- [ ] Import `useFormController` hook
- [ ] Import your composer function and `getFormOptions`
- [ ] Get `currentLang` from outlet context
- [ ] Create state for `composer` and `options`
- [ ] Initialize `useFormController` with formId and currentLang
- [ ] Configure optional hotkeys if needed (e.g., Y/N shortcuts)
- [ ] Configure optional `onLastSlideNext` handler if needed
- [ ] Destructure hook returns: `setFormInstance`, `containerProps`, `activeSlideIndex`, `slides`, `jumpToSlide`
- [ ] Set up `useEffect` with `[currentLang]` dependency
- [ ] Create composer and options in useEffect
- [ ] Add loading state check
- [ ] Render `FormProgressBar` with required props
- [ ] Wrap `FormRenderer` in a div with `{...containerProps}`
- [ ] Pass `setFormInstance` to `FormRenderer` `onMount` prop
- [ ] Render `FormRenderer` with unique container ID (must match hook's formId)
- [ ] Export component as default

### 3. Routing Configuration

- [ ] Open `react-form-hub/src/App.jsx`
- [ ] Import your page component
- [ ] Add route inside HubLayout: `<Route path="..." element={<YourFormPage />} />`
- [ ] Verify path is unique and meaningful

### 4. Navigation Link

- [ ] Open `react-form-hub/src/layouts/HubLayout.jsx`
- [ ] Add `<Link>` component in navigation area
- [ ] Set `to` prop to match route path
- [ ] Add className for styling consistency
- [ ] Include both English and Arabic text based on `currentLang`
- [ ] Verify link appears in correct navigation position

## Testing Phase

### Local Development

- [ ] Run `cd react-form-hub && npm run dev`
- [ ] Navigate to your form via the URL
- [ ] Click navigation link to verify it works

### Form Functionality

- [ ] Form loads without console errors
- [ ] All fields render correctly
- [ ] Field validation works (required fields, email format, etc.)
- [ ] Progress indicators display correctly
- [ ] **Progress bar** displays at top with correct number of steps
- [ ] **Progress bar** updates active step as you navigate
- [ ] **Progress bar** allows clicking to jump to different slides
- [ ] **Progress bar** auto-scrolls to keep active step visible
- [ ] **Progress bar** scroll arrows work when steps overflow
- [ ] Start button works (if using one)
- [ ] Navigation between slides works (Next/Previous)
- [ ] Keyboard navigation works (Enter to advance)
- [ ] **Custom hotkeys work** (if configured, e.g., Y/N)
- [ ] Default A-Z hotkeys work for choice inputs (if not overridden)
- [ ] **Last slide Next button** behaves correctly (removed or custom handler triggers)
- [ ] Conditional fields show/hide correctly
- [ ] Conditional slides skip correctly (if using jumpCondition)
- [ ] Submit button appears on final slide (if applicable)
- [ ] Form submission works (check endpoint receives data)

### Internationalization

- [ ] Toggle to Arabic - form recreates correctly
- [ ] All text displays in Arabic (no English fallbacks showing)
- [ ] RTL layout works properly (text aligns right)
- [ ] Toggle back to English - form recreates correctly
- [ ] Form state persists across language changes (if expected)

### Responsive Design

- [ ] Test on desktop (full width)
- [ ] Test on tablet (medium width)
- [ ] Test on mobile (narrow width)
- [ ] All buttons are clickable
- [ ] All fields are accessible

### Edge Cases

- [ ] Try submitting without required fields - validation prevents it
- [ ] Try invalid email - validation catches it
- [ ] Try clicking browser back button - form handles it gracefully
- [ ] Try refreshing page - form reloads correctly
- [ ] Check console for any warnings or errors

## Code Quality

- [ ] No console errors or warnings
- [ ] Code follows existing patterns in the codebase
- [ ] All user-facing text is localized
- [ ] No hardcoded strings (use translate utility)
- [ ] Consistent spacing and formatting
- [ ] Comments added for complex logic
- [ ] No unused imports or variables

## Documentation (if needed)

- [ ] Update project README if form is significant
- [ ] Add form to list of examples/demos
- [ ] Document any special configuration or setup

## Deployment Preparation

- [ ] Run `npm run build` in react-form-hub - no errors
- [ ] Test production build with `npm run preview`
- [ ] Verify form works in production mode
- [ ] If using Google Sheets: verify script URL is correct
- [ ] If using custom endpoint: verify endpoint is deployed and accessible

## Post-Launch

- [ ] Monitor form submissions
- [ ] Verify data arrives in expected format
- [ ] Check for any user-reported issues
- [ ] Collect feedback for improvements

---

## Quick Command Reference

```bash
# Development
cd react-form-hub
npm run dev

# Build
cd react-form-hub
npm run build

# Preview production
cd react-form-hub
npm run preview

# Lint
cd react-form-hub
npm run lint
```

## Common Issues Quick Fix

**Form doesn't show:** Check browser console, verify Composer is loaded

**Language toggle broken:** Check useEffect dependency array has `[currentLang]`

**Conditional logic not working:** Verify field names and condition syntax exactly match

**RTL issues:** Ensure proper CSS import and `dir` property in Composer config

**Validation not working:** Check `required: true` is set and field type matches input type
