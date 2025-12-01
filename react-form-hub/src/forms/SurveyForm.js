import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createSurveyFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "survey-form",
		...getSharedFormConfig(localization, theme),
		postUrl: GOOGLE_SCRIPT_URL,
	});

	// Welcome header
	composer.h1(
		translate(localization, {
			en: "Customer Satisfaction Survey",
			ar: "استبيان رضا العملاء",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Help us improve by sharing your experience",
			ar: "ساعدنا على التحسين من خلال مشاركة تجربتك",
		}),
	);

	// Slide 1: Overall satisfaction
	composer.slide({ pageProgress: "1/6" });
	composer.choiceInput("satisfaction", {
		question: translate(localization, {
			en: "How satisfied are you with our service?",
			ar: "ما مدى رضاك عن خدمتنا؟",
		}),
		choices: [
			translate(localization, {
				en: "Very Satisfied",
				ar: "راضٍ جداً",
			}),
			translate(localization, {
				en: "Satisfied",
				ar: "راضٍ",
			}),
			translate(localization, {
				en: "Neutral",
				ar: "محايد",
			}),
			translate(localization, {
				en: "Dissatisfied",
				ar: "غير راضٍ",
			}),
			translate(localization, {
				en: "Very Dissatisfied",
				ar: "غير راضٍ جداً",
			}),
		],
		required: true,
	});

	// Slide 2: Service category
	composer.slide({ pageProgress: "2/6" });
	composer.selectBox("service_category", {
		question: translate(localization, {
			en: "Which service did you use?",
			ar: "ما الخدمة التي استخدمتها؟",
		}),
		options: [
			translate(localization, {
				en: "Product Support",
				ar: "دعم المنتج",
			}),
			translate(localization, {
				en: "Technical Service",
				ar: "الخدمة التقنية",
			}),
			translate(localization, {
				en: "Billing",
				ar: "الفوترة",
			}),
			translate(localization, {
				en: "Sales",
				ar: "المبيعات",
			}),
			translate(localization, {
				en: "Other",
				ar: "أخرى",
			}),
		],
		required: true,
	});

	// Slide 3: Recommendation likelihood
	composer.slide({ pageProgress: "3/6" });
	composer.choiceInput("recommendation", {
		question: translate(localization, {
			en: "How likely are you to recommend us to a friend or colleague?",
			ar: "ما مدى احتمالية توصيتك لنا لصديق أو زميل؟",
		}),
		choices: [
			translate(localization, {
				en: "Very Likely",
				ar: "محتمل جداً",
			}),
			translate(localization, {
				en: "Likely",
				ar: "محتمل",
			}),
			translate(localization, {
				en: "Neutral",
				ar: "محايد",
			}),
			translate(localization, {
				en: "Unlikely",
				ar: "غير محتمل",
			}),
			translate(localization, {
				en: "Very Unlikely",
				ar: "غير محتمل جداً",
			}),
		],
		required: true,
	});

	// Slide 4: Experience rating
	composer.slide({ pageProgress: "4/6" });
	composer.selectBox("experience_rating", {
		question: translate(localization, {
			en: "How would you rate your overall experience?",
			ar: "كيف تقيّم تجربتك الإجمالية؟",
		}),
		options: [
			translate(localization, {
				en: "Excellent",
				ar: "ممتاز",
			}),
			translate(localization, {
				en: "Good",
				ar: "جيد",
			}),
			translate(localization, {
				en: "Average",
				ar: "متوسط",
			}),
			translate(localization, {
				en: "Poor",
				ar: "ضعيف",
			}),
			translate(localization, {
				en: "Very Poor",
				ar: "ضعيف جداً",
			}),
		],
		required: true,
	});

	// Slide 5: Additional comments
	composer.slide({ pageProgress: "5/6" });
	composer.textInput("comments", {
		question: translate(localization, {
			en: "Do you have any additional comments or suggestions?",
			ar: "هل لديك أي تعليقات أو اقتراحات إضافية؟",
		}),
		placeholder: translate(localization, {
			en: "Share your thoughts...",
			ar: "شاركنا رأيك...",
		}),
		multiline: true,
		required: false,
	});

	// Slide 6: Contact information (optional)
	composer.slide({ pageProgress: "6/6" });
	composer.emailInput("email", {
		question: translate(localization, {
			en: "Would you like us to follow up with you? (Optional)",
			ar: "هل ترغب في أن نتواصل معك؟ (اختياري)",
		}),
		placeholder: translate(localization, {
			en: "your.email@example.com",
			ar: "your.email@example.com",
		}),
		required: false,
	});

	return composer;
}
