// Form Registry - Central metadata for all forms
// Defines which forms belong to which themes

export const formRegistry = [
	// PHA exclusive forms
	// {
	// 	id: "demo-form",
	// 	themes: ["pha"],
	// 	path: "demo-form",
	// 	title: {
	// 		en: "Demo Form",
	// 		ar: "النموذج التجريبي",
	// 	},
	// },
	{
		id: "tool1_operations",
		themes: ["pha"],
		path: "tool1_operations",
		title: {
			en: "Evaluation Tool 1 - Operations",
			ar: "اداة التقييم 1 - العمليات التشغيلية",
		},
	},
	{
		id: "tool2_operations",
		themes: ["pha"],
		path: "tool2_operations",
		title: {
			en: "Evaluation Tool 2 - Operations",
			ar: "اداة التقييم 2 - العمليات التشغيلية",
		},
	},
	{
		id: "tool3_operations",
		themes: ["pha"],
		path: "tool3_operations",
		title: {
			en: "Evaluation Tool 3 - Operations",
			ar: "اداة التقييم 3 - العمليات التشغيلية",
		},
	},
	{
		id: "tool4_operations",
		themes: ["pha"],
		path: "tool4_operations",
		title: {
			en: "Evaluation Tool 4 - Operations",
			ar: "اداة التقييم 4 - العمليات التشغيلية",
		},
	},
	{
		id: "tool5_operations",
		themes: ["pha"],
		path: "tool5_operations",
		title: {
			en: "Evaluation Tool 5 - Operations",
			ar: "اداة التقييم 5 - العمليات التشغيلية",
		},
	},
	{
		id: "tool6_operations",
		themes: ["pha"],
		path: "tool6_operations",
		title: {
			en: "Evaluation Tool 6 - Operations",
			ar: "اداة التقييم 6 - العمليات التشغيلية",
		},
	},
	{
		id: "tool7_operations",
		themes: ["pha"],
		path: "tool7_operations",
		title: {
			en: "Evaluation Tool 7 - Operations",
			ar: "اداة التقييم 7 - العمليات التشغيلية",
		},
	},
	{
		id: "tool8_operations",
		themes: ["pha"],
		path: "tool8_operations",
		title: {
			en: "Evaluation Tool 8 - Operations",
			ar: "اداة التقييم 8 - العمليات التشغيلية",
		},
	},
	{
		id: "tool9_operations",
		themes: ["pha"],
		path: "tool9_operations",
		title: {
			en: "Evaluation Tool 9 - Operations",
			ar: "اداة التقييم 9 - العمليات التشغيلية",
		},
	},
	{
		id: "tool10_operations",
		themes: ["pha"],
		path: "tool10_operations",
		title: {
			en: "Evaluation Tool 10 - Operations",
			ar: "اداة التقييم 10 - العمليات التشغيلية",
		},
	},
	{
		id: "tool11_operations",
		themes: ["pha"],
		path: "tool11_operations",
		title: {
			en: "Evaluation Tool 11 - Operations",
			ar: "اداة التقييم 11 - العمليات التشغيلية",
		},
	},
	{
		id: "tool12_operations",
		themes: ["pha"],
		path: "tool12_operations",
		title: {
			en: "Evaluation Tool 12 - Operations",
			ar: "اداة التقييم 12 - العمليات التشغيلية",
		},
	},
	{
		id: "tool13_operations",
		themes: ["pha"],
		path: "tool13_operations",
		title: {
			en: "Evaluation Tool 13 - Operations",
			ar: "اداة التقييم 13 - العمليات التشغيلية",
		},
	},
	{
		id: "tool14_operations",
		themes: ["pha"],
		path: "tool14_operations",
		title: {
			en: "Evaluation Tool 14 - Operations",
			ar: "اداة التقييم 14 - العمليات التشغيلية",
		},
	},
	{
		id: "tool15_operations",
		themes: ["pha"],
		path: "tool15_operations",
		title: {
			en: "Evaluation Tool 15 - Operations",
			ar: "اداة التقييم 15 - العمليات التشغيلية",
		},
	},
	// {
	// 	id: "survey-form",
	// 	themes: ["pha"],
	// 	path: "survey-form",
	// 	title: {
	// 		en: "Survey Form",
	// 		ar: "نموذج الاستبيان",
	// 	},
	// },
	// {
	// 	id: "tester-form",
	// 	themes: ["pha"],
	// 	path: "tester-form",
	// 	title: {
	// 		en: "Assets Turnover Form",
	// 		ar: "نموذج تسليم الأصول",
	// 	},
	// },

	// Personal (main) theme exclusive forms
	// ============================================
	// Category: Patient General Assessment
	// ============================================
	{
		id: "discharge-summary",
		themes: ["personal"],
		path: "discharge-summary",
		category: "patient-general-assessment",
		title: {
			en: "Discharge Summary",
			ar: "ملخص الخروج",
		},
	},
	{
		id: "soap-note",
		themes: ["personal"],
		path: "soap-note",
		category: "patient-general-assessment",
		title: {
			en: "SOAP Note",
			ar: "ملاحظة SOAP",
		},
	},

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
	"patient-general-assessment": {
		en: "Patient General Assessment",
		ar: "التقييم العام للمريض",
	},
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
