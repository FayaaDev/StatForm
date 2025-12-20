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
		postUrl: "https://script.google.com/macros/s/AKfycbyTgCrHwnb9b2mna9CULKd-kBfWMoZzMLRrj4tuOtumG-_FQ7wYxl99fsAO5Cg7mmTNnQ/exec",
		_sheetName: "الاستكشاف والمكافحة الحشرية",
		_sheetId: "11xxGYXPb3Gi0VkXeWVki1jw0p_SgZUTxkpsig1hCKok",
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
			en: "Please complete this  form.",
			ar: "الاستكشاف والمكافحة الحشرية",
		}),
	);

	// Question 1: Investigation Number
	composer.slide({ pageProgress: "1/70" });
	composer.textInput("investigation_number", {
		question: translate(localization, {
			en: "Investigation Number",
			ar: "رمز التقصي",
		}),
		placeholder: translate(localization, {
			en: "Enter investigation number",
			ar: "أدخل رمز التقصي",
		}),
		required: true,
	});

	// Question 2: Date
	composer.slide({ pageProgress: "2/70" });
	composer.dateInput("date", {
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
	composer.slide({ pageProgress: "3/70" });
	composer.p(
		translate(localization, {
			en: "Enter coordinates in decimal degrees format (latitude, longitude). Use one of these formats:\n• With semicolon: 25.4445;37.3024\n• With comma and space: 26.2424, 36.4638\nThe first number is latitude (north-south), the second is longitude (east-west).",
			ar: "أدخل الإحداثيات بصيغة الدرجات العشرية (خط العرض، خط الطول). استخدم الفاصلة المنقوطة (;) او الفاصلة العادية (:) مثال: 25.4445;37.3024 او 26.2424:36.4638 الرقم الأول هو خط العرض والثاني هو خط الطول.",
		}),
	);
	composer.textInput("coordinates", {
		question: translate(localization, {
			en: "Coordinates",
			ar: "الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter coordinates (e.g., 25.4445;37.3024 or 26.2424, 36.4638)",
			ar: "أدخل الإحداثيات (مثال: 25.4445;37.3024 أو 26.2424, 36.4638)",
		}),
		required: true,
		pattern: "^\\d+\\.\\d+[;,]\\s*\\d+\\.\\d+$",
		patternError: translate(localization, {
			en: "Please enter coordinates in format: 25.4445;37.3024 or 26.2424, 36.4638",
			ar: "الرجاء إدخال الإحداثيات بالصيغة: 25.4445;37.3024 أو 26.2424, 36.4638",
		}),
	});

	// Question 3: Residential District Name
	composer.slide({ pageProgress: "4/70" });
	composer.textInput("residential_district", {
		question: translate(localization, {
			en: "Residential District Name",
			ar: "اسم الحي السكني",
		}),
		placeholder: translate(localization, {
			en: "Enter residential district name",
			ar: "أدخل اسم الحي السكني",
		}),
		required: true,
	});

	// Question 3a: Other Residential District (conditional)
	composer.textInput("residential_district_other", {
		question: translate(localization, {
			en: "Specify Other District",
			ar: "حدد الحي الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter district name",
			ar: "أدخل اسم الحي",
		}),
		required: true,
		displayCondition: {
			dependencies: ["residential_district"],
			condition: "residential_district == 'أخرى' or residential_district == 'Other'",
		},
	});

	// Question 4: Valley Name (for Schistosomiasis and Malaria)
	composer.slide({ pageProgress: "5/70" });
	composer.selectBox("valley_name", {
		question: translate(localization, {
			en: "Valley Name (for Schistosomiasis and Malaria)",
			ar: "اسم الوادي (خاص بالبلهارسيا والملاريا)",
		}),
		options:
			localization === "ar"
				? [
					"أبو شعيب",
					"أبو عروة",
					"أجياد",
					"أحد",
					"الأندلس",
					"البحيرات",
					"البرابر",
					"البركة",
					"البيبان",
					"البساتين",
					"أخرى",
				]
				: [
					"Abu Shuaib",
					"Abu Arwa",
					"Ajyad",
					"Uhud",
					"Al-Andalus",
					"Al-Buhayrat",
					"Al-Barabir",
					"Al-Birka",
					"Al-Biban",
					"Al-Basatin",
					"Other",
				],
		required: false,
	});

	// Question 4a: Other Valley Name (conditional)
	composer.textInput("valley_name_other", {
		question: translate(localization, {
			en: "Specify Other Valley",
			ar: "حدد الوادي الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter valley name",
			ar: "أدخل اسم الوادي",
		}),
		required: false,
		displayCondition: {
			dependencies: ["valley_name"],
			condition: "valley_name == 'أخرى' or valley_name == 'Other'",
		},
	});

	// Question 5: Breeding Site Description and Type
	composer.slide({ pageProgress: "6/70" });
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
	composer.slide({ pageProgress: "7/70" });
	composer.selectBox("other_breeding_site", {
		question: translate(localization, {
			en: "Other (Specify Breeding Site)",
			ar: "أخرى (حدد بؤرة التوالد)",
		}),
		options:
			localization === "ar"
				? [
					"دورة مياه",
					"مخزن",
					"غرفة نوم",
					"غرفة معيشة",
					"مطبخ",
					"بدروم",
					"سطح",
					"مدخل منزل",
					"مواقف سيارات",
					"خزان صرف صحي",
					"خزان مكشوف",
					"نقاط تفتيش",
					"مستشفى",
					"قاعة افراح",
					"ورشة",
					"مصنع",
					"محطة كهرباء",
					"معرض سيارات",
					"مستودع",
					"بنشر",
					"تشليح سيارات",
					"مصنع بلك",
					"مسلخ",
					"محل غاز",
					"مبني حكومي",
					"محطة بنزين",
					"مدرسة او معهد",
					"جامعة",
					"شركة",
					"مسجد",
					"مطعم",
					"اماكن ترفيهية",
					"مكاتب",
					"مركز تجاري",
					"محطة معالجة مياه",
					"محل تجاري",
					"أحواش",
					"استراحات",
					"مجري سيل",
					"مستنقع",
					"بحيرة",
					"حظائر حيوان",
					"حلقة اغنام",
					"بنقلة سمك",
					"بركة ماء عذبه",
					"بركة ماء ملوثة",
					"حمام سباحة",
					"ارض خضراء",
					"ملعب كرة قدم",
					"قرية سياحية",
					"مشتل",
					"مزرعة",
					"متحف",
					"حديقة",
					"مبنى تحت الإنشاء",
					"مرمى بلدية",
					"طريق",
					"مخطط",
					"منطقة صحراوية",
					"أخرى",
				]
				: [
					"Bathroom",
					"Storage",
					"Bedroom",
					"Living Room",
					"Kitchen",
					"Basement",
					"Roof",
					"House Entrance",
					"Parking",
					"Sewage Tank",
					"Open Tank",
					"Checkpoint",
					"Hospital",
					"Wedding Hall",
					"Workshop",
					"Factory",
					"Power Station",
					"Car Showroom",
					"Warehouse",
					"Tire Shop",
					"Car Scrapyard",
					"Block Factory",
					"Slaughterhouse",
					"Gas Station",
					"Government Building",
					"Petrol Station",
					"School or Institute",
					"University",
					"Company",
					"Mosque",
					"Restaurant",
					"Entertainment Venue",
					"Offices",
					"Shopping Center",
					"Water Treatment Plant",
					"Commercial Shop",
					"Yards",
					"Rest Areas",
					"Stream",
					"Swamp",
					"Lake",
					"Animal Pens",
					"Sheep Pen",
					"Fish Pond",
					"Freshwater Pool",
					"Polluted Water Pool",
					"Swimming Pool",
					"Green Land",
					"Football Field",
					"Tourist Village",
					"Nursery",
					"Farm",
					"Museum",
					"Garden",
					"Building Under Construction",
					"Municipal Dump",
					"Road",
					"Planning Area",
					"Desert Area",
					"Other",
				],
		required: false,
	});

	// Question 6a: Other Breeding Site Specification (conditional)
	composer.textInput("other_breeding_site_specify", {
		question: translate(localization, {
			en: "Specify Other Breeding Site",
			ar: "حدد بؤرة التوالد الأخرى",
		}),
		placeholder: translate(localization, {
			en: "Enter breeding site details",
			ar: "أدخل تفاصيل بؤرة التوالد",
		}),
		required: false,
		displayCondition: {
			dependencies: ["other_breeding_site"],
			condition: "other_breeding_site == 'أخرى' or other_breeding_site == 'Other'",
		},
	});

	// Question 7: Risk Factors
	composer.slide({ pageProgress: "8/70" });
	composer.selectBox("risk_factors", {
		question: translate(localization, {
			en: "Risk Factors",
			ar: "عوامل الخطورة",
		}),
		options:
			localization === "ar"
				? [
					"حاويات مياه مهملة",
					"التسريبات",
					"البرادات",
					"خزانات مكشوفة",
					"صاج المكيف",
					"صاج البرادات",
					"حمامات غير مستخدمة",
					"مزارع الحيوانات",
					"مسالخ الحيوانات",
					"تواجد الحيوانات الأليفة",
					"فراء الحيوانات",
					"المحاجر البيطرية",
					"فضلات الحيوانات",
					"مسابح مهملة",
					"مزهريات",
					"احواض زينة/اسماك",
					"خزان علوي",
					"حاويات النفايات",
					"الإطارات",
					"حوض اسمنتي",
					"مياه سطحية",
					"مياه للري",
					"أخرى",
				]
				: [
					"Abandoned Water Containers",
					"Leaks",
					"Coolers",
					"Open Tanks",
					"AC Trays",
					"Cooler Trays",
					"Unused Bathrooms",
					"Animal Farms",
					"Animal Slaughterhouses",
					"Presence of Pets",
					"Animal Fur",
					"Veterinary Quarantines",
					"Animal Waste",
					"Abandoned Pools",
					"Vases",
					"Decorative/Fish Tanks",
					"Overhead Tank",
					"Waste Containers",
					"Tires",
					"Cement Basin",
					"Surface Water",
					"Irrigation Water",
					"Other",
				],
		required: false,
	});

	// Question 7a: Other Risk Factor Specification (conditional)
	composer.textInput("risk_factors_other", {
		question: translate(localization, {
			en: "Specify Other Risk Factor",
			ar: "حدد عامل الخطورة الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter risk factor details",
			ar: "أدخل تفاصيل عامل الخطورة",
		}),
		required: false,
		displayCondition: {
			dependencies: ["risk_factors"],
			condition: "risk_factors == 'أخرى' or risk_factors == 'Other'",
		},
	});

	// Question 8: Risk Factor Result
	composer.slide({ pageProgress: "9/70" });
	composer.selectBox("risk_factor_result", {
		question: translate(localization, {
			en: "Risk Factor Result",
			ar: "نتيجة عامل الخطورة",
		}),
		options:
			localization === "ar"
				? ["إيجابي", "سلبي"]
				: ["Positive", "Negative"],
		required: false,
	});

	// Question 9: Site Exploration Status
	composer.slide({ pageProgress: "10/70" });
	composer.selectBox("site_exploration_status", {
		question: translate(localization, {
			en: "Site Exploration Status",
			ar: "حالة استكشاف الموقع",
		}),
		options:
			localization === "ar"
				? [
					"تم الاستكشاف الكامل",
					"تم الاستكشاف داخل المنزل فقط",
					"تم استكشاف فناء المنزل فقط",
					"تم استكشاف المنطقة المحيطة بالفناء فقط",
					"تم استكشاف الفناء والمنطقة المحيطة به",
					"لم يتم الاستكشاف",
				]
				: [
					"Fully Explored",
					"Explored Inside House Only",
					"Explored House Yard Only",
					"Explored Area Surrounding Yard Only",
					"Explored Yard and Surrounding Area",
					"Not Explored",
				],
		required: false,
	});

	// Question 10: Reasons for Not Completing Exploration
	composer.slide({ pageProgress: "11/70" });
	composer.selectBox("exploration_incomplete_reasons", {
		question: translate(localization, {
			en: "Reasons for not completing exploration",
			ar: "أسباب عدم استكمال عملية الاستكشاف",
		}),
		options:
			localization === "ar"
				? [
					"لايوجد أحد",
					"لايوجد محرم",
					"لايوجد أداة استكشاف",
					"لايوجد موظف استكشاف",
					"صاحب المنزل لايرغب",
					"صعوبة الوصول للمكان",
					"أخرى",
				]
				: [
					"No One Present",
					"No Guardian Present",
					"No Exploration Tools",
					"No Exploration Staff",
					"Homeowner Refuses",
					"Difficult to Access Location",
					"Other",
				],
		required: false,
	});

	// Question 10a: Other Exploration Incomplete Reason (conditional)
	composer.textInput("exploration_incomplete_reasons_other", {
		question: translate(localization, {
			en: "Specify Other Reason",
			ar: "حدد السبب الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter other reason",
			ar: "أدخل السبب الآخر",
		}),
		required: false,
		displayCondition: {
			dependencies: ["exploration_incomplete_reasons"],
			condition: "exploration_incomplete_reasons == 'أخرى' or exploration_incomplete_reasons == 'Other'",
		},
	});

	// Question 11: Other Exploration Incomplete Reason
	composer.slide({ pageProgress: "12/70" });
	composer.textInput("other_exploration_incomplete", {
		question: translate(localization, {
			en: "Other (Specify reason for not completing exploration)",
			ar: "أخرى (حدد سبب عدم استكشاف الموقع)",
		}),
		placeholder: translate(localization, {
			en: "Specify other reason",
			ar: "حدد السبب الآخر",
		}),
		required: false,
	});

	// Question 12: Aquatic Stage Present
	composer.slide({ pageProgress: "13/70" });
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
	composer.slide({ pageProgress: "14/70" });
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
	composer.slide({ pageProgress: "15/70" });
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
	composer.slide({ pageProgress: "16/70" });
	composer.selectBox("control_performed", {
		question: translate(localization, {
			en: "Was control performed at the site?",
			ar: "هل تمت المكافحة بالموقع؟",
		}),
		options:
			localization === "ar"
				? [
					"تمت المكافحة بشكل كامل",
					"تمت المكافحة داخل المنزل فقط",
					"تم مكافحة فناء المنزل فقط",
					"تمت مكافحة المنطقة المحيطة بالفناء فقط",
					"تمت مكافحة الفناء والمنطقة المحيطة به",
					"لم تتم المكافحة",
				]
				: [
					"Fully Controlled",
					"Controlled Inside House Only",
					"Controlled House Yard Only",
					"Controlled Area Surrounding Yard Only",
					"Controlled Yard and Surrounding Area",
					"Not Controlled",
				],
		required: false,
	});

	// Question 16: Reason for Not Performing Control
	composer.slide({ pageProgress: "17/70" });
	composer.selectBox("no_control_reason", {
		question: translate(localization, {
			en: "Reason for not performing control",
			ar: "سبب عدم المكافحة في حال لم تتم",
		}),
		options:
			localization === "ar"
				? [
					"لايوجد أحد",
					"لايوجد محرم",
					"لايوجد أداة مكافحة",
					"لايوجد موظف مكافحة",
					"صاحب المنزل لايرغب",
					"صعوبة الوصول للمكان",
					"أخرى",
				]
				: [
					"No One Present",
					"No Guardian Present",
					"No Control Tools",
					"No Control Staff",
					"Homeowner Refuses",
					"Difficult to Access Location",
					"Other",
				],
		required: false,
		displayCondition: {
			dependencies: ["control_performed"],
			condition: "control_performed == 'لم تتم المكافحة' or control_performed == 'Not Controlled'",
		},
	});

	// Question 16a: Other Control Reason (conditional)
	composer.textInput("no_control_reason_other", {
		question: translate(localization, {
			en: "Specify Other Reason",
			ar: "حدد السبب الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter other reason",
			ar: "أدخل السبب الآخر",
		}),
		required: false,
		displayCondition: {
			dependencies: ["no_control_reason"],
			condition: "no_control_reason == 'أخرى' or no_control_reason == 'Other'",
		},
	});

	// Control Information Section
	composer.slide({ pageProgress: "18/70" });
	composer.h2(
		translate(localization, {
			en: "Control Information",
			ar: "معلومات المكافحة",
		}),
	);

	// Larval Control Subsection
	composer.h3(
		translate(localization, {
			en: "Larval Stage Control",
			ar: "مكافحة الطور اليرقي",
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
				? [
					"بيئي -الردم",
					"بيئي -تغطية الحاوية",
					"بيئي -تفريغ وتنظيف الحاوية",
					"بيئي -تنظيف وتفريغ مشرب الحيوانات",
					"بيئي -توصيل أنابيب مياه",
					"بيئي -معالجة شبكة المياه",
					"كيميائي -مبيدات مجموعة الفوسفات العضوية",
					"كيميائي -أنواع من الزيوت المعدنية",
					"كيميائي -مبيدات كولونية عضوية",
					"كيميائي -منظمات نمو الحشرات",
					"حيوي -مبيدات اليرقات البكتيرية",
					"حيوي -الأسماك",
					"حيوي -المجدافيات المفترسة",
					"حيوي -البكتيريا المنتجة للسموم الداخلية",
				]
				: [
					"Environmental - Landfill",
					"Environmental - Container Covering",
					"Environmental - Container Emptying and Cleaning",
					"Environmental - Animal Waterer Cleaning and Emptying",
					"Environmental - Water Pipe Installation",
					"Environmental - Water Network Treatment",
					"Chemical - Organophosphate Pesticides",
					"Chemical - Types of Mineral Oils",
					"Chemical - Organic Colonial Pesticides",
					"Chemical - Insect Growth Regulators",
					"Biological - Bacterial Larvicides",
					"Biological - Fish",
					"Biological - Predatory Copepods",
					"Biological - Endotoxin-producing Bacteria",
				],
		required: false,
	});

	// Question 18: Pesticide Group Type
	composer.slide({ pageProgress: "19/70" });
	composer.selectBox("pesticide_group_type", {
		question: translate(localization, {
			en: "Type of Pesticide Group",
			ar: "نوع مجموعة المبيد",
		}),
		options:
			localization === "ar"
				? ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates"]
				: ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates"],
		required: false,
	});

	// Adult Mosquito Control Subsection
	composer.slide({ pageProgress: "20/70" });
	composer.h3(
		translate(localization, {
			en: "Adult Mosquito Control",
			ar: "مكافحة البعوض البالغ",
		}),
	);

	// Question 19: Type of Control 2
	composer.selectBox("control_type_2", {
		question: translate(localization, {
			en: "Type of Control (Secondary)",
			ar: "نوع المكافحة (ثانوي)",
		}),
		options:
			localization === "ar"
				? [
					"استخدام مبيدات الأثر الباقي",
					"استخدام مبيدات الرش الفراغي",
					"التضبيب الحراري",
					"الناموسيات المشبعة",
					"رذاذ متناهي الصغر",
				]
				: [
					"Use of Residual Effect Pesticides",
					"Use of Space Spray Pesticides",
					"Thermal Fogging",
					"Insecticide-treated Nets",
					"Ultra-low Volume Spray",
				],
		required: false,
	});

	// Question 20: Pesticide Group Type 2
	composer.slide({ pageProgress: "21/70" });
	composer.selectBox("pesticide_group_type_2", {
		question: translate(localization, {
			en: "Type of Pesticide Group (Secondary)",
			ar: "نوع مجموعة المبيد (ثانوي)",
		}),
		options:
			localization === "ar"
				? ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates"]
				: ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates"],
		required: false,
	});

	// Tick Control Subsection
	composer.slide({ pageProgress: "22/70" });
	composer.h3(
		translate(localization, {
			en: "Tick Control",
			ar: "مكافحة القراد",
		}),
	);

	// Question 21: Type of Control 3
	composer.selectBox("control_type_3", {
		question: translate(localization, {
			en: "Type of Control (Tertiary)",
			ar: "نوع المكافحة (ثالث)",
		}),
		options:
			localization === "ar"
				? [
					"بيئي (إزالة حشرة القراد ميكانيكياً)",
					"بيئي (تنظيف أماكن تواجد الحيوانات)",
					"بيئي (ابعاد الحيوانات خارج مقر السكن)",
					"بيئي (شفط القراد وبيوضها بالمكنسة)",
					"حيوي (الدواجن)",
					"بيئي (استخدام الملابس التي تغطي كامل الجسم)",
					"كيميائي (استخدام المطهرات)",
					"كيميائي (استخدام المواد الطاردة للقراد)",
					"كيميائي (استخدام المبيدات الحشرية)",
				]
				: [
					"Environmental (Mechanical Tick Removal)",
					"Environmental (Cleaning Animal Areas)",
					"Environmental (Keeping Animals Away from Residence)",
					"Environmental (Vacuuming Ticks and Eggs)",
					"Biological (Poultry)",
					"Environmental (Wearing Full-Body Covering Clothes)",
					"Chemical (Using Disinfectants)",
					"Chemical (Using Tick Repellents)",
					"Chemical (Using Insecticides)",
				],
		required: false,
	});

	// Question 22: Pesticide Group Type 3
	composer.slide({ pageProgress: "23/70" });
	composer.selectBox("pesticide_group_type_3", {
		question: translate(localization, {
			en: "Type of Pesticide Group (Tertiary)",
			ar: "نوع مجموعة المبيد (ثالث)",
		}),
		options:
			localization === "ar"
				? ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates", "Bti", "Growth inhibator"]
				: ["Pyrethroids", "Carbamates", "Organochlorines", "Organophosphates", "Bti", "Growth inhibator"],
		required: false,
	});

	// Pesticide Details Section
	composer.slide({ pageProgress: "24/70" });
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
	composer.slide({ pageProgress: "25/70" });
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
	composer.slide({ pageProgress: "26/70" });
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
	composer.slide({ pageProgress: "27/70" });
	composer.numberInput("pesticide_amount_consumed", {
		question: translate(localization, {
			en: "Pesticide Amount Consumed (kg/L)",
			ar: "كمية المبيد المستهلك (كجم/لتر)",
		}),
		min: 0,
		max: 10000,
	});

	// Question 27: Spraying Method
	composer.slide({ pageProgress: "28/70" });
	composer.selectBox("spraying_method", {
		question: translate(localization, {
			en: "Spraying Method",
			ar: "طريقة الرش",
		}),
		options:
			localization === "ar"
				? [
					"ضباب خارجي",
					"ضباب داخلي",
					"رذاذ داخلي",
					"رذاذ خارجي",
					"مكافحة يرقات",
					"رش ذو اثر باقي",
					"طائرة",
					"درون",
				]
				: [
					"Outdoor Fogging",
					"Indoor Fogging",
					"Indoor Spray",
					"Outdoor Spray",
					"Larvae Control",
					"Residual Spray",
					"Aircraft",
					"Drone",
				],
		required: false,
	});

	// Question 28: Area Covered by Pesticide
	composer.slide({ pageProgress: "29/70" });
	composer.numberInput("area_covered_pesticide", {
		question: translate(localization, {
			en: "Area Covered by Pesticide (m²)",
			ar: "المساحة المغطاة بالمبيد (م²)",
		}),
		min: 0,
		max: 1000000,
	});

	// Question 29: Type of Treated Site
	composer.slide({ pageProgress: "30/70" });
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

	// Question 29a: Other Treated Site Type (conditional)
	composer.textInput("treated_site_type_other", {
		question: translate(localization, {
			en: "Specify Other Treated Site Type",
			ar: "حدد نوع الموقع المعالج الآخر",
		}),
		placeholder: translate(localization, {
			en: "Enter site type",
			ar: "أدخل نوع الموقع",
		}),
		required: false,
		displayCondition: {
			dependencies: ["treated_site_type"],
			condition: "treated_site_type == 'أخرى' or treated_site_type == 'Other'",
		},
	});

	// Question 30: Residual Pesticide Spraying
	composer.slide({ pageProgress: "31/70" });
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
	composer.slide({ pageProgress: "32/70" });
	composer.numberInput("sprayed_rooms_count", {
		question: translate(localization, {
			en: "Number of Sprayed Rooms",
			ar: "عدد الغرف المرشوشة",
		}),
		min: 0,
		max: 1000,
	});

	// Question 32: Sprayed Area
	composer.slide({ pageProgress: "33/70" });
	composer.numberInput("sprayed_area", {
		question: translate(localization, {
			en: "Sprayed Area (m²)",
			ar: "المساحة المرشوشة (م²)",
		}),
		min: 0,
		max: 1000000,
	});

	// Additional Pesticide Information
	composer.slide({ pageProgress: "34/70" });
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
	composer.slide({ pageProgress: "35/70" });
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
	composer.slide({ pageProgress: "36/70" });
	composer.numberInput("quantity", {
		question: translate(localization, {
			en: "Quantity",
			ar: "الكمية",
		}),
		min: 0,
		max: 100000,
	});

	// Trap Information Section
	composer.slide({ pageProgress: "37/70" });
	composer.h2(
		translate(localization, {
			en: "Trap Information",
			ar: "معلومات المصائد",
		}),
	);

	// Number of Traps
	composer.numberInput("number_of_traps", {
		question: translate(localization, {
			en: "Number of Traps",
			ar: "عدد المصائد",
		}),
		min: 0,
		max: 4,
		required: false,
	});

	// Trap 1
	composer.slide({ pageProgress: "38/70" });
	composer.selectBox("trap_1_type", {
		question: translate(localization, {
			en: "Trap 1 - Type",
			ar: "المصيدة 1 - النوع",
		}),
		options:
			localization === "ar"
				? [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				]
				: [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				],
		required: false,
	});

	composer.slide({ pageProgress: "39/70" });
	composer.choiceInput("trap_1_positive", {
		question: translate(localization, {
			en: "Trap 1 - Is the trap positive?",
			ar: "المصيدة 1 - هل المصيدة إيجابية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.slide({ pageProgress: "40/70" });
	composer.textInput("trap_1_coordinates", {
		question: translate(localization, {
			en: "Trap 1 - Coordinates",
			ar: "المصيدة 1 - الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter trap coordinates (e.g., 25.4445;37.3024 or 26.2424, 36.4638)",
			ar: "أدخل احداثيات المصيدة (مثال: 25.4445;37.3024 أو 26.2424, 36.4638)",
		}),
		required: false,
		pattern: "^\\d+\\.\\d+[;,]\\s*\\d+\\.\\d+$",
		patternError: translate(localization, {
			en: "Please enter coordinates in format: 25.4445;37.3024 or 26.2424, 36.4638",
			ar: "الرجاء إدخال الإحداثيات بالصيغة: 25.4445;37.3024 أو 26.2424, 36.4638",
		}),
	});

	// Trap 2
	composer.slide({ pageProgress: "41/70" });
	composer.selectBox("trap_2_type", {
		question: translate(localization, {
			en: "Trap 2 - Type",
			ar: "المصيدة 2 - النوع",
		}),
		options:
			localization === "ar"
				? [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				]
				: [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				],
		required: false,
	});

	composer.slide({ pageProgress: "42/70" });
	composer.choiceInput("trap_2_positive", {
		question: translate(localization, {
			en: "Trap 2 - Is the trap positive?",
			ar: "المصيدة 2 - هل المصيدة إيجابية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.slide({ pageProgress: "43/70" });
	composer.textInput("trap_2_coordinates", {
		question: translate(localization, {
			en: "Trap 2 - Coordinates",
			ar: "المصيدة 2 - الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter trap coordinates (e.g., 25.4445;37.3024 or 26.2424, 36.4638)",
			ar: "أدخل احداثيات المصيدة (مثال: 25.4445;37.3024 أو 26.2424, 36.4638)",
		}),
		required: false,
		pattern: "^\\d+\\.\\d+[;,]\\s*\\d+\\.\\d+$",
		patternError: translate(localization, {
			en: "Please enter coordinates in format: 25.4445;37.3024 or 26.2424, 36.4638",
			ar: "الرجاء إدخال الإحداثيات بالصيغة: 25.4445;37.3024 أو 26.2424, 36.4638",
		}),
	});

	// Trap 3
	composer.slide({ pageProgress: "44/70" });
	composer.selectBox("trap_3_type", {
		question: translate(localization, {
			en: "Trap 3 - Type",
			ar: "المصيدة 3 - النوع",
		}),
		options:
			localization === "ar"
				? [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				]
				: [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				],
		required: false,
	});

	composer.slide({ pageProgress: "45/70" });
	composer.choiceInput("trap_3_positive", {
		question: translate(localization, {
			en: "Trap 3 - Is the trap positive?",
			ar: "المصيدة 3 - هل المصيدة إيجابية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.slide({ pageProgress: "46/70" });
	composer.textInput("trap_3_coordinates", {
		question: translate(localization, {
			en: "Trap 3 - Coordinates",
			ar: "المصيدة 3 - الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter trap coordinates (e.g., 25.4445;37.3024 or 26.2424, 36.4638)",
			ar: "أدخل احداثيات المصيدة (مثال: 25.4445;37.3024 أو 26.2424, 36.4638)",
		}),
		required: false,
		pattern: "^\\d+\\.\\d+[;,]\\s*\\d+\\.\\d+$",
		patternError: translate(localization, {
			en: "Please enter coordinates in format: 25.4445;37.3024 or 26.2424, 36.4638",
			ar: "الرجاء إدخال الإحداثيات بالصيغة: 25.4445;37.3024 أو 26.2424, 36.4638",
		}),
	});

	// Trap 4
	composer.slide({ pageProgress: "47/70" });
	composer.selectBox("trap_4_type", {
		question: translate(localization, {
			en: "Trap 4 - Type",
			ar: "المصيدة 4 - النوع",
		}),
		options:
			localization === "ar"
				? [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				]
				: [
					"CDC light trap & mosquito net",
					"Electric traps (Blackhole)",
					"The BG sentinel traps",
					"smart trap",
					"Ovitraps",
				],
		required: false,
	});

	composer.slide({ pageProgress: "48/70" });
	composer.choiceInput("trap_4_positive", {
		question: translate(localization, {
			en: "Trap 4 - Is the trap positive?",
			ar: "المصيدة 4 - هل المصيدة إيجابية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.slide({ pageProgress: "49/70" });
	composer.textInput("trap_4_coordinates", {
		question: translate(localization, {
			en: "Trap 4 - Coordinates",
			ar: "المصيدة 4 - الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter trap coordinates (e.g., 25.4445;37.3024 or 26.2424, 36.4638)",
			ar: "أدخل احداثيات المصيدة (مثال: 25.4445;37.3024 أو 26.2424, 36.4638)",
		}),
		required: false,
		pattern: "^\\d+\\.\\d+[;,]\\s*\\d+\\.\\d+$",
		patternError: translate(localization, {
			en: "Please enter coordinates in format: 25.4445;37.3024 or 26.2424, 36.4638",
			ar: "الرجاء إدخال الإحداثيات بالصيغة: 25.4445;37.3024 أو 26.2424, 36.4638",
		}),
	});

	// Sample Information Section (starts at 50 = 37 + 12 trap slides + 1)
	composer.slide({ pageProgress: "50/70" });
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
	composer.slide({ pageProgress: "51/70" });
	composer.dateInput("sample_collection_date", {
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
	composer.slide({ pageProgress: "52/70" });
	composer.dateInput("sample_classification_date", {
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
	composer.slide({ pageProgress: "53/70" });
	composer.numberInput("total_aquatic_stage", {
		question: translate(localization, {
			en: "Total Aquatic Stage Mosquitoes in Sample",
			ar: "اجمالي عدد الطور المائي للبعوض بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 43: Total Adult Mosquitoes
	composer.slide({ pageProgress: "54/70" });
	composer.numberInput("total_adult_mosquitoes", {
		question: translate(localization, {
			en: "Total Adult Mosquitoes in Sample",
			ar: "اجمالي عدد البعوض البالغ بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 44: Total Ticks
	composer.slide({ pageProgress: "55/70" });
	composer.numberInput("total_ticks", {
		question: translate(localization, {
			en: "Total Ticks in Sample",
			ar: "اجمالي عدد القراد بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 45: Total Sandflies
	composer.slide({ pageProgress: "56/70" });
	composer.numberInput("total_sandflies", {
		question: translate(localization, {
			en: "Total Sandflies in Sample",
			ar: "اجمالي عدد الذباب الرملي بالعينة",
		}),
		min: 0,
		max: 100000,
	});

	// Question 46: Tick Classification
	composer.slide({ pageProgress: "57/70" });
	composer.selectBox("tick_classification", {
		question: translate(localization, {
			en: "Tick Classification by Type and Stage",
			ar: "تصنيف القراد حسب النوع و الطور",
		}),
		options:
			localization === "ar"
				? [
					"Soft tick (Ornithodoros)",
					"Soft tick (Otobius)",
					"Hard tick (Amblyomma)",
					"Hard tick (Dermacentor)",
					"Hard tick (Haemaphysalis)",
					"Hard tick (Hyalomma)",
					"Hard tick (Ixodes)",
					"Hard tick (Rhipicephalus)",
				]
				: [
					"Soft tick (Ornithodoros)",
					"Soft tick (Otobius)",
					"Hard tick (Amblyomma)",
					"Hard tick (Dermacentor)",
					"Hard tick (Haemaphysalis)",
					"Hard tick (Hyalomma)",
					"Hard tick (Ixodes)",
					"Hard tick (Rhipicephalus)",
				],
		required: false,
	});

	// Aedes Mosquito Classification Section
	composer.slide({ pageProgress: "58/70" });
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
	composer.slide({ pageProgress: "59/70" });
	composer.numberInput("aedes_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Aedes)",
			ar: "الطور الثالث + الرابع (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 49: Adult M (Aedes)
	composer.slide({ pageProgress: "60/70" });
	composer.numberInput("aedes_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Aedes)",
			ar: "البالغ الذكر (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 50: Adult F (Aedes)
	composer.slide({ pageProgress: "61/70" });
	composer.numberInput("aedes_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Aedes)",
			ar: "البالغ الأنثى (Aedes)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 51: Ae.spp. (Aedes)
	composer.slide({ pageProgress: "62/70" });
	composer.selectBox("aedes_spp", {
		question: translate(localization, {
			en: "Ae.spp. (Aedes species)",
			ar: "أنواع الزاعجة (Ae.spp.)",
		}),
		options:
			localization === "ar"
				? [
					"Aedes aegypti",
					"Aedes vexans",
					"Aedes vittatus",
					"Aedes albopictus",
					"Aedes caballus",
					"Aedes caspius",
					"Not specified",
				]
				: [
					"Aedes aegypti",
					"Aedes vexans",
					"Aedes vittatus",
					"Aedes albopictus",
					"Aedes caballus",
					"Aedes caspius",
					"Not specified",
				],
		required: false,
	});

	// Culex Mosquito Classification Section
	composer.slide({ pageProgress: "63/70" });
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
	composer.slide({ pageProgress: "64/70" });
	composer.numberInput("culex_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Culex)",
			ar: "الطور الثالث + الرابع (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 54: Adult M (Culex)
	composer.slide({ pageProgress: "65/70" });
	composer.numberInput("culex_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Culex)",
			ar: "البالغ الذكر (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 55: Adult F (Culex)
	composer.slide({ pageProgress: "66/70" });
	composer.numberInput("culex_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Culex)",
			ar: "البالغ الأنثى (Culex)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 56: Culex spp.
	composer.slide({ pageProgress: "67/70" });
	composer.selectBox("culex_spp", {
		question: translate(localization, {
			en: "Culex spp. (Culex species)",
			ar: "أنواع الكيولكس (Culex spp.)",
		}),
		options:
			localization === "ar"
				? [
					"Cx. pipiens",
					"Cx. pusillus",
					"Cx.decens",
					"Cx. duttoni",
					"Cx.laticinctus",
					"Cx. mattinglyi",
					"Cx.mimeticus",
					"Cx. perexiguus",
					"Cx.quinquefasciatus",
					"Cx. simpsoni",
					"Cx.sinaiticus",
					"Cx. sitiens",
					"Cx. theileri",
					"Cx.tritaeniorhynchus",
					"Cx. nebulosus",
					"Cx.arbieeni Salem",
					"Cx. univittatus",
					"Cx. salisburiensis",
					"Cx.bitaeniorhynchus",
					"Cs. longiareolata",
					"Cs. subochrea",
					"Lt. tigripes",
					"Cq.richiardii",
					"Ur. unguiculata",
					"Not specified",
				]
				: [
					"Cx. pipiens",
					"Cx. pusillus",
					"Cx.decens",
					"Cx. duttoni",
					"Cx.laticinctus",
					"Cx. mattinglyi",
					"Cx.mimeticus",
					"Cx. perexiguus",
					"Cx.quinquefasciatus",
					"Cx. simpsoni",
					"Cx.sinaiticus",
					"Cx. sitiens",
					"Cx. theileri",
					"Cx.tritaeniorhynchus",
					"Cx. nebulosus",
					"Cx.arbieeni Salem",
					"Cx. univittatus",
					"Cx. salisburiensis",
					"Cx.bitaeniorhynchus",
					"Cs. longiareolata",
					"Cs. subochrea",
					"Lt. tigripes",
					"Cq.richiardii",
					"Ur. unguiculata",
					"Not specified",
				],
		required: false,
	});

	// Anopheles Mosquito Classification Section
	composer.slide({ pageProgress: "68/70" });
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
	composer.slide({ pageProgress: "69/70" });
	composer.numberInput("anopheles_3rd_4th", {
		question: translate(localization, {
			en: "3rd + 4th Instar (Anopheles)",
			ar: "الطور الثالث + الرابع (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 59: Adult M (Anopheles)
	composer.slide({ pageProgress: "70/70" });
	composer.numberInput("anopheles_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Anopheles)",
			ar: "البالغ الذكر (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 60: Adult F (Anopheles) - remove pageProgress as it's on same slide
	composer.numberInput("anopheles_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Anopheles)",
			ar: "البالغ الأنثى (Anopheles)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 61: An.spp. (Anopheles) - remove pageProgress as it's on same slide
	composer.selectBox("anopheles_spp", {
		question: translate(localization, {
			en: "An.spp. (Anopheles species)",
			ar: "أنواع الأنوفيليس (An.spp.)",
		}),
		options:
			localization === "ar"
				? [
					"An. fluviatilis",
					"An. multicolor",
					"An.pharoensis",
					"An.pretoriensis",
					"An.pulcherrimus",
					"An.rhodesiensis",
					"An.sergentii",
					"An. stephensi",
					"An. subpictus",
					"An. superpictus",
					"An. turkhudi",
					"Not specified",
				]
				: [
					"An. fluviatilis",
					"An. multicolor",
					"An.pharoensis",
					"An.pretoriensis",
					"An.pulcherrimus",
					"An.rhodesiensis",
					"An.sergentii",
					"An. stephensi",
					"An. subpictus",
					"An. superpictus",
					"An. turkhudi",
					"Not specified",
				],
		required: false,
	});

	// Sandfly Classification Section - remove pageProgress as it's on same slide
	composer.h2(
		translate(localization, {
			en: "Sandfly Classification",
			ar: "تصنيف الذباب الرملي",
		}),
	);

	// Question 62: Adult M (Sandfly) - remove pageProgress as it's on same slide
	composer.numberInput("sandfly_adult_m", {
		question: translate(localization, {
			en: "Adult Male (Sandfly)",
			ar: "البالغ الذكر (ذباب رملي)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 63: Adult F (Sandfly) - remove pageProgress as it's on same slide
	composer.numberInput("sandfly_adult_f", {
		question: translate(localization, {
			en: "Adult Female (Sandfly)",
			ar: "البالغ الأنثى (ذباب رملي)",
		}),
		min: 0,
		max: 100000,
	});

	// Question 64: Ser.spp (Sandfly) - remove pageProgress as it's on same slide
	composer.selectBox("sandfly_ser_spp", {
		question: translate(localization, {
			en: "Ser.spp (Sergentomyia species)",
			ar: "أنواع سيرجنتوميا (Ser.spp)",
		}),
		options:
			localization === "ar"
				? [
					"S.affinis",
					"S.calcrata",
					"S.sattii",
					"S. suberecta",
					"S. inermis",
					"S. fremits",
					"S. freetownesis",
					"S. magna",
					"S. darlingi",
					"S. kirki",
					"S. serrata",
					"S. hunti",
					"S. dureni",
					"S. collarti",
					"S. decipiens",
					"S. heischi",
					"S. adleri",
					"S. tiberiadis",
					"S.schwetzi",
					"S.taizi",
					"S.fallax",
					"S.antennata",
					"S. africana",
					"S.palestinensis",
					"S. christophersi",
					"S. clydei",
					"S. calcarata",
					"S. magna",
					"S. dreyfussi",
					"S. squamipleuris",
					"S. sonyae",
					"S. dolichopa",
					"S. multidens",
					"S. yusafi",
					"S. schoutedeni",
					"Not specified",
				]
				: [
					"S.affinis",
					"S.calcrata",
					"S.sattii",
					"S. suberecta",
					"S. inermis",
					"S. fremits",
					"S. freetownesis",
					"S. magna",
					"S. darlingi",
					"S. kirki",
					"S. serrata",
					"S. hunti",
					"S. dureni",
					"S. collarti",
					"S. decipiens",
					"S. heischi",
					"S. adleri",
					"S. tiberiadis",
					"S.schwetzi",
					"S.taizi",
					"S.fallax",
					"S.antennata",
					"S. africana",
					"S.palestinensis",
					"S. christophersi",
					"S. clydei",
					"S. calcarata",
					"S. magna",
					"S. dreyfussi",
					"S. squamipleuris",
					"S. sonyae",
					"S. dolichopa",
					"S. multidens",
					"S. yusafi",
					"S. schoutedeni",
					"Not specified",
				],
		required: false,
	});

	// Question 65: Ph.spp (Sandfly) - remove pageProgress as it's on same slide
	composer.selectBox("sandfly_ph_spp", {
		question: translate(localization, {
			en: "Ph.spp (Phlebotomus species)",
			ar: "أنواع فليبوتوموس (Ph.spp)",
		}),
		options:
			localization === "ar"
				? [
					"P. bergeroti",
					"P. papatasi",
					"P. alexandri",
					"P. sergenti",
					"P. arabicus",
					"P.orientalis",
					"P.kazeruni",
					"P.saevus",
					"P.duboscqi",
					"P.longipes",
					"P.pedifer",
					"P.rodhaini",
					"P.martini",
					"Not specified",
				]
				: [
					"P. bergeroti",
					"P. papatasi",
					"P. alexandri",
					"P. sergenti",
					"P. arabicus",
					"P.orientalis",
					"P.kazeruni",
					"P.saevus",
					"P.duboscqi",
					"P.longipes",
					"P.pedifer",
					"P.rodhaini",
					"P.martini",
					"Not specified",
				],
		required: false,
	});

	// Snail Information Section - remove pageProgress as it's on same slide
	composer.h2(
		translate(localization, {
			en: "Snail Information",
			ar: "معلومات القواقع",
		}),
	);

	// Question 66: Snails Present - remove pageProgress as it's on same slide
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

	// Question 67: Total Snails - remove pageProgress as it's on same slide
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

	// Question 68: Snail Type - remove pageProgress as it's on same slide
	composer.selectBox("snail_type", {
		question: translate(localization, {
			en: "Snail Type",
			ar: "نوع القواقع",
		}),
		options:
			localization === "ar"
				? [
					"Biomphalaria",
					"Physa",
					"Melanoides",
					"Gyraulus",
					"Lymnaea",
					"Bulinus",
					"Not specified",
				]
				: [
					"Biomphalaria",
					"Physa",
					"Melanoides",
					"Gyraulus",
					"Lymnaea",
					"Bulinus",
					"Not specified",
				],
		required: false,
		displayCondition: {
			dependencies: ["snails_present"],
			condition: "snails_present == 'Yes' or snails_present == 'نعم'",
		},
	});

	return composer;
}
