# Common Form Patterns

Copy-paste ready code snippets for frequently used form patterns.

## Table of Contents

1. [Multi-Choice with "Other" Option](#multi-choice-with-other-option)
2. [Yes/No with Follow-up Questions](#yesno-with-follow-up-questions)
3. [Progressive Disclosure](#progressive-disclosure)
4. [Contact Information Block](#contact-information-block)
5. [Rating and Feedback](#rating-and-feedback)
6. [Date Range Selection](#date-range-selection)
7. [Multi-Select with Minimum/Maximum](#multi-select-with-minimummaximum)
8. [Conditional Skip Slide](#conditional-skip-slide)
9. [File Upload with Instructions](#file-upload-with-instructions)
10. [Matrix Questions](#matrix-questions)

---

## Multi-Choice with "Other" Option

Allows user to select from predefined options or specify their own.

```javascript
composer.slide({ pageProgress: "1/3" });

composer.choiceInput("position", {
	question: translate(localization, {
		en: "What's your position?",
		ar: "ما هو منصبك؟",
	}),
	choices: [
		translate(localization, { en: "Product Manager", ar: "مدير المنتج" }),
		translate(localization, { en: "Software Engineer", ar: "مهندس برمجيات" }),
		translate(localization, { en: "Designer", ar: "مصمم" }),
		translate(localization, { en: "Other", ar: "أخرى" }),
	],
	required: true,
});

// Show text input only if "Other" is selected
composer.textInput("positionOther", {
	question: translate(localization, {
		en: "Please specify your position",
		ar: "يرجى تحديد منصبك",
	}),
	required: true,
	displayCondition: {
		dependencies: ["position"],
		condition: `position == '${translate(localization, { en: "Other", ar: "أخرى" })}'`,
	},
});
```

---

## Yes/No with Follow-up Questions

Shows different follow-up questions based on Yes/No response.

```javascript
composer.slide({ pageProgress: "1/4" });

composer.choiceInput("hasExperience", {
	question: translate(localization, {
		en: "Do you have prior experience?",
		ar: "هل لديك خبرة سابقة؟",
	}),
	choices: [
		translate(localization, { en: "Yes", ar: "نعم" }),
		translate(localization, { en: "No", ar: "لا" }),
	],
	required: true,
});

// Only show this slide if "Yes"
composer.slide({
	jumpCondition: `hasExperience == '${translate(localization, { en: "Yes", ar: "نعم" })}'`,
	pageProgress: "2/4",
});

composer.numberInput("yearsExperience", {
	question: translate(localization, {
		en: "How many years of experience?",
		ar: "كم سنة من الخبرة؟",
	}),
	required: true,
});

composer.textareaInput("experienceDetails", {
	question: translate(localization, {
		en: "Please describe your experience",
		ar: "يرجى وصف خبرتك",
	}),
});
```

---

## Progressive Disclosure

Reveals more fields as user progresses.

```javascript
composer.slide({ pageProgress: "1/5" });

composer.choiceInput("interestedIn", {
	question: translate(localization, {
		en: "What are you interested in?",
		ar: "ما الذي يهمك؟",
	}),
	choices: [
		translate(localization, { en: "Product Demo", ar: "عرض توضيحي للمنتج" }),
		translate(localization, { en: "Partnership", ar: "شراكة" }),
		translate(localization, { en: "Support", ar: "الدعم" }),
	],
	required: true,
});

// Demo-specific questions (only show if "Product Demo" selected)
composer.slide({
	jumpCondition: `interestedIn == '${translate(localization, { en: "Product Demo", ar: "عرض توضيحي للمنتج" })}'`,
	pageProgress: "2/5",
});

composer.textInput("companyName", {
	question: translate(localization, {
		en: "What's your company name?",
		ar: "ما اسم شركتك؟",
	}),
	required: true,
});

composer.numberInput("teamSize", {
	question: translate(localization, {
		en: "How large is your team?",
		ar: "ما حجم فريقك؟",
	}),
	required: true,
});

// Partnership-specific questions (only show if "Partnership" selected)
composer.slide({
	jumpCondition: `interestedIn == '${translate(localization, { en: "Partnership", ar: "شراكة" })}'`,
	pageProgress: "3/5",
});

composer.textInput("partnershipType", {
	question: translate(localization, {
		en: "What type of partnership are you interested in?",
		ar: "ما نوع الشراكة التي تهتم بها؟",
	}),
	required: true,
});
```

---

## Contact Information Block

Standard contact information fields.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.h2(
	translate(localization, {
		en: "Contact Information",
		ar: "معلومات الاتصال",
	}),
);

composer.textInput("fullName", {
	question: translate(localization, {
		en: "Full Name",
		ar: "الاسم الكامل",
	}),
	required: true,
});

composer.emailInput("email", {
	question: translate(localization, {
		en: "Email Address",
		ar: "عنوان البريد الإلكتروني",
	}),
	description: translate(localization, {
		en: "We'll never share your email with anyone else",
		ar: "لن نشارك بريدك الإلكتروني مع أي شخص آخر",
	}),
	required: true,
});

composer.phoneInput("phone", {
	question: translate(localization, {
		en: "Phone Number",
		ar: "رقم الهاتف",
	}),
	required: false,
});

composer.textInput("company", {
	question: translate(localization, {
		en: "Company Name",
		ar: "اسم الشركة",
	}),
	required: false,
});
```

---

## Rating and Feedback

Collect ratings and optional feedback.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.ratingInput("satisfaction", {
	question: translate(localization, {
		en: "How satisfied are you with our service?",
		ar: "ما مدى رضاك عن خدمتنا؟",
	}),
	max: 5,
	required: true,
});

composer.opinionScaleInput("likelihood", {
	question: translate(localization, {
		en: "How likely are you to recommend us to a friend?",
		ar: "ما مدى احتمالية أن توصي بنا لصديق؟",
	}),
	min: 0,
	max: 10,
	minLabel: translate(localization, { en: "Not likely", ar: "غير محتمل" }),
	maxLabel: translate(localization, { en: "Very likely", ar: "محتمل جدًا" }),
	required: true,
});

composer.slide({ pageProgress: "2/2" });

composer.textareaInput("feedback", {
	question: translate(localization, {
		en: "What can we do to improve?",
		ar: "ما الذي يمكننا فعله للتحسين؟",
	}),
	description: translate(localization, {
		en: "Your feedback helps us serve you better",
		ar: "ملاحظاتك تساعدنا على خدمتك بشكل أفضل",
	}),
	required: false,
});
```

---

## Date Range Selection

Select start and end dates.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.dateInput("startDate", {
	question: translate(localization, {
		en: "Start Date",
		ar: "تاريخ البدء",
	}),
	required: true,
});

composer.dateInput("endDate", {
	question: translate(localization, {
		en: "End Date",
		ar: "تاريخ الانتهاء",
	}),
	description: translate(localization, {
		en: "Must be after start date",
		ar: "يجب أن يكون بعد تاريخ البدء",
	}),
	required: true,
});
```

---

## Multi-Select with Minimum/Maximum

Allow selecting multiple items from a list.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.checkboxInput("interests", {
	question: translate(localization, {
		en: "What are your interests? (Select all that apply)",
		ar: "ما هي اهتماماتك؟ (حدد كل ما ينطبق)",
	}),
	choices: [
		translate(localization, { en: "Technology", ar: "التكنولوجيا" }),
		translate(localization, { en: "Design", ar: "التصميم" }),
		translate(localization, { en: "Marketing", ar: "التسويق" }),
		translate(localization, { en: "Sales", ar: "المبيعات" }),
		translate(localization, { en: "Finance", ar: "المالية" }),
	],
	required: true,
});
```

---

## Conditional Skip Slide

Skip entire slides based on conditions.

```javascript
composer.slide({ pageProgress: "1/4" });

composer.choiceInput("userType", {
	question: translate(localization, {
		en: "Are you a new or existing customer?",
		ar: "هل أنت عميل جديد أم حالي؟",
	}),
	choices: [
		translate(localization, { en: "New Customer", ar: "عميل جديد" }),
		translate(localization, { en: "Existing Customer", ar: "عميل حالي" }),
	],
	required: true,
});

// Only show to new customers
composer.slide({
	jumpCondition: `userType == '${translate(localization, { en: "New Customer", ar: "عميل جديد" })}'`,
	pageProgress: "2/4",
});

composer.textInput("referralSource", {
	question: translate(localization, {
		en: "How did you hear about us?",
		ar: "كيف سمعت عنا؟",
	}),
	required: true,
});

// Only show to existing customers
composer.slide({
	jumpCondition: `userType == '${translate(localization, { en: "Existing Customer", ar: "عميل حالي" })}'`,
	pageProgress: "3/4",
});

composer.textInput("accountId", {
	question: translate(localization, {
		en: "What's your account ID?",
		ar: "ما هو معرف حسابك؟",
	}),
	required: true,
});
```

---

## File Upload with Instructions

Upload files with clear instructions.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.h2(
	translate(localization, {
		en: "Document Upload",
		ar: "تحميل المستند",
	}),
);

composer.p(
	translate(localization, {
		en: "Please upload your resume (PDF or Word format, max 5MB)",
		ar: "يرجى تحميل سيرتك الذاتية (تنسيق PDF أو Word، بحد أقصى 5 ميجابايت)",
	}),
);

composer.fileInput("resume", {
	question: translate(localization, {
		en: "Resume",
		ar: "السيرة الذاتية",
	}),
	required: true,
});

composer.fileInput("coverLetter", {
	question: translate(localization, {
		en: "Cover Letter (optional)",
		ar: "خطاب التقديم (اختياري)",
	}),
	required: false,
});
```

---

## Matrix Questions

Ask multiple questions with the same scale.

```javascript
composer.slide({ pageProgress: "1/2" });

composer.h2(
	translate(localization, {
		en: "Rate Our Service",
		ar: "قيم خدمتنا",
	}),
);

const serviceAspects = [
	{ en: "Response Time", ar: "وقت الاستجابة", field: "ratingResponseTime" },
	{ en: "Quality", ar: "الجودة", field: "ratingQuality" },
	{ en: "Friendliness", ar: "الود", field: "ratingFriendliness" },
	{ en: "Value", ar: "القيمة", field: "ratingValue" },
];

serviceAspects.forEach((aspect) => {
	composer.ratingInput(aspect.field, {
		question: translate(localization, { en: aspect.en, ar: aspect.ar }),
		max: 5,
		required: true,
	});
});
```

---

## Progress Bar with Intro/Outro Slides

When your form has non-question slides (intro, thank you), exclude them from the progress bar:

```javascript
const YourFormPage = () => {
	const { currentLang } = useOutletContext();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	const {
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide
	} = useFormController({
		formId: "survey-container",
		currentLang: currentLang
	});

	// ... useEffect and loading logic ...

	return (
		<>
			{/*
				Form structure: [intro slide] [Q1] [Q2] [Q3] [Q4] [Q5] [thank you slide]
				Total: 7 slides
				Questions: 5 slides (indices 1-5)
				Progress bar will show: 1, 2, 3, 4, 5
			*/}
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={slides.length}
				excludeStart={1}  // Skip intro slide
				excludeEnd={1}    // Skip thank you slide
				onStepClick={jumpToSlide}
				currentLang={currentLang}
			/>
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="survey-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};
```

---

## Custom Hotkeys for Yes/No Forms

Create keyboard shortcuts for faster form completion:

```javascript
const {
	setFormInstance,
	containerProps,
	activeSlideIndex,
	slides,
	jumpToSlide
} = useFormController({
	formId: "yes-no-form",
	currentLang: currentLang,

	// Define custom hotkeys
	hotkeys: {
		y: { en: "Yes", ar: "نعم" },
		n: { en: "No", ar: "لا" },
		s: { en: "Sometimes", ar: "أحيانًا" }
	}
});
```

**In your form definition:**

```javascript
// Each choice question should include the hotkey text
composer.choiceInput("question1", {
	question: translate(localization, {
		en: "Do you agree?",
		ar: "هل توافق؟"
	}),
	choices: [
		translate(localization, { en: "Yes", ar: "نعم" }),        // Press 'Y'
		translate(localization, { en: "No", ar: "لا" }),         // Press 'N'
		translate(localization, { en: "Sometimes", ar: "أحيانًا" })  // Press 'S'
	],
	required: true
});
```

**How it works:**
- User presses 'Y' → automatically selects "Yes"
- Works across both languages automatically
- Doesn't interfere with typing in text inputs

---

## Custom Last Slide Handler

Control what happens when the user clicks "Next" on the final slide:

```javascript
const [showThankYou, setShowThankYou] = useState(false);

const {
	setFormInstance,
	containerProps,
	activeSlideIndex,
	slides,
	jumpToSlide
} = useFormController({
	formId: "tool1_operations",
	currentLang: currentLang,

	// Custom completion handler
	onLastSlideNext: (e, lastSlide) => {
		e.preventDefault();

		// Option 1: Show inline thank you message
		setShowThankYou(true);

		// Option 2: Redirect to another page
		// window.location.href = "/thank-you";

		// Option 3: Trigger custom analytics
		// trackEvent('form_completed', { formId: 'tool1_operations' });

		// Option 4: Show custom modal
		// openModal({ type: 'success', message: 'Form submitted!' });
	}
});

return (
	<>
		{showThankYou ? (
			<div style={{ textAlign: 'center', padding: '50px' }}>
				<h1>{currentLang === 'ar' ? 'شكراً لك!' : 'Thank You!'}</h1>
				<p>
					{currentLang === 'ar'
						? 'تم إرسال ردودك بنجاح.'
						: 'Your responses have been submitted successfully.'}
				</p>
			</div>
		) : (
			<>
				<FormProgressBar {...progressBarProps} />
				<div {...containerProps}>
					<FormRenderer {...rendererProps} />
				</div>
			</>
		)}
	</>
);
```

---

## Progress Bar with Minimal Setup

Simplest integration (no intro/outro slides, default behavior):

```javascript
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import FormProgressBar from "../components/FormProgressBar";
import { useFormController } from "../hooks/useFormController.js";
import { createYourFormComposer } from "../forms/YourForm.js";
import { getFormOptions } from "../forms/formUtils.js";

const YourFormPage = () => {
	const { currentLang } = useOutletContext();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	const { setFormInstance, containerProps, activeSlideIndex, slides, jumpToSlide } =
		useFormController({
			formId: "your-form",
			currentLang: currentLang
		});

	useEffect(() => {
		setComposer(createYourFormComposer(currentLang));
		setOptions(getFormOptions(currentLang));
	}, [currentLang]);

	if (!composer || !options) return <div>Loading...</div>;

	return (
		<>
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={slides.length}
				excludeStart={0}
				excludeEnd={0}
				onStepClick={jumpToSlide}
				currentLang={currentLang}
			/>
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="your-form"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default YourFormPage;
```

---

## Tips for Using These Patterns

1. **Always localize:** Use `translate()` for all user-facing text
2. **Progress indicators:** Update `pageProgress` to reflect actual form length
3. **Field names:** Use descriptive, unique field names
4. **Validation:** Set `required: true` for essential fields
5. **Descriptions:** Add helpful context with `description` property
6. **Testing:** Test conditional logic thoroughly in both languages
7. **Accessibility:** Ensure form works with keyboard navigation
8. **Progress bar exclusions:** Count your intro/outro slides carefully when setting excludeStart/excludeEnd
9. **Hotkey consistency:** Use the same choice text across all questions for hotkeys to work reliably
10. **Container props:** Always spread `{...containerProps}` on the div wrapping FormRenderer

## Combining Patterns

You can combine multiple patterns in a single form:

```javascript
export function createComprehensiveFormComposer(localization = "en") {
	const composer = new window.Composer({
		id: "comprehensive-form",
		...getSharedFormConfig(localization),
		postUrl: GOOGLE_SCRIPT_URL,
	});

	composer.h1(translate(localization, { en: "Survey", ar: "الاستبيان" }));

	composer.p(
		translate(localization, {
			en: "Please complete this comprehensive survey",
			ar: "يرجى إكمال هذا الاستبيان الشامل",
		}),
	);

	// Pattern 1: Contact Information
	composer.slide({ pageProgress: "1/4" });
	// ... contact fields

	// Pattern 2: Multi-choice with Other
	composer.slide({ pageProgress: "2/4" });
	// ... choice fields

	// Pattern 3: Conditional slides
	composer.slide({
		jumpCondition: "condition",
		pageProgress: "3/4",
	});
	// ... conditional content

	// Pattern 4: Rating and feedback
	composer.slide({ pageProgress: "4/4" });
	// ... rating fields

	return composer;
}
```
