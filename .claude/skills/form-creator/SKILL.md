---
name: form-creator
description: Guide for creating new forms in the React Form Hub following established patterns. References Forms.md documentation for field types and features.
---

# FormCreator - React Form Hub Pattern Guide

## When to Use This Skill

Use this skill when you need to:

- Add a new form to the React Form Hub application (`react-form-hub/`)
- Follow established patterns for form creation with proper localization
- Ensure consistent theming and styling across all forms
- Integrate forms with Google Sheets or custom endpoints
- Understand Forms.md field types and configuration options

## Quick Reference

### Supporting Files in This Skill Directory

- **`template-form.js`** - Copy-paste ready form template to start new forms
- **`checklist.md`** - Complete checklist for creating and testing forms
- **`common-patterns.md`** - Reusable code snippets for common scenarios

### External Resources

- **Forms.md Documentation:** https://docs.forms.md/
- **React Hub README:** `react-form-hub/README_FORM_HUB.md`
- **Library Override Guide:** `react-form-hub/LIBRARY_HACK_GUIDE.md` - Technical details on how useFormController works
- **Example Forms:** `react-form-hub/src/forms/DemoForm.js`, `FeedbackForm.js`, `TesterForm.js`

## React Form Hub Architecture

The React Form Hub is a multi-language form application with:

- English & Arabic support with RTL layout switching
- Consistent theming across all forms
- Shared form configuration and options
- React Router-based navigation

### Project Structure

```
react-form-hub/src/
├── components/
│   └── FormRenderer.jsx      # Reusable Forms.md wrapper component
├── forms/
│   ├── DemoForm.js           # Example form definitions
│   ├── FeedbackForm.js
│   ├── TesterForm.js
│   └── formUtils.js          # Shared utilities and settings
├── layouts/
│   └── HubLayout.jsx         # Main layout with navigation & language toggle
├── pages/
│   ├── HomePage.jsx          # Landing page
│   ├── DemoFormPage.jsx      # Individual form pages
│   ├── FeedbackFormPage.jsx
│   └── TesterFormPage.jsx
├── utils/
│   └── translate.js          # Translation utility function
└── App.jsx                   # Routing configuration
```

## Step-by-Step: Creating a New Form

Follow these steps in order to add a new form to the React Form Hub.

### Step 1: Create Form Definition

Create a new file in `react-form-hub/src/forms/YourFormName.js`:

```javascript
import { Composer } from "formsmd";
import { translate } from "../utils/translate.js";
import { getSharedFormConfig } from "./formUtils.js";

export function createYourFormComposer(localization = "en") {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "your-form-id",
		...getSharedFormConfig(localization),
		postUrl: "YOUR_ENDPOINT_URL", // Or use GOOGLE_SCRIPT_URL from formUtils
	});

	// Add form header
	composer.h1(
		translate(localization, {
			en: "Your Form Title",
			ar: "عنوان النموذج",
		}),
	);

	// Optional: Add introductory paragraph
	composer.p(
		translate(localization, {
			en: "Brief description of this form",
			ar: "وصف موجز لهذا النموذج",
		}),
	);

	// Add your form fields with progress indicators
	composer.slide({ pageProgress: "1/3" });
	composer.textInput("fieldName", {
		question: translate(localization, {
			en: "Your question?",
			ar: "سؤالك؟",
		}),
		required: true,
	});

	// Add more slides and fields as needed
	composer.slide({ pageProgress: "2/3" });
	// ... more fields

	composer.slide({ pageProgress: "3/3" });
	// ... final fields

	return composer;
}
```

**Key Points:**

- Always check `if (!window.Composer)` before creating
- Use `getSharedFormConfig(localization)` for consistent theming
- Use `translate()` for all user-facing text
- Include progress indicators: `pageProgress: "1/3"`, `pageProgress: "2/3"`, etc.

### Step 2: Create Page Component

Create `react-form-hub/src/pages/YourFormPage.jsx`:

