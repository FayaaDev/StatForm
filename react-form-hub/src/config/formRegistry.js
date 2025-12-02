// Form Registry - Central metadata for all forms
// Defines which forms belong to which themes

export const formRegistry = [
	// PHA exclusive forms
	{
		id: "demo-form",
		themes: ["pha"],
		path: "demo-form",
		title: {
			en: "Demo Form",
			ar: "النموذج التجريبي",
		},
	},
	{
		id: "feedback-form",
		themes: ["pha"],
		path: "feedback-form",
		title: {
			en: "Feedback Form",
			ar: "نموذج الملاحظات",
		},
	},
	{
		id: "survey-form",
		themes: ["pha"],
		path: "survey-form",
		title: {
			en: "Survey Form",
			ar: "نموذج الاستبيان",
		},
	},
	{
		id: "tester-form",
		themes: ["pha"],
		path: "tester-form",
		title: {
			en: "Assets Turnover Form",
			ar: "نموذج تسليم الأصول",
		},
	},

	// Personal (main) theme exclusive forms
	{
		id: "burnout-survey",
		themes: ["personal"],
		path: "burnout-survey",
		title: {
			en: "Burnout Survey",
			ar: "استبيان الاحتراق النفسي",
		},
	},
	{
		id: "neurology-history",
		themes: ["personal"],
		path: "neurology-history",
		title: {
			en: "Neurology History",
			ar: "التاريخ العصبي",
		},
	},
	{
		id: "acute-abdomen",
		themes: ["personal"],
		path: "acute-abdomen",
		title: {
			en: "Acute Abdomen",
			ar: "البطن الحاد",
		},
	},
	{
		id: "chest-pain",
		themes: ["personal"],
		path: "chest-pain",
		title: {
			en: "Chest Pain History",
			ar: "تاريخ ألم الصدر",
		},
	},
	{
		id: "fever-unknown-origin",
		themes: ["personal"],
		path: "fever-unknown-origin",
		title: {
			en: "Fever of Unknown Origin (FUO)",
			ar: "حمى مجهولة المصدر (FUO)",
		},
	},
	{
		id: "cough-history",
		themes: ["personal"],
		path: "cough-history",
		title: {
			en: "Cough History and Assessment",
			ar: "تاريخ وتقييم السعال",
		},
	},
	{
		id: "dyspnea-history",
		themes: ["personal"],
		path: "dyspnea-history",
		title: {
			en: "Dyspnea (Shortness of Breath) History",
			ar: "تاريخ ضيق التنفس",
		},
	},
];

// Helper to get forms for a specific theme
export function getFormsByTheme(themeId) {
	return formRegistry.filter((form) => form.themes.includes(themeId));
}

// Helper to check if a form belongs to a theme
export function isFormInTheme(formId, themeId) {
	const form = formRegistry.find((f) => f.id === formId);
	return form ? form.themes.includes(themeId) : false;
}
