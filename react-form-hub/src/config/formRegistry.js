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
	// ============================================
	// Category: General Surgery
	// ============================================
	{
		id: "acute-abdomen",
		themes: ["personal"],
		path: "acute-abdomen",
		category: "general-surgery",
		title: {
			en: "Acute Abdomen",
			ar: "ألم البطن",
		},
	},

	// ============================================
	// Category: Internal Medicine
	// ============================================
	{
		id: "chest-pain",
		themes: ["personal"],
		path: "chest-pain",
		category: "internal-medicine",
		title: {
			en: "Chest Pain",
			ar: " ألم الصدر",
		},
	},
	{
		id: "fever-unknown-origin",
		themes: ["personal"],
		path: "fever-unknown-origin",
		category: "internal-medicine",
		title: {
			en: "Fever of Unknown Origin",
			ar: "حمى مجهولة المصدر ",
		},
	},
	{
		id: "cough-history",
		themes: ["personal"],
		path: "cough-history",
		category: "internal-medicine",
		title: {
			en: "Cough",
			ar: "  السعال",
		},
	},
	{
		id: "dyspnea-history",
		themes: ["personal"],
		path: "dyspnea-history",
		category: "internal-medicine",
		title: {
			en: "Dyspnea",
			ar: "تاريخ ضيق التنفس",
		},
	},
	{
		id: "neurology-history",
		themes: ["personal"],
		path: "neurology-history",
		category: "internal-medicine",
		title: {
			en: "Seizure",
			ar: "الصرع",
		},
	},

	// ============================================
	// Category: Psychiatry
	// ============================================
	{
		id: "depression-history",
		themes: ["personal"],
		path: "depression-history",
		category: "psychiatry",
		title: {
			en: "Depression",
			ar: "الاكتئاب",
		},
	},
	{
		id: "burnout-survey",
		themes: ["personal"],
		path: "burnout-survey",
		category: "psychiatry",
		title: {
			en: "Burnout Survey",
			ar: "استبيان الاحتراق النفسي",
		},
	},

	// ============================================
	// Category: Pediatrics
	// ============================================
	// Placeholder - forms can be moved here later

	// ============================================
	// Category: Obstetrics and Gynaecology
	// ============================================
	{
		id: "pelvic-pain",
		themes: ["personal"],
		path: "pelvic-pain",
		category: "obstetrics-gynaecology",
		title: {
			en: "Chronic Pelvic Pain",
			ar: "تاريخ ألم الحوض المزمن",
		},
	},
];

// Medical specialty categories
export const medicalCategories = {
	"general-surgery": {
		en: "General Surgery",
		ar: "الجراحة العامة",
	},
	"internal-medicine": {
		en: "Internal Medicine",
		ar: "الطب الباطني",
	},
	psychiatry: {
		en: "Psychiatry",
		ar: "الطب النفسي",
	},
	pediatrics: {
		en: "Pediatrics",
		ar: "طب الأطفال",
	},
	"obstetrics-gynaecology": {
		en: "Obstetrics & Gynaecology",
		ar: "النساء والتوليد",
	},
};

// Helper to get forms for a specific theme
export function getFormsByTheme(themeId) {
	return formRegistry.filter((form) => form.themes.includes(themeId));
}

// Helper to get forms grouped by category for a specific theme
export function getFormsByThemeGrouped(themeId) {
	const forms = getFormsByTheme(themeId);
	const grouped = {};

	// Initialize all categories
	Object.keys(medicalCategories).forEach((categoryId) => {
		grouped[categoryId] = [];
	});

	// Group forms by category
	forms.forEach((form) => {
		if (form.category && grouped[form.category]) {
			grouped[form.category].push(form);
		}
	});

	return grouped;
}

// Helper to check if a form belongs to a theme
export function isFormInTheme(formId, themeId) {
	const form = formRegistry.find((f) => f.id === formId);
	return form ? form.themes.includes(themeId) : false;
}