```javascript
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import FormProgressBar from "../components/FormProgressBar";
import { createYourFormComposer } from "../forms/YourFormName.js";
import { getFormOptions } from "../forms/formUtils.js";
import { useFormController } from "../hooks/useFormController.js";

const YourFormPage = () => {
	const { currentLang } = useOutletContext();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	// NEW: Initialize the form controller hook
	const {
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide
	} = useFormController({
		formId: "your-form-container",
		currentLang: currentLang,

		// Optional: Custom hotkeys for quick navigation
		hotkeys: {
			y: { en: "Yes", ar: "نعم" },
			n: { en: "No", ar: "لا" }
		},

		// Optional: Custom handler for last slide's Next button
		onLastSlideNext: (e, lastSlide) => {
			alert("Form completed!");
			// Add your custom completion logic here
		}
	});

	useEffect(() => {
		const newComposer = createYourFormComposer(currentLang);
		const newOptions = getFormOptions(currentLang);

		setComposer(newComposer);
		setOptions(newOptions);
	}, [currentLang]);

	if (!composer || !options) {
		return <div>Loading...</div>;
	}

	const totalSlides = slides.length;

	return (
		<>
			{/* NEW: Progress bar component */}
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={totalSlides}
				excludeStart={0}  // Number of intro slides to exclude
				excludeEnd={0}    // Number of final slides to exclude
				onStepClick={jumpToSlide}
				currentLang={currentLang}
			/>

			{/* Form container with controller props */}
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="your-form-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default YourFormPage;
```

**Key Points:**

- **Import `useFormController`** - This hook manages form lifecycle, keyboard shortcuts, and button behavior
- **Import `FormProgressBar`** - Shows numbered progress circles at the top
- **Spread `{...containerProps}`** on the wrapping div - Prevents keyboard events from interfering with text inputs
- **Pass `setFormInstance` to `onMount`** - Connects the form instance to the controller
- **Optional hotkeys** - Define keyboard shortcuts for common choices (e.g., Y/N)
- **Optional `onLastSlideNext`** - Customize what happens when clicking Next on the last slide
- **Progress bar integration** - Shows user's position in the form with clickable navigation

### Step 3: Add Route

Open `react-form-hub/src/App.jsx` and add the import and route:

```javascript
import YourFormPage from "./pages/YourFormPage";

// Inside the <Routes> component, within the HubLayout route:
<Route path="your-form" element={<YourFormPage />} />;
```

### Step 4: Add Navigation Link

Open `react-form-hub/src/layouts/HubLayout.jsx` and add a navigation link:

```javascript
<Link to="/your-form" className="nav-link">
	{currentLang === "ar" ? "النموذج الخاص بك" : "Your Form"}
</Link>
```

**Key Points:**

- Add both English and Arabic text
- Use consistent className for styling
- Path should match the route from Step 3

## Forms.md Field Types Reference

See https://docs.forms.md/ for complete documentation on:

### Text-Based Inputs

- `textInput(name, options)` - Single-line text
- `textareaInput(name, options)` - Multi-line text
- `emailInput(name, options)` - Email with validation
- `urlInput(name, options)` - URL with validation
- `numberInput(name, options)` - Numeric input
- `phoneInput(name, options)` - Phone number with country codes

### Selection Inputs

- `choiceInput(name, options)` - Radio buttons (single choice)
- `checkboxInput(name, options)` - Checkboxes (multiple choices)
- `selectBox(name, options)` - Dropdown select
- `ratingInput(name, options)` - Star rating
- `opinionScaleInput(name, options)` - Numeric scale (e.g., 1-10)

### Date and Time

- `dateInput(name, options)` - Date picker
- `timeInput(name, options)` - Time picker
- `dateTimeInput(name, options)` - Combined date and time

### Other Field Types

- `fileInput(name, options)` - File upload
- `matrixInput(name, options)` - Grid/matrix of questions

### Content Elements

- `h1(text)`, `h2(text)`, `h3(text)` - Headings
- `p(text)` - Paragraph text
- `image(src, options)` - Images
- `video(src, options)` - Videos

## Common Field Options

All field types support these common options:

