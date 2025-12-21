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
		category: "feedback",
		title: {
			en: "Evaluation Tool 1",
			ar: "اداة تقييم الاشراف و التنسيق للعمليات التشغيلية ",
		},
	},
	{
		id: "tool2_operations",
		themes: ["pha"],
		path: "tool2_operations",
		category: "feedback",
		title: {
			en: "Evaluation Tool 2",
			ar: "أداة تقييم أعمال المكافحة لنواقل حمى الوادي المتصدع",
		},
	},
	{
		id: "tool3_operations",
		themes: ["pha"],
		path: "tool3_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Human Sample Collection, Transport, and Preservation for RVF",
			ar: "تقييم أعمال جمع ونقل وحفظ العينات البشرية للكشف عن فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "tool4_operations",
		themes: ["pha"],
		path: "tool4_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Veterinary Sample Collection, Transport, and Preservation for RVF",
			ar: "تقييم أعمال جمع ونقل وحفظ العينات البيطرية للكشف عن فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "tool5_operations",
		themes: ["pha"],
		path: "tool5_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Human Epidemiological Investigation for RVF",
			ar: "تقييم أعمال التقصي الوبائي البشري للكشف عن فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "tool6_operations",
		themes: ["pha"],
		path: "tool6_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Entomological Surveillance for RVF Vectors",
			ar: "تقييم أعمال التقصي الحشري لنواقل حمى الوادي المتصدع",
		},
	},
	{
		id: "tool7_operations",
		themes: ["pha"],
		path: "tool7_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Veterinary Case Investigation for RVF",
			ar: "تقييم تقصي الحالة البيطري للكشف عن فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "tool8_operations",
		themes: ["pha"],
		path: "tool8_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Veterinary Visual and Clinical Examination for RVF",
			ar: "تقييم الفحص الظاهري والسريري البيطري للكشف عن فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "tool9_operations",
		themes: ["pha"],
		path: "tool9_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Insect Sample Preservation and Transport (RVF)",
			ar: "تقييم حفظ ونقل العينات الحشرية لنواقل حمى الوادي المتصدع",
		},
	},
	{
		id: "tool10_operations",
		themes: ["pha"],
		path: "tool10_operations",
		category: "feedback",
		title: {
			en: "Evaluation of Health Education Activities (RVF)",
			ar: "تقييم أعمال التثقيف الصحي حول فيروس حمى الوادي المتصدع",
		},
	},
	{
		id: "epidemiology-form",
		themes: ["pha"],
		path: "epidemiology-form",
		category: "field-work",
		title: {
			en: "Epidemiology Form",
			ar: "التقصي الوبائي للحالات",
		},
	},
	{
		id: "animal-assessment-form",
		themes: ["pha"],
		path: "animal-assessment-form",
		category: "field-work",
		title: {
			en: "Animal Assessment Form",
			ar: "التقصي الحيواني",
		},
	},
	{
		id: "entomology-form",
		themes: ["pha"],
		path: "entomology-form",
		category: "field-work",
		title: {
			en: "Entomology Form",
			ar: "الاستكشاف والمكافحة الحشرية",
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
