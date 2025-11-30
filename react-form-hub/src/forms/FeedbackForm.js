import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en") {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "feedback-form",
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
			en: "Feedback Form",
			ar: "نموذج الملاحظات",
		}),
	);


	// Feedback question
	composer.slide({ pageProgress: "1/1" });
	composer.textInput("feedback", {
		question: translate(localization, {
			en: "What's your feedback?",
			ar: "ما هي ملاحظاتك؟",
		}),
		placeholder: translate(localization, {
			en: "Share your thoughts...",
			ar: "شاركنا رأيك...",
		}),
		multiline: true,
		required: true,
	});

	return composer;
}