```javascript
{
  question: "The question text",
  description: "Additional help text",
  required: true,                    // Make field required
  fieldSize: "sm",                   // Size: "sm" or default
  labelStyle: "classic",             // Label style: "classic" or default
  subfield: true,                    // Indent as subfield
  disabled: true,                    // Disable field
  autofocus: true,                   // Auto-focus on load

  // Conditional display
  displayCondition: {
    dependencies: ["otherFieldName"],
    condition: "otherFieldName == 'value'"
  },

  // CSS customization
  id: "custom-id",
  classNames: ["custom-class"],
  attrs: [{ name: "data-custom", value: "value" }]
}
```

## Keyboard Navigation & Shortcuts

The form runner includes built-in keyboard shortcuts for better accessibility and speed:

- **Enter Key**: Advances to the next slide or submits the form (unless focused on a textarea or button).
- **Choice Hotkeys (A-Z)**: For single-choice questions (radio buttons), pressing keys 'A', 'B', 'C', etc., will automatically select the corresponding option.
  - Hints (A, B, C...) are automatically displayed next to options.

### Custom Shortcuts (e.g., Yes/No)

For specific forms (like Yes/No questionnaires), you can override the default A/B shortcuts with custom keys (e.g., Y/N). This requires updating the core library files:

1.  **Assign a unique ID** to your form in the composer config (e.g., `id: "my-yes-no-form"`).
2.  **Update `src/main.js`**: Add a check for your form ID in the keydown listener to map custom keys (Y/N) to choice indices (0/1).
3.  **Update `src/form-field-create.js`**: Add a check for your form ID to display the corresponding visual hints (Y/N) instead of A/B.


## Slide Control

Use `composer.slide(options)` to create multi-step forms:

```javascript
// Regular slide with progress
composer.slide({
	pageProgress: "1/3", // Show progress
	jumpCondition: "field == 'value'", // Conditional jump (skip if false)
});

// Note: Start slides are NOT used in this project - forms begin directly with the first question slide
// Final slide (usually auto-generated for submit)
```

## Form Controller Hook (`useFormController`)

The `useFormController` hook provides advanced form control capabilities, implementing the "Nuclear Option" strategy to override the library's built-in behaviors.

### What It Does

The hook uses a **MutationObserver** to watch the form DOM and:
- **Tracks active slides** - Monitors which slide is currently displayed
- **Manages button behavior** - Removes or replaces the "Next" button on the last slide
- **Enables hotkeys** - Allows custom keyboard shortcuts for choices
- **Prevents event conflicts** - Stops keyboard events from interfering with text inputs

### Hook Parameters

```javascript
const {
	formInstance,        // The Forms.md instance
	setFormInstance,     // Function to connect form instance (pass to onMount)
	containerProps,      // Props to spread on wrapper div
	activeSlideIndex,    // Current slide index (0-based)
	slides,              // Array of all slide DOM elements
	jumpToSlide          // Function to navigate to specific slide
} = useFormController({
	formId: "my-form-container",  // REQUIRED: Must match FormRenderer id
	currentLang: "en",             // REQUIRED: Current language ("en" or "ar")

	// OPTIONAL: Custom keyboard shortcuts
	hotkeys: {
		y: { en: "Yes", ar: "نعم" },
		n: { en: "No", ar: "لا" }
	},

	// OPTIONAL: Custom handler for last slide's Next button
	onLastSlideNext: (e, lastSlide) => {
		// Your completion logic here
		console.log("Form finished!");
	}
});
```

### Integration Checklist

1. ✅ Import the hook: `import { useFormController } from "../hooks/useFormController.js"`
2. ✅ Call hook with matching `formId`
3. ✅ Spread `{...containerProps}` on parent div
4. ✅ Pass `setFormInstance` to `FormRenderer` `onMount` prop
5. ✅ Use `activeSlideIndex` and `slides` for progress tracking

### Hotkey System

Custom hotkeys override the default A/B/C choice navigation:

