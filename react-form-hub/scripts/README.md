# Form Creation Scripts

Automation scripts for creating feedback forms in the PHA theme.

## Scripts

### `create-feedback-form.js`

Creates a single feedback form with all necessary configuration.

**Usage:**
```bash
node scripts/create-feedback-form.js <formNumber> <titleEn> <titleAr>
```

**Example:**
```bash
node scripts/create-feedback-form.js 3 "Evaluation Tool 3" "أداة تقييم 3"
```

**What it does:**
1. Creates a new page component in `src/pages/FeedbackForm{N}Page.jsx`
2. Adds the form to `src/config/formRegistry.js`
3. Adds the import and route to `src/App.jsx`

### `create-multiple-forms.sh`

Creates multiple feedback forms at once.

**Usage:**
```bash
chmod +x scripts/create-multiple-forms.sh
./scripts/create-multiple-forms.sh
```

**Customization:**
Edit the `forms` array in the script to define which forms to create:
```bash
forms=(
	"3|Evaluation Tool 3|أداة تقييم 3"
	"4|Evaluation Tool 4|أداة تقييم 4"
	# Add more forms...
)
```

## After Running Scripts

After running these scripts, you still need to:

1. **Create the actual form files** in `src/forms/`:
   - `FeedbackForm-3.js`
   - `FeedbackForm-4.js`
   - etc.

2. Each form file should export `createFeedbackFormComposer(localization, theme)`:
   ```javascript
   export function createFeedbackFormComposer(localization = "en", theme) {
       const composer = new window.Composer({
           id: "tool3_operations",
           // ... form configuration
       });
       
       // Build your form with composer methods
       
       return composer;
   }
   ```

3. Update the form titles in `create-multiple-forms.sh` if you want different names

## Example Workflow

```bash
# Create forms 3-17 all at once
./scripts/create-multiple-forms.sh

# Or create them one by one
node scripts/create-feedback-form.js 3 "Vector Control Assessment" "تقييم مكافحة النواقل"
node scripts/create-feedback-form.js 4 "Epidemiological Response" "الاستجابة الوبائية"
node scripts/create-feedback-form.js 5 "Animal Health Monitoring" "مراقبة الصحة الحيوانية"
```

## Notes

- Forms are automatically added to the PHA theme
- Routes follow the pattern: `/pha/tool{N}_operations`
- Form IDs follow the pattern: `tool{N}_operations`
- Page components follow the pattern: `FeedbackForm{N}Page`
