import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL } from "./formUtils.js";

/**
 * Creates the demo form composer with all configurations
 * @param {string} localization - Language code ('en' or 'ar')
 * @returns {Composer} Configured composer instance
 */
export function createDemoFormComposer(localization = "en") {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	// Create form with all the same settings as the static HTML
	const composer = new window.Composer({
		id: "demo-form",
		formStyle: "conversational",
		fontSize: "lg",
		rounded: "pill",
		restartButton: "show",
		buttonAlignment: "end",
		paddingInlineBottom: 80,
		paddingInlineTop: 100,
		colorScheme: "light",
		accent: "#09595C",
		accentForeground: "#ffffff",
		backgroundColor: "#ffffff",
		color: "#063E40",
		postUrl: GOOGLE_SCRIPT_URL,
		localization: localization,
		dir: localization === "ar" ? "rtl" : "ltr",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Welcome to Forms.md Demo",
			ar: "مرحباً بك في نموذج العرض التوضيحي",
		}),
	);
	composer.p(
		translate(localization, {
			en: "This is a simple demo form to showcase Forms.md capabilities.",
			ar: "هذا نموذج تجريبي بسيط لعرض إمكانيات Forms.md.",
		}),
	);


	// Slide 0: Name Selection
	composer.slide({ pageProgress: "0/6" });
	composer.selectBox("userName", {
		question: translate(localization, {
			en: "Please select your name:",
			ar: "الرجاء اختيار اسمك:",
		}),
		options:
			localization === "ar"
				? ["أحمد محمد", "فاطمة علي", "محمد حسن", "سارة أحمد", "علي محمود"]
				: [
					"Ahmed Mohammed",
					"Fatima Ali",
					"Mohammed Hassan",
					"Sarah Ahmed",
					"Ali Mahmoud",
				],
		required: true,
	});

	// Slide 1: Name
	composer.slide({ pageProgress: "1/6" });
	composer.textInput("fullName", {
		question: translate(localization, {
			en: "What's your name?",
			ar: "ما اسمك؟",
		}),
		placeholder: translate(localization, {
			en: "Enter your full name",
			ar: "أدخل اسمك الكامل",
		}),
		required: false,
	});

	// Slide 2: Email
	composer.slide({ pageProgress: "2/6" });
	composer.emailInput("email", {
		question: translate(localization, {
			en: "What's your email address?",
			ar: "ما هو بريدك الإلكتروني؟",
		}),
		placeholder: translate(localization, {
			en: "you@example.com",
			ar: "example@email.com",
		}),
		required: false,
	});

	// Slide 3: Rating
	composer.slide({ pageProgress: "3/6" });
	composer.choiceInput("rating", {
		question: translate(localization, {
			en: "How would you rate your experience?",
			ar: "كيف تقيم تجربتك؟",
		}),
		choices:
			localization === "ar"
				? ["ممتاز", "جيد", "متوسط", "ضعيف"]
				: ["Excellent", "Good", "Average", "Poor"],
		required: false,
	});

	// Slide 4: Feedback
	composer.slide({ pageProgress: "4/6" });
	composer.textInput("feedback", {
		question: translate(localization, {
			en: "Any additional feedback?",
			ar: "هل لديك أي ملاحظات إضافية؟",
		}),
		placeholder: translate(localization, {
			en: "Share your thoughts...",
			ar: "شاركنا أفكارك...",
		}),
		multiline: true,
		required: false,
	});

	// Slide 5: URL
	composer.slide({ pageProgress: "5/6" });
	composer.urlInput("CompanyURL", {
		question: translate(localization, {
			en: "What is your company's URL?",
			ar: "ماهو رابط الشركة؟",
		}),
		placeholder: translate(localization, {
			en: "www",
			ar: "www",
			ar: "www",
		}),
		required: false,
	});

	return composer;
}