```javascript
hotkeys: {
	y: { en: "Yes", ar: "نعم" },     // Press 'Y' to select "Yes"
	n: { en: "No", ar: "لا" },       // Press 'N' to select "No"
	s: { en: "Sometimes", ar: "أحيانًا" }  // Press 'S' for "Sometimes"
}
```

**How it works:**
- When user presses the key, the hook finds the label containing that text
- Automatically clicks the corresponding input
- Works across language changes

### Last Slide Customization

By default, the hook removes the "Next" button on the last slide. To customize:

```javascript
onLastSlideNext: (e, lastSlide) => {
	e.preventDefault();  // Prevent default navigation

	// Show completion message
	alert("Thank you for completing the form!");

	// Redirect to another page
	window.location.href = "/thank-you";

	// Or trigger custom logic
	saveFormData();
}
```

## Progress Bar Component (`FormProgressBar`)

The `FormProgressBar` component displays a fixed navigation bar at the top of the page with numbered circles representing each form slide.

### Features

- **Numbered circles** - Shows step numbers (1, 2, 3...)
- **Visual states** - Completed (filled), Active (highlighted), Pending (outline)
- **Clickable navigation** - Jump to any slide by clicking its circle
- **Auto-scrolling** - Automatically scrolls to keep active step visible
- **Scroll arrows** - Navigate overflowed steps with left/right arrows
- **RTL support** - Works correctly in Arabic mode

### Component Props

```javascript
<FormProgressBar
	currentSlideIndex={activeSlideIndex}  // Current slide (from useFormController)
	totalSlides={slides.length}           // Total number of slides
	excludeStart={0}                      // Skip first N slides (e.g., intro)
	excludeEnd={0}                        // Skip last N slides (e.g., thank you)
	onStepClick={jumpToSlide}             // Navigation handler (from useFormController)
	currentLang={currentLang}             // Current language for labels
/>
```

### Excluding Slides from Progress

If your form has non-question slides (intro, thank you page), exclude them:

```javascript
// Form structure: [intro] [Q1] [Q2] [Q3] [thank you]
<FormProgressBar
	currentSlideIndex={activeSlideIndex}
	totalSlides={slides.length}
	excludeStart={1}  // Skip the intro slide
	excludeEnd={1}    // Skip the thank you slide
	onStepClick={jumpToSlide}
	currentLang={currentLang}
/>
// Progress bar will show: 1, 2, 3 (for Q1, Q2, Q3 only)
```

### Styling

The progress bar is fixed at the top with:
- Background: `rgba(255, 255, 255, 0.95)` with backdrop blur
- Active color: `#09595c` (PHA teal)
- Height: Auto (approximately 60px with padding)
- Z-index: 900 (above form content)

**Note:** Ensure your form content has sufficient top padding (100px recommended) to avoid overlapping with the fixed progress bar.

## Shared Configuration

All forms in the React Form Hub use shared configuration from `formUtils.js`:

**Theme Colors:**

- Accent: `#09595C` (teal)
- Accent Foreground: `#ffffff` (white)
- Background: `#ffffff` (white)
- Text Color: `#063E40` (dark teal)

**Form Settings:**

- Style: `conversational` (one question per slide)
- Font Size: `lg` (large)
- Rounded corners: `pill` (fully rounded buttons)
- Restart button: `show`
- Button alignment: `end`
- Padding: Top 100px, Bottom 80px

To modify these globally, edit `getSharedFormConfig()` in `formUtils.js`.

## Localization Pattern

Always use the `translate()` utility for all user-facing text:

```javascript
import { translate } from "../utils/translate.js";

// For field questions
question: translate(localization, {
	en: "What is your name?",
	ar: "ما اسمك؟",
});

// For choices
choices: [
	translate(localization, { en: "Option 1", ar: "الخيار 1" }),
	translate(localization, { en: "Option 2", ar: "الخيار 2" }),
];

// For button text
buttonText: translate(localization, { en: "Continue", ar: "استمر" });
```

## Google Sheets Integration

To connect forms to Google Sheets:

1. Follow setup instructions in `demo/GOOGLE_SHEETS_SETUP.md`
2. Deploy the Google Apps Script from `google-apps-script/Code.js`
3. Update the script URL in your form definition:

