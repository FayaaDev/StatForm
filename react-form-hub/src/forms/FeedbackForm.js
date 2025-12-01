import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "feedback-form",
		...getSharedFormConfig(localization, theme),
		postUrl: GOOGLE_SCRIPT_URL,
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
