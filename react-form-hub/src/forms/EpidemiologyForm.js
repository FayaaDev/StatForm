import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createEpidemiologyFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "epidemiology-form",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "التقصي الوبائي للحالات",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Epidemiology Form",
			ar: "التقصي الوبائي للحالات",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this epidemiology investigation form.",
			ar: "يرجى إكمال نموذج التحقيق الوبائي.",
		}),
	);

	// Question 1: Report Date
	composer.slide({ pageProgress: "1/57" });
	composer.textInput("report_date", {
		question: translate(localization, {
			en: "Report Date",
			ar: "تاريخ البلاغ",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: true,
	});

	// Question 2: Coordinates
	composer.slide({ pageProgress: "2/57" });
	composer.textInput("coordinates", {
		question: translate(localization, {
			en: "Coordinates",
			ar: "الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter coordinates",
			ar: "أدخل الإحداثيات",
		}),
		required: true,
	});

	// Question 3: Field Visit Date
	composer.slide({ pageProgress: "3/57" });
	composer.textInput("field_visit_date", {
		question: translate(localization, {
			en: "Field Visit Date",
			ar: "تاريخ الزيارة الميدانية",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: true,
	});

	// Question 4: Investigation Code
	composer.slide({ pageProgress: "4/57" });
	composer.textInput("investigation_code", {
		question: translate(localization, {
			en: "Investigation Code",
			ar: "رمز التقصي",
		}),
		placeholder: translate(localization, {
			en: "Enter investigation code",
			ar: "أدخل رمز التقصي",
		}),
		required: true,
	});

	// Question 5: Case Name
	composer.slide({ pageProgress: "5/57" });
	composer.textInput("case_name", {
		question: translate(localization, {
			en: "Case Name",
			ar: "اسم الحالة",
		}),
		placeholder: translate(localization, {
			en: "Enter case name",
			ar: "أدخل اسم الحالة",
		}),
		required: true,
	});

	// Question 6: Workplace
	composer.slide({ pageProgress: "6/57" });
	composer.textInput("workplace", {
		question: translate(localization, {
			en: "Workplace",
			ar: "جهة العمل",
		}),
		placeholder: translate(localization, {
			en: "Enter workplace",
			ar: "أدخل جهة العمل",
		}),
		required: false,
	});

	// Question 7: Work Address (District)
	composer.slide({ pageProgress: "7/57" });
	composer.textInput("work_address", {
		question: translate(localization, {
			en: "Work Address (District)",
			ar: "عنوان العمل (الحي)",
		}),
		placeholder: translate(localization, {
			en: "Enter work address",
			ar: "أدخل عنوان العمل",
		}),
		required: false,
	});

	// Question 8: Language
	composer.slide({ pageProgress: "8/57" });
	composer.selectBox("language", {
		question: translate(localization, {
			en: "Language",
			ar: "اللغة",
		}),
		options:
			localization === "ar"
				? ["العربية", "الإنجليزية", "الأوردية", "البنغالية", "أخرى"]
				: ["Arabic", "English", "Urdu", "Bengali", "Other"],
		required: true,
	});

	// Question 9: Contact Number
	composer.slide({ pageProgress: "9/57" });
	composer.textInput("contact_number", {
		question: translate(localization, {
			en: "Contact Number",
			ar: "رقم التواصل",
		}),
		placeholder: translate(localization, {
			en: "Enter phone number",
			ar: "أدخل رقم الهاتف",
		}),
		required: true,
	});

	// Question 10: Vaccination Record
	composer.slide({ pageProgress: "10/57" });
	composer.textInput("vaccination_record", {
		question: translate(localization, {
			en: "Vaccination Record",
			ar: "سجل التطعيمات",
		}),
		placeholder: translate(localization, {
			en: "Enter vaccination details",
			ar: "أدخل تفاصيل التطعيمات",
		}),
		required: false,
	});

	// Question 11: Medical History
	composer.slide({ pageProgress: "11/57" });
	composer.textInput("medical_history", {
		question: translate(localization, {
			en: "Medical History of the Case",
			ar: "التاريخ المرضي للحالة",
		}),
		placeholder: translate(localization, {
			en: "Enter medical history",
			ar: "أدخل التاريخ المرضي",
		}),
		required: false,
	});

	// Question 12: Other Medical Condition
	composer.slide({ pageProgress: "12/57" });
	composer.textInput("other_medical_condition", {
		question: translate(localization, {
			en: "Other (Specify Medical Condition)",
			ar: "أخرى (حدد الحالة المرضية)",
		}),
		placeholder: translate(localization, {
			en: "Specify other condition",
			ar: "حدد الحالة الأخرى",
		}),
		required: false,
	});

	// Question 13: Travel within 21 days
	composer.slide({ pageProgress: "13/57" });
	composer.choiceInput("travel_21_days", {
		question: translate(localization, {
			en: "Travel within 21 days",
			ar: "السفر خلال 21 يوم",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 14: Travel Location (conditional)
	composer.textInput("travel_location", {
		question: translate(localization, {
			en: "Travel Location",
			ar: "مكان السفر",
		}),
		placeholder: translate(localization, {
			en: "Enter travel location",
			ar: "أدخل مكان السفر",
		}),
		required: false,
		displayCondition: {
			dependencies: ["travel_21_days"],
			condition: "travel_21_days == 'Yes' or travel_21_days == 'نعم'",
		},
	});

	// Question 15: Direct Exposure
	composer.slide({ pageProgress: "14/57" });
	composer.choiceInput("direct_exposure", {
		question: translate(localization, {
			en: "Direct Exposure",
			ar: "التعرض المباشر",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 16: Type of Animal (Direct)
	composer.textInput("animal_type_direct", {
		question: translate(localization, {
			en: "Type of Animal Exposed to (Direct)",
			ar: "نوع الحيوان الذي تم التعرض له",
		}),
		placeholder: translate(localization, {
			en: "Enter animal type",
			ar: "أدخل نوع الحيوان",
		}),
		required: false,
		displayCondition: {
			dependencies: ["direct_exposure"],
			condition: "direct_exposure == 'Yes' or direct_exposure == 'نعم'",
		},
	});

	// Question 17: Exposure Date (Direct)
	composer.textInput("exposure_date_direct", {
		question: translate(localization, {
			en: "Exposure Date (Direct)",
			ar: "تاريخ التعرض",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["direct_exposure"],
			condition: "direct_exposure == 'Yes' or direct_exposure == 'نعم'",
		},
	});

	// Question 18: Indirect Exposure
	composer.slide({ pageProgress: "15/57" });
	composer.choiceInput("indirect_exposure", {
		question: translate(localization, {
			en: "Indirect Exposure",
			ar: "التعرض الغير مباشر",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 19: Type of Animal (Indirect)
	composer.textInput("animal_type_indirect", {
		question: translate(localization, {
			en: "Type of Animal Exposed to (Indirect)",
			ar: "نوع الحيوان الذي تم التعرض له",
		}),
		placeholder: translate(localization, {
			en: "Enter animal type",
			ar: "أدخل نوع الحيوان",
		}),
		required: false,
		displayCondition: {
			dependencies: ["indirect_exposure"],
			condition: "indirect_exposure == 'Yes' or indirect_exposure == 'نعم'",
		},
	});

	// Question 20: Exposure Date (Indirect)
	composer.textInput("exposure_date_indirect", {
		question: translate(localization, {
			en: "Exposure Date (Indirect)",
			ar: "تاريخ التعرض",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["indirect_exposure"],
			condition: "indirect_exposure == 'Yes' or indirect_exposure == 'نعم'",
		},
	});

	// Question 21: Visit to Health Facility
	composer.slide({ pageProgress: "16/57" });
	composer.choiceInput("health_facility_visit", {
		question: translate(localization, {
			en: "Did the case visit a health facility?",
			ar: "هل قامت الحالة بزيارة منشأة صحية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 22: Public Event Attendance
	composer.slide({ pageProgress: "17/57" });
	composer.choiceInput("public_event_attendance", {
		question: translate(localization, {
			en: "Did the case attend a public event?",
			ar: "هل حضرت الحالة حدث عام؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 23: Traditional Healer Visit
	composer.slide({ pageProgress: "18/57" });
	composer.choiceInput("traditional_healer_visit", {
		question: translate(localization, {
			en: "Did the case visit a traditional healer?",
			ar: "هل قامت الحالة بزيارة معالج شعبي؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 24: Wounds from Direct Exposure
	composer.slide({ pageProgress: "19/57" });
	composer.choiceInput("wounds_direct_exposure", {
		question: translate(localization, {
			en: "In case of direct exposure, are there wounds?",
			ar: "في حال التعرض المباشر يوجد جروح؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 25: Transfer within 14 days
	composer.slide({ pageProgress: "20/57" });
	composer.choiceInput("transfer_14_days", {
		question: translate(localization, {
			en: "Within 14 days, was there a transfer?",
			ar: "خلال 14 يوم، هل تم عملية نقل؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 26: Mosquito Exposure
	composer.slide({ pageProgress: "21/57" });
	composer.choiceInput("mosquito_exposure", {
		question: translate(localization, {
			en: "Mosquito Exposure",
			ar: "تم التعرض للبعوض",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 27: Bite Date
	composer.textInput("bite_date", {
		question: translate(localization, {
			en: "Bite Date",
			ar: "تاريخ التعرض للدغ",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["mosquito_exposure"],
			condition: "mosquito_exposure == 'Yes' or mosquito_exposure == 'نعم'",
		},
	});

	// Question 28: Exposure Location
	composer.slide({ pageProgress: "22/57" });
	composer.textInput("exposure_location", {
		question: translate(localization, {
			en: "Exposure Location",
			ar: "مكان التعرض",
		}),
		placeholder: translate(localization, {
			en: "Enter exposure location",
			ar: "أدخل مكان التعرض",
		}),
		required: false,
	});

	// Question 29: Other Bite Location
	composer.slide({ pageProgress: "23/57" });
	composer.textInput("other_bite_location", {
		question: translate(localization, {
			en: "Other (Specify Bite Location)",
			ar: "أخرى (حدد مكان التعرض للدغ)",
		}),
		placeholder: translate(localization, {
			en: "Specify other location",
			ar: "حدد المكان الآخر",
		}),
		required: false,
	});

	// Question 30: Number of Contacts
	composer.slide({ pageProgress: "24/57" });
	composer.numberInput("number_of_contacts", {
		question: translate(localization, {
			en: "Number of Contacts",
			ar: "عدد المخالطين للحالة فقط",
		}),
		min: 0,
		max: 1000,
	});

	// Question 31: Nature of Contact
	composer.slide({ pageProgress: "25/57" });
	composer.textInput("contact_nature", {
		question: translate(localization, {
			en: "Nature of Contact",
			ar: "طبيعة المخالطة",
		}),
		placeholder: translate(localization, {
			en: "Describe contact nature",
			ar: "صف طبيعة المخالطة",
		}),
		required: false,
	});

	// Question 32: Building Condition
	composer.slide({ pageProgress: "26/57" });
	composer.selectBox("building_condition", {
		question: translate(localization, {
			en: "Building Condition",
			ar: "حالة المبنى",
		}),
		options:
			localization === "ar"
				? ["جيد", "متوسط", "سيئ", "متهالك"]
				: ["Good", "Fair", "Poor", "Dilapidated"],
		required: false,
	});

	// Question 33: Number of Household Members
	composer.slide({ pageProgress: "27/57" });
	composer.numberInput("household_members", {
		question: translate(localization, {
			en: "Number of Household Members",
			ar: "عدد الافراد بالمنزل",
		}),
		min: 1,
		max: 100,
	});

	// Question 34: Risk Factor Location
	composer.slide({ pageProgress: "28/57" });
	composer.textInput("risk_factor_location", {
		question: translate(localization, {
			en: "Risk Factor Location",
			ar: "موقع عامل الخطورة",
		}),
		placeholder: translate(localization, {
			en: "Enter location",
			ar: "أدخل الموقع",
		}),
		required: false,
	});

	// Question 35: Risk Factors
	composer.slide({ pageProgress: "29/57" });
	composer.textInput("risk_factors", {
		question: translate(localization, {
			en: "Risk Factors",
			ar: "عوامل الخطورة",
		}),
		placeholder: translate(localization, {
			en: "List risk factors",
			ar: "اذكر عوامل الخطورة",
		}),
		required: false,
	});

	// Question 36: Other Risk Factor
	composer.slide({ pageProgress: "30/57" });
	composer.textInput("other_risk_factor", {
		question: translate(localization, {
			en: "Other (Specify Risk Factor)",
			ar: "أخرى (حدد عامل الخطورة)",
		}),
		placeholder: translate(localization, {
			en: "Specify other risk factor",
			ar: "حدد عامل الخطورة الآخر",
		}),
		required: false,
	});

	// Question 37: Risk Factor Result
	composer.slide({ pageProgress: "31/57" });
	composer.selectBox("risk_factor_result", {
		question: translate(localization, {
			en: "Risk Factor Result",
			ar: "نتيجة عامل الخطورة",
		}),
		options:
			localization === "ar"
				? ["إيجابي", "سلبي", "غير محدد"]
				: ["Positive", "Negative", "Undetermined"],
		required: false,
	});

	// Question 38: Number of Individuals Educated
	composer.slide({ pageProgress: "32/57" });
	composer.numberInput("individuals_educated", {
		question: translate(localization, {
			en: "Number of Individuals Educated",
			ar: "عدد الأفراد الذين تم تقديم التثقيف",
		}),
		min: 0,
		max: 1000,
	});

	// Question 39: Risk Factors Leading Opinion
	composer.slide({ pageProgress: "33/57" });
	composer.textInput("risk_factors_opinion", {
		question: translate(localization, {
			en: "In your opinion, what are the risk factors that lead to this condition?",
			ar: "برأيك، ماهي عوامل الخطورة التي تؤدي لهذه الحالة؟",
		}),
		placeholder: translate(localization, {
			en: "Enter your opinion",
			ar: "أدخل رأيك",
		}),
		required: false,
	});

	// Question 40: Mosquito Repellent Products
	composer.slide({ pageProgress: "34/57" });
	composer.textInput("mosquito_repellent_products", {
		question: translate(localization, {
			en: "What mosquito repellent products are used?",
			ar: "ماهي المنتجات الطاردة للبعوض التي يتم استخدامها؟",
		}),
		placeholder: translate(localization, {
			en: "List products",
			ar: "اذكر المنتجات",
		}),
		required: false,
	});

	// Question 41: Diseases Transmitted Opinion
	composer.slide({ pageProgress: "35/57" });
	composer.textInput("diseases_transmitted_opinion", {
		question: translate(localization, {
			en: "In your opinion, what diseases are transmitted through this route?",
			ar: "برأيك، ماهي الأمراض التي تنتقل عن طريق هذا؟",
		}),
		placeholder: translate(localization, {
			en: "List diseases",
			ar: "اذكر الأمراض",
		}),
		required: false,
	});

	// Question 42: Action When Symptoms Appear
	composer.slide({ pageProgress: "36/57" });
	composer.textInput("action_symptoms_appear", {
		question: translate(localization, {
			en: "What action is taken when symptoms appear?",
			ar: "ماهو الإجراء المتخذ عند ظهور الأعراض؟",
		}),
		placeholder: translate(localization, {
			en: "Describe action",
			ar: "صف الإجراء",
		}),
		required: false,
	});

	// Question 43: Health Education Status
	composer.slide({ pageProgress: "37/57" });
	composer.selectBox("health_education_status", {
		question: translate(localization, {
			en: "Health Education Status",
			ar: "حالة التثقيف الصحي",
		}),
		options:
			localization === "ar"
				? ["تم التثقيف", "لم يتم التثقيف", "تثقيف جزئي"]
				: ["Educated", "Not Educated", "Partially Educated"],
		required: false,
	});

	// Question 44: Site Exploration Status
	composer.slide({ pageProgress: "38/57" });
	composer.selectBox("site_exploration_status", {
		question: translate(localization, {
			en: "Site Exploration Status",
			ar: "حالة استكشاف الموقع",
		}),
		options:
			localization === "ar"
				? ["تم الاستكشاف", "لم يتم الاستكشاف", "استكشاف جزئي"]
				: ["Explored", "Not Explored", "Partially Explored"],
		required: false,
	});

	// Question 45: Reasons for Not Completing Exploration
	composer.slide({ pageProgress: "39/57" });
	composer.textInput("exploration_incomplete_reasons", {
		question: translate(localization, {
			en: "Reasons for not completing exploration",
			ar: "أسباب عدم استكمال عملية الاستكشاف",
		}),
		placeholder: translate(localization, {
			en: "Enter reasons",
			ar: "أدخل الأسباب",
		}),
		required: false,
	});

	// Question 46: Other Exploration Incomplete Reason
	composer.slide({ pageProgress: "40/57" });
	composer.textInput("other_exploration_incomplete", {
		question: translate(localization, {
			en: "Other (Specify reason for not completing exploration)",
			ar: "أخرى (حدد سبب عدم استكمال عملية الاستكشاف)",
		}),
		placeholder: translate(localization, {
			en: "Specify other reason",
			ar: "حدد السبب الآخر",
		}),
		required: false,
	});

	// Question 47: Aquatic Stage Present
	composer.slide({ pageProgress: "41/57" });
	composer.choiceInput("aquatic_stage_present", {
		question: translate(localization, {
			en: "Is there aquatic stage?",
			ar: "هل يوجد طور مائي؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 48: Adult Mosquitoes Present
	composer.slide({ pageProgress: "42/57" });
	composer.choiceInput("adult_mosquitoes_present", {
		question: translate(localization, {
			en: "Are there adult mosquitoes?",
			ar: "هل يوجد بعوض بالغ؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 49: Ticks Present
	composer.slide({ pageProgress: "43/57" });
	composer.choiceInput("ticks_present", {
		question: translate(localization, {
			en: "Are there ticks?",
			ar: "هل يوجد قراد؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 50: Control Performed at Site
	composer.slide({ pageProgress: "44/57" });
	composer.choiceInput("control_performed", {
		question: translate(localization, {
			en: "Was control performed at the site?",
			ar: "هل تمت المكافحة بالموقع؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 51: Reason for Not Performing Control
	composer.slide({ pageProgress: "45/57" });
	composer.textInput("no_control_reason", {
		question: translate(localization, {
			en: "Reason for not performing control",
			ar: "سبب عدم المكافحة في حال لم تتم",
		}),
		placeholder: translate(localization, {
			en: "Enter reason",
			ar: "أدخل السبب",
		}),
		required: false,
		displayCondition: {
			dependencies: ["control_performed"],
			condition: "control_performed == 'No' or control_performed == 'لا'",
		},
	});

	// Question 52: Type of Control
	composer.slide({ pageProgress: "46/57" });
	composer.selectBox("control_type", {
		question: translate(localization, {
			en: "Type of Control",
			ar: "نوع المكافحة",
		}),
		options:
			localization === "ar"
				? ["كيميائية", "بيولوجية", "ميكانيكية", "متكاملة"]
				: ["Chemical", "Biological", "Mechanical", "Integrated"],
		required: false,
	});

	// Question 53: Pesticide Group Type
	composer.slide({ pageProgress: "47/57" });
	composer.textInput("pesticide_group_type", {
		question: translate(localization, {
			en: "Type of Pesticide Group",
			ar: "نوع مجموعة المبيد",
		}),
		placeholder: translate(localization, {
			en: "Enter pesticide group",
			ar: "أدخل مجموعة المبيد",
		}),
		required: false,
	});

	// Question 54: Control Method
	composer.slide({ pageProgress: "48/57" });
	composer.selectBox("control_method", {
		question: translate(localization, {
			en: "Control Method",
			ar: "طريقة المكافحة",
		}),
		options:
			localization === "ar"
				? ["رش", "تبخير", "طعوم", "مصائد", "أخرى"]
				: ["Spraying", "Fumigation", "Baits", "Traps", "Other"],
		required: false,
	});

	// Question 55: Pesticide Group Type 2
	composer.slide({ pageProgress: "49/57" });
	composer.textInput("pesticide_group_type_2", {
		question: translate(localization, {
			en: "Type of Pesticide Group (Secondary)",
			ar: "نوع مجموعة المبيد (ثانوي)",
		}),
		placeholder: translate(localization, {
			en: "Enter pesticide group",
			ar: "أدخل مجموعة المبيد",
		}),
		required: false,
	});

	// Question 56: Type of Control 2
	composer.slide({ pageProgress: "50/57" });
	composer.selectBox("control_type_2", {
		question: translate(localization, {
			en: "Type of Control (Secondary)",
			ar: "نوع المكافحة (ثانوي)",
		}),
		options:
			localization === "ar"
				? ["كيميائية", "بيولوجية", "ميكانيكية", "متكاملة"]
				: ["Chemical", "Biological", "Mechanical", "Integrated"],
		required: false,
	});

	// Question 57: Pesticide Group Type 3
	composer.slide({ pageProgress: "51/57" });
	composer.textInput("pesticide_group_type_3", {
		question: translate(localization, {
			en: "Type of Pesticide Group (Tertiary)",
			ar: "نوع مجموعة المبيد (ثالث)",
		}),
		placeholder: translate(localization, {
			en: "Enter pesticide group",
			ar: "أدخل مجموعة المبيد",
		}),
		required: false,
	});

	return composer;
}