```javascript
import { GOOGLE_SCRIPT_URL } from "./formUtils.js";

const composer = new window.Composer({
	id: "your-form",
	postUrl: GOOGLE_SCRIPT_URL,
	// ... other config
});
```

## Conditional Logic

### Display Conditions

Show/hide fields based on other field values:

```javascript
composer.textInput("otherPosition", {
	question: "Please specify",
	displayCondition: {
		dependencies: ["position"],
		condition: "position == 'Other'",
	},
});
```

### Jump Conditions

Skip entire slides based on conditions:

```javascript
composer.slide({
	jumpCondition: "referralSource == 'Recommendation'",
	pageProgress: "3/4",
});
// This slide only shows if referralSource equals 'Recommendation'
```

## Validation

Forms.md provides built-in validation:

- `emailInput()` - Valid email format
- `urlInput()` - Valid URL format
- `phoneInput()` - Valid phone number
- `required: true` - Field must be filled
- Custom validation via `pattern` attribute (see Forms.md docs)

## Testing New Forms

After creating a new form:

```bash
cd react-form-hub
npm run dev
```

Test checklist:

- Form loads without errors
- All fields display correctly
- Language toggle works (EN/AR)
- RTL layout works properly in Arabic
- Navigation progresses correctly
- Conditional logic works as expected
- Form submits successfully
- Validation works on required fields

## Common Patterns

### Multi-Choice with "Other" Option

```javascript
composer.choiceInput("category", {
	question: translate(lang, { en: "Select category", ar: "اختر الفئة" }),
	choices: [
		translate(lang, { en: "Option 1", ar: "الخيار 1" }),
		translate(lang, { en: "Option 2", ar: "الخيار 2" }),
		translate(lang, { en: "Other", ar: "أخرى" }),
	],
	required: true,
});

composer.slide({ pageProgress: "2/3" });

composer.textInput("categoryOther", {
	question: translate(lang, { en: "Please specify", ar: "يرجى التحديد" }),
	required: true,
	displayCondition: {
		dependencies: ["category"],
		condition:
			"category == '" + translate(lang, { en: "Other", ar: "أخرى" }) + "'",
	},
});
```

### Progressive Disclosure

```javascript
// Main question
composer.choiceInput("hasExperience", {
	question: translate(lang, {
		en: "Do you have experience?",
		ar: "هل لديك خبرة؟",
	}),
	choices: [
		translate(lang, { en: "Yes", ar: "نعم" }),
		translate(lang, { en: "No", ar: "لا" }),
	],
});

// Only show if "Yes"
composer.slide({
	jumpCondition:
		"hasExperience == '" + translate(lang, { en: "Yes", ar: "نعم" }) + "'",
	pageProgress: "2/3",
});

composer.numberInput("yearsExperience", {
	question: translate(lang, {
		en: "Years of experience?",
		ar: "سنوات الخبرة؟",
	}),
});
```

## Troubleshooting

**Problem:** Form doesn't render

- Check browser console for errors
- Verify `window.Composer` is loaded
- Ensure all translate() calls have both languages

**Problem:** Language toggle doesn't work

- Verify `useEffect` dependency includes `[currentLang]`
- Check that form recreates on language change

**Problem:** RTL layout issues

- Ensure correct CSS is imported in `index.html`
- Verify `dir` property is set in Composer config

**Problem:** Conditional logic not working

- Check field name spelling in dependencies
- Verify condition syntax matches field values exactly
- Use browser DevTools to inspect form data

For more troubleshooting, see: https://docs.forms.md/

## Resources

- **Forms.md Official Docs:** https://docs.forms.md/
- **API Reference:** https://docs.forms.md/api/
- **Examples in this repo:**
  - `react-form-hub/src/forms/DemoForm.js`
  - `react-form-hub/src/forms/FeedbackForm.js`
  - `react-form-hub/src/forms/TesterForm.js`
- **Google Sheets Setup:** `demo/GOOGLE_SHEETS_SETUP.md`
