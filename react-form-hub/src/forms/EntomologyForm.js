import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createEntomologyFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "entomology-form",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "علم الحشرات",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Entomology Form",
			ar: "الاستكشاف والمكافحة الحشرية",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this entomology investigation form.",
			ar: "الاستكشاف والمكافحة الحشرية",
		}),
	);

	// Question 1: Date
	composer.slide({ pageProgress: "1/66" });
	composer.textInput("date", {
		question: translate(localization, {
			en: "Date",
			ar: "التاريخ",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: true,
	});

	// Question 2: Coordinates
	composer.slide({ pageProgress: "2/66" });
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

	// Question 3: Residential District Name
	composer.slide({ pageProgress: "3/66" });
	composer.textInput("residential_district", {
		question: translate(localization, {
			en: "Residential District Name",
			ar: "اسم الحي السكني",
		}),
		placeholder: translate(localization, {
			en: "Enter district name",
			ar: "أدخل اسم الحي",
		}),
		required: true,
	});

	// Question 4: Valley Name (for Schistosomiasis and Malaria)
	composer.slide({ pageProgress: "4/66" });
	composer.textInput("valley_name", {
		question: translate(localization, {
			en: "Valley Name (for Schistosomiasis and Malaria)",
			ar: "اسم الوادي (خاص بالبلهارسيا والملاريا)",
		}),
		placeholder: translate(localization, {
			en: "Enter valley name",
			ar: "أدخل اسم الوادي",
		}),
		required: false,
	});

	// Question 5: Breeding Site Description and Type
	composer.slide({ pageProgress: "5/66" });
	composer.textInput("breeding_site_description", {
		question: translate(localization, {
			en: "Breeding Site Description and Type",
			ar: "وصف ونوع بؤرة التوالد",
		}),
		placeholder: translate(localization, {
			en: "Describe breeding site",
			ar: "صف بؤرة التوالد",
		}),
		required: false,
	});

	// Question 6: Other Breeding Site
	composer.slide({ pageProgress: "6/66" });
	composer.textInput("other_breeding_site", {
		question: translate(localization, {
			en: "Other (Specify Breeding Site)",
			ar: "أخرى (حدد بؤرة التوالد)",
		}),
		placeholder: translate(localization, {
			en: "Specify other breeding site",
			ar: "حدد بؤرة التوالد الأخرى",
		}),
		required: false,
	});

	// Question 7: Risk Factors
	composer.slide({ pageProgress: "7/66" });
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

	// Question 8: Risk Factor Result
	composer.slide({ pageProgress: "8/66" });
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

	// Question 9: Site Exploration Status
	composer.slide({ pageProgress: "9/66" });
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

	// Question 10: Reasons for Not Completing Exploration
	composer.slide({ pageProgress: "10/66" });
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

	// Question 11: Other Exploration Incomplete Reason
	composer.slide({ pageProgress: "11/66" });
	composer.textInput("other_exploration_incomplete", {
		question: translate(localization, {
			en: "Other (Specify reason for not completing exploration)",
			ar: "أخرى (حدد سبب عدم استكمال الاستكشاف)",
		}),
		placeholder: translate(localization, {
			en: "Specify other reason",
			ar: "حدد السبب الآخر",
		}),
		required: false,
	});

	// Question 12: Aquatic Stage Present
	composer.slide({ pageProgress: "12/66" });
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

	// Question 13: Adult Mosquitoes Present
	composer.slide({ pageProgress: "13/66" });
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

	// Question 14: Ticks Present
	composer.slide({ pageProgress: "14/66" });
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

	// Question 15: Control Performed at Site
	composer.slide({ pageProgress: "15/66" });
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

	// Question 16: Reason for Not Performing Control
	composer.slide({ pageProgress: "16/66" });
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

	// Control Information Section
	composer.slide({ pageProgress: "17/66" });
	composer.h2(
		translate(localization, {
			en: "Control Information",
			ar: "معلومات المكافحة",
		}),
	);

	// Question 17: Type of Control
	composer.selectBox("control_type", {
		question: translate(localization, {
			en: "Type of Control",
			ar: "نوع المكافحة",
		}),
		options:
			localization === "ar"
				? ["كيميائية", "بيولوجية", "ميكانيكية", "متكاملة", "لا يوجد"]
				: ["Chemical", "Biological", "Mechanical", "Integrated", "None"],
		required: false,
	});

	// Question 18: Pesticide Group Type
	composer.slide({ pageProgress: "18/66" });
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

	// Question 19: Type of Control 2
	composer.slide({ pageProgress: "19/66" });
	composer.selectBox("control_type_2", {
		question: translate(localization, {
			en: "Type of Control (Secondary)",
			ar: "نوع المكافحة (ثانوي)",
		}),
		options:
			localization === "ar"
				? ["كيميائية", "بيولوجية", "ميكانيكية", "متكاملة", "لا يوجد"]
				: ["Chemical", "Biological", "Mechanical", "Integrated", "None"],
		required: false,
	});

	// Question 20: Pesticide Group Type 2
	composer.slide({ pageProgress: "20/66" });
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

	// Question 21: Type of Control 3
	composer.slide({ pageProgress: "21/66" });
	composer.selectBox("control_type_3", {
		question: translate(localization, {
			en: "Type of Control (Tertiary)",
			ar: "نوع المكافحة (ثالث)",
		}),
		options:
			localization === "ar"
				? ["كيميائية", "بيولوجية", "ميكانيكية", "متكاملة", "لا يوجد"]
				: ["Chemical", "Biological", "Mechanical", "Integrated", "None"],
		required: false,
	});

	// Question 22: Pesticide Group Type 3
	composer.slide({ pageProgress: "22/66" });
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

	// Pesticide Details Section
	composer.slide({ pageProgress: "23/66" });
	composer.h2(
		translate(localization, {
			en: "Pesticide Details",
			ar: "تفاصيل المبيد",
		}),
	);

	// Question 23: Scientific Name of Pesticide
	composer.textInput("pesticide_scientific_name", {
		question: translate(localization, {
			en: "Scientific Name of Pesticide",
			ar: "الاسم العلمي للمبيد",
		}),
		placeholder: translate(localization, {
			en: "Enter scientific name",
			ar: "أدخل الاسم العلمي",
		}),
		required: false,
	});

	// Question 24: Commercial Name of Pesticide
	composer.slide({ pageProgress: "24/66" });
	composer.textInput("pesticide_commercial_name", {
		question: translate(localization, {
			en: "Commercial Name of Pesticide",
			ar: "الاسم التجاري للمبيد",
		}),
		placeholder: translate(localization, {
			en: "Enter commercial name",
			ar: "أدخل الاسم التجاري",
		}),
		required: false,
	});

	// Question 25: Active Ingredient Concentration
	composer.slide({ pageProgress: "25/66" });
	composer.textInput("active_ingredient_concentration", {
		question: translate(localization, {
			en: "Active Ingredient Concentration",
			ar: "تركيز المادة الفعالة",
		}),
		placeholder: translate(localization, {
			en: "Enter concentration (%)",
			ar: "أدخل التركيز (%)",
		}),
		required: false,
	});

	// Question 26: Pesticide Amount Consumed
	composer.slide({ pageProgress: "26/66" });
	composer.numberInput("pesticide_amount_consumed", {
		question: translate(localization, {
			en: "Pesticide Amount Consumed (kg/L)",
			ar: "كمية المبيد المستهلك (كجم/لتر)",
		}),
		min: 0,
		max: 10000,
	});

	// Question 27: Spraying Method
	composer.slide({ pageProgress: "27/66" });
	composer.selectBox("spraying_method", {
		question: translate(localization, {
			en: "Spraying Method",
			ar: "طريقة الرش",
		}),
		options:
			localization === "ar"
				? ["رش يدوي", "رش آلي", "تبخير", "ضباب حراري", "ضباب بارد", "أخرى"]
				: ["Manual Spray", "Mechanical Spray", "Fumigation", "Thermal Fog", "Cold Fog", "Other"],
		required: false,
	});

	// Question 28: Area Covered by Pesticide
	composer.slide({ pageProgress: "28/66" });
	composer.numberInput("area_covered_pesticide", {
		question: translate(localization, {
			en: "Area Covered by Pesticide (m²)",
			ar: "المساحة المغطاة بالمبيد (م²)",
		}),
		min: 0,
		max: 1000000,
	});

	// Question 29: Type of Treated Site
	composer.slide({ pageProgress: "29/66" });
	composer.selectBox("treated_site_type", {
		question: translate(localization, {
			en: "Type of Treated Site",
			ar: "نوع الموقع المعالج",
		}),
		options:
			localization === "ar"
				? ["سكني", "تجاري", "صناعي", "زراعي", "مفتوح", "أخرى"]
				: ["Residential", "Commercial", "Industrial", "Agricultural", "Open", "Other"],
		required: false,
	});

	// Question 30: Residual Pesticide Spraying
	composer.slide({ pageProgress: "30/66" });
	composer.choiceInput("residual_pesticide_spraying", {
		question: translate(localization, {
			en: "Residual Pesticide Spraying",
			ar: "الرش بالمبيد ذو الأثر الباقي",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 31: Number of Sprayed Rooms
	composer.slide({ pageProgress: "31/66" });
	composer.numberInput("sprayed_rooms_count", {
		question: translate(localization, {
			en: "Number of Sprayed Rooms",
			ar: "عدد الغرف المرشوشة",
		}),
		min: 0,
		max: 1000,
	});

	// Question 32: Sprayed Area
	composer.slide({ pageProgress: "32/66" });
	composer.numberInput("sprayed_area", {
		question: translate(localization, {
			en: "Sprayed Area (m²)",
			ar: "المساحة المرشوشة (م²)",
		}),
		min: 0,
		max: 1000000,
	});

	// Additional Pesticide Information
	composer.slide({ pageProgress: "33/66" });
	composer.h2(
		translate(localization, {
			en: "Additional Pesticide Information",
			ar: "معلومات إضافية عن المبيد",
		}),
	);

	// Question 33: Pesticide Name
	composer.textInput("pesticide_name", {
		question: translate(localization, {
			en: "Pesticide Name",
			ar: "اسم المبيد",
		}),
		placeholder: translate(localization, {
			en: "Enter pesticide name",
			ar: "أدخل اسم المبيد",
		}),
		required: false,
	});

	// Question 34: Concentration
	composer.slide({ pageProgress: "34/66" });
	composer.textInput("concentration", {
		question: translate(localization, {
			en: "Concentration",
			ar: "التركيز",
		}),
		placeholder: translate(localization, {
			en: "Enter concentration",
			ar: "أدخل التركيز",
		}),
		required: false,
	});

	// Question 35: Quantity
	composer.slide({ pageProgress: "35/66" });
	composer.numberInput("quantity", {
		question: translate(localization, {
			en: "Quantity",
			ar: "الكمية",
		}),
		min: 0,
		max: 100000,
	});

	// Trap Information Section
	composer.slide({ pageProgress: "36/66" });
	composer.h2(
		translate(localization, {
			en: "Trap Information",
			ar: "معلومات المصائد",
		}),
	);

	// Question 36: Trap Type
	composer.selectBox("trap_type", {
		question: translate(localization, {
			en: "Trap Type",
			ar: "نوع المصيدة",
		}),
		options:
			localization === "ar"
				? ["مصيدة ضوئية", "مصيدة CO2", "مصيدة لاصقة", "مصيدة مائية", "أخرى", "لا يوجد"]
				: ["Light Trap", "CO2 Trap", "Sticky Trap", "Water Trap", "Other", "None"],
		required: false,
	});

	// Question 37: Is Trap Positive
	composer.slide({ pageProgress: "37/66" });
	composer.choiceInput("trap_positive", {
		question: translate(localization, {
			en: "Is the trap positive?",
			ar: "هل المصيدة إيجابية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 38: Trap Coordinates
	composer.slide({ pageProgress: "38/66" });
	composer.textInput("trap_coordinates", {
		question: translate(localization, {
			en: "Trap Coordinates",
			ar: "احداثيات المصيدة",
		}),
		placeholder: translate(localization, {
			en: "Enter trap coordinates",
			ar: "أدخل احداثيات المصيدة",
		}),
		required: false,
	});

	// Sample Information Section
	composer.slide({ pageProgress: "39/66" });
	composer.h2(
		translate(localization, {
			en: "Sample Information",
			ar: "معلومات العينة",
		}),
	);

	// Question 39: Sample Code
	composer.textInput("sample_code", {
		question: translate(localization, {
			en: "Sample Code",
			ar: "رمز العينة",
		}),
		placeholder: translate(localization, {
			en: "Enter sample code",
			ar: "أدخل رمز العينة",
		}),
		required: false,
	});

	// Question 40: Sample Collection Date
	composer.slide({ pageProgress: "40/66" });
	composer.textInput("sample_collection_date", {
		question: translate(localization, {
			en: "Sample Collection Date",
			ar: "تاريخ جمع العينة",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
	});

	// Question 41: Sample Classification Date
	composer.slide({ pageProgress: "41/66" });
	composer.textInput("sample_classification_date", {
		question: translate(localization, {
			en: "Sample Classification Date",
			ar: "تاريخ تصنيف العينة",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
	});

	// Question 42: Total Aquatic Stage Mosquitoes
	composer.slide({ pageProgress: "42/66" });
	composer.numberInput("total_aquatic_stage", {
		question: translate(localization, {
			en: "Total Aquatic Stage Mosquitoes in Sample",
			ar: "اجمالي عدد الطور المائي للبعوض بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 43: Total Adult Mosquitoes
	composer.slide({ pageProgress: "43/66" });
	composer.numberInput("total_adult_mosquitoes", {
		question: translate(localization, {
			en: "Total Adult Mosquitoes in Sample",
			ar: "اجمالي عدد البعوض البالغ بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 44: Total Ticks
	composer.slide({ pageProgress: "44/66" });
	composer.numberInput("total_ticks", {
		question: translate(localization, {
			en: "Total Ticks in Sample",
			ar: "اجمالي عدد القراد بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 45: Total Sandflies
	composer.slide({ pageProgress: "45/66" });
	composer.numberInput("total_sandflies", {
		question: translate(localization, {
			en: "Total Sandflies in Sample",
			ar: "اجمالي عدد الذباب الرملي بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 46: Tick Classification
	composer.slide({ pageProgress: "46/66" });
	composer.textInput("tick_classification", {
		question: translate(localization, {
			en: "Tick Classification by Type and Stage",
			ar: "تصنيف القراد حسب النوع و الطور",
		}),
		placeholder: translate(localization, {
			en: "Enter classification",
			ar: "أدخل التصنيف",
		}),
		required: false,
	});

	// Aedes Mosquito Classification Section
	composer.slide({ pageProgress: "47/66" });
	composer.h2(
		translate(localization, {
			en: "Aedes Mosquito Classification",
			ar: "تصنيف بعوض الزاعجة (Aedes)",
		}),
	);

	// Question 47: 1st + 2nd (Aedes)
	composer.numberInput("aedes_1st_2nd", {
		question: translate(localization, {
			en: "1st + 2nd Instar (Aedes)",
			ar: "الطور الأول + الثاني (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 48: 3rd + 4th (Aedes)
	composer.slide({ pageProgress: "48/66" });
	composer.numberInput("aedes_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Aedes)",
			ar: "الطور الثالث + الرابع (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 49: Adult M (Aedes)
	composer.slide({ pageProgress: "49/66" });
	composer.numberInput("aedes_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Aedes)",
			ar: "البالغ الذكر (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 50: Adult F (Aedes)
	composer.slide({ pageProgress: "50/66" });
	composer.numberInput("aedes_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Aedes)",
			ar: "البالغ الأنثى (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 51: Ae.spp. (Aedes)
	composer.slide({ pageProgress: "51/66" });
	composer.numberInput("aedes_spp", {
		question: translate(localization, {
			en: "Ae.spp. (Aedes species)",
			ar: "أنواع الزاعجة (Ae.spp.)",
		}),
		min: 0,
		max: 100000,
	});

	// Culex Mosquito Classification Section
	composer.slide({ pageProgress: "52/66" });
	composer.h2(
		translate(localization, {
			en: "Culex Mosquito Classification",
			ar: "تصنيف بعوض الكيولكس (Culex)",
		}),
	);

	// Question 52: 1st + 2nd (Culex)
	composer.numberInput("culex_1st_2nd", {
		question: translate(localization, {
			en: "1st + 2nd Instar (Culex)",
			ar: "الطور الأول + الثاني (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 53: 3rd + 4th (Culex)
	composer.slide({ pageProgress: "53/66" });
	composer.numberInput("culex_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Culex)",
			ar: "الطور الثالث + الرابع (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 54: Adult M (Culex)
	composer.slide({ pageProgress: "54/66" });
	composer.numberInput("culex_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Culex)",
			ar: "البالغ الذكر (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 55: Adult F (Culex)
	composer.slide({ pageProgress: "55/66" });
	composer.numberInput("culex_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Culex)",
			ar: "البالغ الأنثى (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 56: Culex spp.
	composer.slide({ pageProgress: "56/66" });
	composer.numberInput("culex_spp", {
		question: translate(localization, {
			en: "Culex spp. (Culex species)",
			ar: "أنواع الكيولكس (Culex spp.)",
		}),
		min: 0,
		max: 100000,
	});

	// Anopheles Mosquito Classification Section
	composer.slide({ pageProgress: "57/66" });
	composer.h2(
		translate(localization, {
			en: "Anopheles Mosquito Classification",
			ar: "تصنيف بعوض الأنوفيليس (Anopheles)",
		}),
	);

	// Question 57: 1st + 2nd (Anopheles)
	composer.numberInput("anopheles_1st_2nd", {
		question: translate(localization, {
			en: "1st + 2nd Instar (Anopheles)",
			ar: "الطور الأول + الثاني (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 58: 3rd + 4th (Anopheles)
	composer.slide({ pageProgress: "58/66" });
	composer.numberInput("anopheles_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Anopheles)",
			ar: "الطور الثالث + الرابع (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 59: Adult M (Anopheles)
	composer.slide({ pageProgress: "59/66" });
	composer.numberInput("anopheles_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Anopheles)",
			ar: "البالغ الذكر (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 60: Adult F (Anopheles)
	composer.slide({ pageProgress: "60/66" });
	composer.numberInput("anopheles_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Anopheles)",
			ar: "البالغ الأنثى (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 61: An.spp. (Anopheles)
	composer.slide({ pageProgress: "61/66" });
	composer.numberInput("anopheles_spp", {
		question: translate(localization, {
			en: "An.spp. (Anopheles species)",
			ar: "أنواع الأنوفيليس (An.spp.)",
		}),
		min: 0,
		max: 100000,
	});

	// Sandfly Classification Section
	composer.slide({ pageProgress: "62/66" });
	composer.h2(
		translate(localization, {
			en: "Sandfly Classification",
			ar: "تصنيف الذباب الرملي",
		}),
	);

	// Question 62: Adult M (Sandfly)
	composer.numberInput("sandfly_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Sandfly)",
			ar: "البالغ الذكر (ذباب رملي)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 63: Adult F (Sandfly)
	composer.slide({ pageProgress: "63/66" });
	composer.numberInput("sandfly_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Sandfly)",
			ar: "البالغ الأنثى (ذباب رملي)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 64: Ser.spp (Sandfly)
	composer.slide({ pageProgress: "64/66" });
	composer.numberInput("sandfly_ser_spp", {
		question: translate(localization, {
			en: "Ser.spp (Sergentomyia species)",
			ar: "أنواع سيرجنتوميا (Ser.spp)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 65: Ph.spp (Sandfly)
	composer.slide({ pageProgress: "65/66" });
	composer.numberInput("sandfly_ph_spp", {
		question: translate(localization, {
			en: "Ph.spp (Phlebotomus species)",
			ar: "أنواع فليبوتوموس (Ph.spp)",
		}),
		min: 0,
		max: 100000,
	});

	// Snail Information Section
	composer.slide({ pageProgress: "66/66" });
	composer.h2(
		translate(localization, {
			en: "Snail Information",
			ar: "معلومات القواقع",
		}),
	);

	// Question 66: Snails Present
	composer.choiceInput("snails_present", {
		question: translate(localization, {
			en: "Are there snails?",
			ar: "هل يوجد قواقع؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 67: Total Snails
	composer.numberInput("total_snails", {
		question: translate(localization, {
			en: "Total Snails in Sample",
			ar: "اجمالي عدد القواقع بالعينة",
		}),
		min: 0,
		max: 100000,
		displayCondition: {
			dependencies: ["snails_present"],
			condition: "snails_present == 'Yes' or snails_present == 'نعم'",
		},
	});

	// Question 68: Snail Type
	composer.textInput("snail_type", {
		question: translate(localization, {
			en: "Snail Type",
			ar: "نوع القواقع",
		}),
		placeholder: translate(localization, {
			en: "Enter snail type",
			ar: "أدخل نوع القواقع",
		}),
		required: false,
		displayCondition: {
			dependencies: ["snails_present"],
			condition: "snails_present == 'Yes' or snails_present == 'نعم'",
		},
	});

	return composer;
}
