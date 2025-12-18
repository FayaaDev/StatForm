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
		postUrl: "https://script.google.com/macros/s/AKfycbxcQC3YWxYWlxWcdpwW1KUa3dxRO6afA4pU5kqDOtZrcJQsayM3yLgXzQWXi1Jx7bA0DA/exec",
		_sheetName: "استمارة التقصي الوبائي للحالات",
		_sheetId: "1lNOOEtvfuxo2vD20scc4voZDfE08CN6X5RpreXTzdEc",
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

		// Question 1: District
	composer.slide({ pageProgress: "1/59" });
	composer.selectBox("District", {
		question: translate(localization, {
			en: "District",
			ar: "أسم الحي",
		}),
		placeholder: translate(localization, {
			en: "Name of District",
			ar: "أسم الحي ",
		}),
		options: [
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
			"البيعة",
			"التروية",
			"التنعيم",
			"الجامعة",
			"الجميزة",
			"الجودرية الجديد",
			"الحجون",
			"الحديبية",
			"الحسينية",
			"الحطيم",
			"الحمراء",
			"أخرى",
		],
		required: true,
	});

	// District - Other (conditional)
	composer.textInput("district_other", {
		question: translate(localization, {
			en: "Specify District",
			ar: "حدد الحي",
		}),
		placeholder: translate(localization, {
			en: "Enter district name",
			ar: "أدخل اسم الحي",
		}),
		required: false,
		displayCondition: {
			dependencies: ["District"],
			condition: "District == 'أخرى'",
		},
	});

	// Question 2: investigation location
	composer.slide({ pageProgress: "2/59" });
	composer.choiceInput("investigation_location", {
		question: translate(localization, {
			en: "Location of Investigation",
			ar: "مكان التقصي",
		}),
		choices: [
			translate(localization, { en: "Case's Home", ar: "منزل الحالة" }),
			translate(localization, { en: "Adjacent Home", ar: "منزل مجاور" }),
		],
		required: true,
	});

	// Question 3: Report Date
	composer.slide({ pageProgress: "3/59" });
	composer.dateInput("report_date", {
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

	// Question 4: Coordinates
	composer.slide({ pageProgress: "4/59" });
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

	// Question 5: Case Classification
	composer.slide({ pageProgress: "5/59" });
	composer.selectBox("case_classification", {
		question: translate(localization, {
			en: "Case Classification",
			ar: "تصنيف الحالة",
		}),
		options:
			localization === "ar"
				? ["حالة مؤكدة",  "حالة مشتهبة"]
				: ["Confirmed case", "Suspected case"],
		required: false,
	});

	// Question 6: Field Visit Date
	composer.slide({ pageProgress: "6/59" });
	composer.dateInput("field_visit_date", {
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

	// Question 7: Investigation Code
	composer.slide({ pageProgress: "7/59" });
	composer.numberInput("investigation_code", {
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

	// Question 8: Case Name
	composer.slide({ pageProgress: "8/59" });
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

	// Question 9: Age
	composer.slide({ pageProgress: "9/59" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "Age",
			ar: "العمر",
		}),
		placeholder: translate(localization, {
			en: "Enter age",
			ar: "أدخل العمر",
		}),
		min: 0,
		max: 150,
		required: false,
	});

	// Question 10: Gender
	composer.slide({ pageProgress: "10/59" });
	composer.selectBox("gender", {
		question: translate(localization, {
			en: "Gender",
			ar: "الجنس",
		}),
		options:
			localization === "ar"
				? ["ذكر", "أنثى"]
				: ["Male", "Female"],
		required: false,
	});

	// Question 11: Nationality
	composer.slide({ pageProgress: "11/59" });
	composer.selectBox("nationality", {
		question: translate(localization, {
			en: "Nationality",
			ar: "الجنسية",
		}),
		options: [
			"المملكة العربية السعودية",
			"السودان",
			"اليمن",
			"الهند",
			"باكستان",
			"مصر",
			"بنغلادش",
			"الاتحاد الروسي",
			"إثيوبيا",
			"أذربيجان",
			"الأرجنتين",
			"الأردن",
			"أرمينيا",
			"إريتريا",
			"إسبانيا",
			"أستراليا",
			"إستونيا",
			"أفغانستان",
			"إكوادور",
			"ألبانيا",
			"ألمانيا",
			"الإمارات العربية المتحدة",
			"أنتيغوا وبربودا",
			"أندورا",
			"إندونيسيا",
			"أنغولا",
			"أوروغواي",
			"أوزبكستان",
			"أوغندا",
			"أوكرانيا",
			"إيران (جمهورية - إسلامية)",
			"أيرلندا",
			"آيسلندا",
			"إيطاليا",
			"إسواتيني",
			"بابوا غينيا الجديدة",
			"باراغواي",
			"بالاو",
			"البحرين",
			"البرازيل",
			"بربادوس",
			"البرتغال",
			"بروني دار السلام",
			"بلجيكا",
			"بلغاريا",
			"بليز",
			"بنغلاديش",
			"بنما",
			"بنن",
			"بوتان",
			"بوتسوانا",
			"بوركينا فاسو",
			"بوروندي",
			"البوسنة والهرسك",
			"بولندا",
			"بوليفيا (دولة-متعددة القوميات)",
			"بيرو",
			"بيلاروس",
			"تايلند",
			"تركمانستان",
			"تركيا",
			"ترينيداد وتوباغو",
			"تشاد",
			"توغو",
			"توفالو",
			"تونس",
			"تونغا",
			"تيمور- ليشتي",
			"جامايكا",
			"الجبل الأسود",
			"الجزائر",
			"جزر البهاما",
			"جزر سليمان",
			"جزر القمر",
			"جزر مارشال",
			"جمهورية أفريقيا الوسطى",
			"الجمهورية التشيكية",
			"جمهورية تنزانيا المتحدة",
			"جمهورية جنوب السودان",
			"الجمهورية الدومينيكية",
			"الجمهورية العربية السورية",
			"جمهورية كوريا",
			"جمهورية كوريا الشعبية الديمقراطية",
			"جمهورية الكونغو الديمقراطية",
			"جمهورية لاو الديمقراطية الشعبية",
			"جمهورية مقدونيا الشمالية",
			"جمهورية مولدوفا",
			"جنوب أفريقيا",
			"جورجيا",
			"جيبوتي",
			"الدانمرك",
			"دومينيكا",
			"الرأس الأخضر",
			"رواندا",
			"رومانيا",
			"زامبيا",
			"زيمبابوي",
			"ساموا",
			"سان تومي وبرينسيبي",
			"سان مارينو",
			"سانت فنسنت وجزر غرينادين",
			"سانت كيتس ونيفس",
			"سانت لوسيا",
			"سري لانكا",
			"السلفادور",
			"سلوفاكيا",
			"سلوفينيا",
			"سنغافورة",
			"السنغال",
			"سورينام",
			"السويد",
			"سويسرا",
			"سيراليون",
			"سيشيل",
			"شيلي",
			"صربيا",
			"الصومال",
			"الصين",
			"طاجيكستان",
			"العراق",
			"عمان",
			"غابون",
			"غامبيا",
			"غانا",
			"غرينادا",
			"غواتيمالا",
			"غيانا",
			"غينيا",
			"غينيا الاستوائية",
			"غينيا-بيساو",
			"فانواتو",
			"فرنسا",
			"الفلبين",
			"فنزويلا (جمهورية - البوليفارية)",
			"فنلندا",
			"فيجي",
			"فييت نام",
			"قبرص",
			"قطر",
			"قيرغيزستان",
			"كازاخستان",
			"الكاميرون",
			"كرواتيا",
			"كمبوديا",
			"كندا",
			"كوبا",
			"كوت ديفوار",
			"كوستاريكا",
			"كولومبيا",
			"الكونغو",
			"الكويت",
			"كيريباس",
			"كينيا",
			"لاتفيا",
			"لبنان",
			"لكسمبرغ",
			"ليبيريا",
			"ليبيا",
			"ليتوانيا",
			"ليختنشتاين",
			"ليسوتو",
			"مالطة",
			"مالي",
			"ماليزيا",
			"مدغشقر",
			"المغرب",
			"المكسيك",
			"ملاوي",
			"ملديف",
			"المملكة المتحدة لبريطانيا العظمى وآيرلندا الشمالية",
			"منغوليا",
			"موريتانيا",
			"موريشيوس",
			"موزامبيق",
			"موناكو",
			"ميانمار",
			"ميكرونيزيا (ولايات ــ الموحدة)",
			"ناميبيا",
			"ناورو",
			"النرويج",
			"النمسا",
			"نيبال",
			"النيجر",
			"نيجيريا",
			"نيكاراغوا",
			"نيوزيلندا",
			"هايتي",
			"هندوراس",
			"هنغاريا",
			"هولندا",
			"الولايات المتحدة الأمريكية",
			"اليابان",
			"اليونان",
		],
		required: false,
	});

	// Question 12: Profession
	composer.slide({ pageProgress: "12/59" });
	composer.textInput("profession", {
		question: translate(localization, {
			en: "Profession",
			ar: "المهنة",
		}),
		placeholder: translate(localization, {
			en: "Enter profession",
			ar: "أدخل المهنة",
		}),
		required: false,
	});

	// Question 13: Workplace
	composer.slide({ pageProgress: "13/59" });
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

	// Question 14: Work Address (District)
	composer.slide({ pageProgress: "14/59" });
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

	// Question 15: Language
	composer.slide({ pageProgress: "15/59" });
	composer.selectBox("language", {
		question: translate(localization, {
			en: "Language",
			ar: "اللغة",
		}),
		options: [
			"لغة عربية",
			"لغة انجليزية",
			"لغة هندية",
			"لغة الاوردو",
			"لغة آرامية",
			"لغة آيسلندية",
			"لغة آينوية",
			"لغة أبازية",
			"لغة أتشومية",
			"لغة أبخازية",
			"لغة أديغية (لغة شركسية)",
			"لغة أذرية",
			"لغة أشورية",
			"لغة ألبانية",
			"لغة ألطية",
			"لغة أرمنية",
			"لغة أذربيجانية",
			"لغة إنغوشية",
			"لغة أيرلندية",
			"لغة أمهرية",
			"لغة الهوسا",
			"لغة ألمانية",
			"لغة أوسيتية",
			"لغة أوكرانية",
			"لغة أردية",
			"لغة أويغورية",
			"لغة الأفستية",
			"لغة أمازيغية",
			"لغة أيمرية",
			"لغة أيرلندية",
			"لغة أوارية",
			"لغة أوزبكية",
			"لغة إنكتيتوتية",
			"لغة أرغوبية",
			"لغة إسبرانتو",
			"لغة إيطالية",
			"لغة إيطاليكية",
			"لغة إسبانية",
			"لغة إندونيسية",
			"لغة إيرانوني",
			"لغة بالية",
			"لغة بلوشية",
			"لغة بشكيرية",
			"لغة باسكية",
			"لغة الباتس",
			"لغة بيلاروسية",
			"لغة بنغالية",
			"لغة بوسنية",
			"لغة بلغارية",
			"لغة بيجين",
			"لغة بولندية",
			"لغة البراهوئية",
			"لغة برتغالية",
			"لغة بنجابية",
			"لغة بشتونية",
			"لغة بلقارية",
			"لغة بورمية",
			"لغة بولارية",
			"لغة بروسية قديمة",
			"لغة بريكية",
			"لغة باتنية شاوية",
			"لغة تايلاشية",
			"لغة تاميلية",
			"لغة تاتية",
			"لغة تتارية",
			"لغة تايلندية",
			"لغة تيبيتية",
			"لغة تجرية",
			"لغة تغرينية",
			"لغة تركية",
			"لغة تركمانية",
			"لغة تشيكية",
			"لغة تركية عثمانية",
			"لغة التاجالوج (التغالوغ)",
			"لغة تيتورمية",
			"لغة توما",
			"لغة التلغو",
			"لغة تشيلوبا",
			"لغة غرينلاندية",
			"لغة جيريسي",
			"لغة جورجية",
			"لغة جينغ تانغ",
			"لغة جاوية",
			"لغة جروزينية أو كفرولية",
			"لغة حتية",
			"لغة حميرية",
			"لغة خميرية",
			"لغة الخالخا",
			"لغة دانمركية",
			"لغة دارجينية",
			"لغة دزونكا",
			"لغة ديفهية",
			"لغة رومانية",
			"لغة رومنية",
			"لغة رومانشية",
			"لغة روسية",
			"لغة ريبوارية",
			"لغة زازاكية",
			"لغة الزولو",
			"لغة زرمة",
			"لغة سنهالية",
			"لغة سلوفاكية",
			"لغة سلوفينية",
			"لغة سويدية",
			"لغة سواحلية",
			"لهجة سلاوية",
			"لغة شيشيوية",
			"لغة شيشانية",
			"لغة الشيشيوا",
			"لغة شبكية",
			"لغة صومالية",
			"لغة صينية",
			"لغة طاجيكية",
			"لغة عبرية",
			"لغة عفارية",
			"لغة عونغوتا",
			"لغة غاغوزية",
			"لغة غالية",
			"لغة فارسية",
			"لغة فرنسية",
			"لغة فنلندية",
			"لغة الفولابوك",
			"لغة فولانية",
			"لغة فيتنامية",
			"لغة فيفية",
			"لغة فينيقية",
			"لغة فلبينية",
			"لغة القازاقية",
			"لغة قمرية",
			"لغة قبطية",
			"لغة قبردية",
			"لغة قيرغيزية",
			"لغة قوطية",
			"لغة كشميرية",
			"لغة كازاخية",
			"لغة كورسية",
			"لغة كردية",
			"لغة كتلانية",
			"لغة كلدانية",
			"لغة كرواتية",
			"لغة كوشية",
			"لغة كيروندية",
			"لغة كريولية",
			"لغة كيسي",
			"لغة كورية",
			"لغة كريولية هايتية",
			"لغة لاتينية",
			"لغة ليتوانية",
			"لغة لاو",
			"لغة لاتفية",
			"لغة اللنغالية",
			"لغة لازية",
			"لغة لوكسمبورغية",
			"لغة ملغاشية",
			"لغة ملاوية",
			"لغة ماليالامية",
			"لغة مالطية",
			"لغة الماجرلي",
			"لغة مجرية",
			"لغة مولدافية",
			"لغة المندنكا",
			"لغة ماورية",
			"لغة المنوكوتوبا",
			"لغة منغولية",
			"لغة مهرية",
			"لغة مقدونية",
			"لغة مليبارية",
			"لغة مندائية",
			"لغة نيبالية",
			"لغة نورمانية",
			"لغة نروجية",
			"لغة نوبية",
			"لغة هندية",
			"لغة هولندية",
			"لغة هررية",
			"لغة الهاوسا",
			"لغة ولفية",
			"لغة ويلزية",
			"لغة يابانية",
			"لغة يونانية",
			"لغة يديشية",
			"لغة اليوروبا",
		],
		required: true,
	});

	// Question 16: Contact Number
	composer.slide({ pageProgress: "16/59" });
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

	// Question 17: Investigation Status
	composer.slide({ pageProgress: "17/59" });
	composer.selectBox("investigation_status", {
		question: translate(localization, {
			en: "Investigation Status",
			ar: "حالة التقصي",
		}),
		options:
			localization === "ar"
				? [ "لم يتم التقصي", "تم التقصي"]
				: ["Pending", "Completed"],
		required: false,
	});

	// Question 18: Reason for Not Completing Investigation
	composer.slide({ pageProgress: "18/59" });
	composer.selectBox("investigation_incomplete_reason", {
		question: translate(localization, {
			en: "Reason for not completing investigation",
			ar: "في حال تعذر استكمال التقصي يذكر السبب",
		}),
		options: [
			"لايوجد أحد",
			"لا يوجد محرم",
			"صاحب المنزل لا يرغب",
			"لا يتحدث نفس اللغة",
			"لايوجد أداة تثقيف",
			"لايوجد موظف تثقيف",
			"صعوبة الوصول للمكان",
			"أخرى حدد",
		],
		required: false,
		displayCondition: {
			dependencies: ["investigation_status"],
			condition: "investigation_status == 'لم يتم التقصي'",
		},
	});

	// Question 19: Other (Investigation Reason)
	composer.textInput("investigation_incomplete_other", {
		question: translate(localization, {
			en: "Other (Specify)",
			ar: "أخرى (حدد)",
		}),
		placeholder: translate(localization, {
			en: "Specify other reason",
			ar: "حدد السبب الآخر",
		}),
		required: false,
		displayCondition: {
			dependencies: ["investigation_incomplete_reason"],
			condition: "investigation_incomplete_reason == 'أخرى حدد'",
		},
	});

	// Question 20: Vaccination Record
	composer.slide({ pageProgress: "19/59" });
	composer.selectBox("vaccination_record", {
		question: translate(localization, {
			en: "Vaccination Record",
			ar: "سجل التطعيمات",
		}),
		options: [
			"الحمى الصفراء",
			"متلازمة امراض القراد",
			"جميعا",
			"لايوجد",
		],
		required: false,
	});

	// Question 21: Medical History
	composer.slide({ pageProgress: "20/59" });
	composer.selectBox("medical_history", {
		question: translate(localization, {
			en: "Medical History of the Case",
			ar: "التاريخ المرضي للحالة",
		}),
		options: [
			"الضنك Dengue",
			"التشكنقونيا Chikungunya",
			"الزيكا Zika",
			"غرب النيل West Nile",
			"الخرمة Alkhurma",
			"الوادي المتصدع Rift Valley",
			"القرم-الكونغو Crimean-Congo",
			"لاسا Lassa Fever",
			"الصفراء Yellow Fever",
			"ايبولا Ebola",
			"ماربورغ Marburg",
			"أمراض مزمنة",
			"حامل",
			"أخرى",
		],
		required: false,
		displayCondition: {
			dependencies: ["vaccination_record"],
			condition: "vaccination_record != 'لايوجد'",
		},
	});

	// Question 22: Other Medical Condition
	composer.slide({ pageProgress: "21/59" });
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

	// Question 23: Travel within 21 days
	composer.slide({ pageProgress: "22/59" });
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

	// Question 24: Travel Location (conditional)
	composer.selectBox("travel_location", {
		question: translate(localization, {
			en: "Travel Location",
			ar: "مكان السفر",
		}),
		options: [
			"المملكة العربية السعودية",
			"السودان",
			"اليمن",
			"الهند",
			"باكستان",
			"مصر",
			"بنغلادش",
			"الاتحاد الروسي",
			"إثيوبيا",
			"أذربيجان",
			"الأرجنتين",
			"الأردن",
			"أرمينيا",
			"إريتريا",
			"إسبانيا",
			"أستراليا",
			"إستونيا",
			"أفغانستان",
			"إكوادور",
			"ألبانيا",
			"ألمانيا",
			"الإمارات العربية المتحدة",
			"أنتيغوا وبربودا",
			"أندورا",
			"إندونيسيا",
			"أنغولا",
			"أوروغواي",
			"أوزبكستان",
			"أوغندا",
			"أوكرانيا",
			"إيران (جمهورية - إسلامية)",
			"أيرلندا",
			"آيسلندا",
			"إيطاليا",
			"إسواتيني",
			"بابوا غينيا الجديدة",
			"باراغواي",
			"بالاو",
			"البحرين",
			"البرازيل",
			"بربادوس",
			"البرتغال",
			"بروني دار السلام",
			"بلجيكا",
			"بلغاريا",
			"بليز",
			"بنغلاديش",
			"بنما",
			"بنن",
			"بوتان",
			"بوتسوانا",
			"بوركينا فاسو",
			"بوروندي",
			"البوسنة والهرسك",
			"بولندا",
			"بوليفيا (دولة-متعددة القوميات)",
			"بيرو",
			"بيلاروس",
			"تايلند",
			"تركمانستان",
			"تركيا",
			"ترينيداد وتوباغو",
			"تشاد",
			"توغو",
			"توفالو",
			"تونس",
			"تونغا",
			"تيمور- ليشتي",
			"جامايكا",
			"الجبل الأسود",
			"الجزائر",
			"جزر البهاما",
			"جزر سليمان",
			"جزر القمر",
			"جزر مارشال",
			"جمهورية أفريقيا الوسطى",
			"الجمهورية التشيكية",
			"جمهورية تنزانيا المتحدة",
			"جمهورية جنوب السودان",
			"الجمهورية الدومينيكية",
			"الجمهورية العربية السورية",
			"جمهورية كوريا",
			"جمهورية كوريا الشعبية الديمقراطية",
			"جمهورية الكونغو الديمقراطية",
			"جمهورية لاو الديمقراطية الشعبية",
			"جمهورية مقدونيا الشمالية",
			"جمهورية مولدوفا",
			"جنوب أفريقيا",
			"جورجيا",
			"جيبوتي",
			"الدانمرك",
			"دومينيكا",
			"الرأس الأخضر",
			"رواندا",
			"رومانيا",
			"زامبيا",
			"زيمبابوي",
			"ساموا",
			"سان تومي وبرينسيبي",
			"سان مارينو",
			"سانت فنسنت وجزر غرينادين",
			"سانت كيتس ونيفس",
			"سانت لوسيا",
			"سري لانكا",
			"السلفادور",
			"سلوفاكيا",
			"سلوفينيا",
			"سنغافورة",
			"السنغال",
			"سورينام",
			"السويد",
			"سويسرا",
			"سيراليون",
			"سيشيل",
			"شيلي",
			"صربيا",
			"الصومال",
			"الصين",
			"طاجيكستان",
			"العراق",
			"عمان",
			"غابون",
			"غامبيا",
			"غانا",
			"غرينادا",
			"غواتيمالا",
			"غيانا",
			"غينيا",
			"غينيا الاستوائية",
			"غينيا-بيساو",
			"فانواتو",
			"فرنسا",
			"الفلبين",
			"فنزويلا (جمهورية - البوليفارية)",
			"فنلندا",
			"فيجي",
			"فييت نام",
			"قبرص",
			"قطر",
			"قيرغيزستان",
			"كازاخستان",
			"الكاميرون",
			"كرواتيا",
			"كمبوديا",
			"كندا",
			"كوبا",
			"كوت ديفوار",
			"كوستاريكا",
			"كولومبيا",
			"الكونغو",
			"الكويت",
			"كيريباس",
			"كينيا",
			"لاتفيا",
			"لبنان",
			"لكسمبرغ",
			"ليبيريا",
			"ليبيا",
			"ليتوانيا",
			"ليختنشتاين",
			"ليسوتو",
			"مالطة",
			"مالي",
			"ماليزيا",
			"مدغشقر",
			"المغرب",
			"المكسيك",
			"ملاوي",
			"ملديف",
			"المملكة المتحدة لبريطانيا العظمى وآيرلندا الشمالية",
			"منغوليا",
			"موريتانيا",
			"موريشيوس",
			"موزامبيق",
			"موناكو",
			"ميانمار",
			"ميكرونيزيا (ولايات ــ الموحدة)",
			"ناميبيا",
			"ناورو",
			"النرويج",
			"النمسا",
			"نيبال",
			"النيجر",
			"نيجيريا",
			"نيكاراغوا",
			"نيوزيلندا",
			"هايتي",
			"هندوراس",
			"هنغاريا",
			"هولندا",
			"الولايات المتحدة الأمريكية",
			"اليابان",
			"اليونان",
		],
		required: false,
		displayCondition: {
			dependencies: ["travel_21_days"],
			condition: "travel_21_days == 'Yes' or travel_21_days == 'نعم'",
		},
	});

	// Question 25: Direct Exposure
	composer.slide({ pageProgress: "23/59" });
	composer.selectBox("direct_exposure", {
		question: translate(localization, {
			en: "Direct Exposure",
			ar: "التعرض المباشر",
		}),
		options: [
			"لدغ القراد",
			"ذبح للحيوانات او الطيور او التعرض لفضلاتها",
			"عضة حيوان",
			"دفن الحيوانات المصابة",
			"حلب الحيوانات المصابة",
			"التعامل مع اللحوم الطازجة بشكل مباشر",
			"شرب لبن غير مبستر",
			"ملامسة سوائل جسم الحيوان المصاب مثل الدم، اللعاب، البول، البراز، القيء",
			"ملامسة جسدية مباشرة مع حيوان مصاب",
			"ملامسة سوائل الجسم لحالة مشتبهة أو حالة مريضة مثل الدم، اللعاب، البول، البراز، القيء",
			"ملامسة جسدية مباشرة مع حالة متوفية أو حية",
			"لايوجد",
		],
		required: false,
	});

	// Question 26: Type of Animal (Direct)
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
	});

	// Question 27: Exposure Date (Direct)
	composer.dateInput("exposure_date_direct", {
		question: translate(localization, {
			en: "Exposure Date (Direct)",
			ar: "تاريخ التعرض",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
	});

	// Question 28: Indirect Exposure
	composer.slide({ pageProgress: "24/59" });
	composer.selectBox("indirect_exposure", {
		question: translate(localization, {
			en: "Indirect Exposure",
			ar: "التعرض الغير مباشر",
		}),
		options: [
			"وجود حيوانات داخل المنزل",
			"وجود حيوانات حول المنزل",
			"المبيت في الكهوف أو المناجم أو مساكن الحيوانات",
			"ملامسة أو مشاركة ملاءة، ملابس، أواني، أدوات أكل الحالة المشتبهة أو المريضة",
			"مبيت، أكل، قضاء وقت بنفس المنزل أو الغرفة للحالة التي تم مخالطتها",
			"حضور جنازة أو مخالطة حالة متوفية",
			"التطوع بحمل جنازة حالة متوفية",
			"وجود القراد",
			"لايوجد",
		],
		required: false,
	});

	// Question 29: Type of Animal (Indirect)
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
	});

	// Question 30: Exposure Date (Indirect)
	composer.dateInput("exposure_date_indirect", {
		question: translate(localization, {
			en: "Exposure Date (Indirect)",
			ar: "تاريخ التعرض",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
	});

	// Question 31: Visit to Health Facility
	composer.slide({ pageProgress: "25/59" });
	composer.choiceInput("health_facility_visit", {
		question: translate(localization, {
			en: "Did the case visit a health facility for work, treatment, or visiting a patient?",
			ar: "هل قامت الحالة بزيارة منشأة صحية للعمل أو العلاج أو زيارة مريض؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 32: Public Event Attendance
	composer.slide({ pageProgress: "26/59" });
	composer.choiceInput("public_event_attendance", {
		question: translate(localization, {
			en: "Did the case attend a public event with large attendance such as festival, party, wedding, Hajj, Umrah, etc.?",
			ar: "هل حضرت الحالة حدث عام يتواجد فيه عدد كبير من الحضور مثل مهرجان، حفلة، زواج، حج، عمرة، وغيرها؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 33: Traditional Healer Visit
	composer.slide({ pageProgress: "27/59" });
	composer.choiceInput("traditional_healer_visit", {
		question: translate(localization, {
			en: "Did the case visit a traditional healer or sheikh?",
			ar: "هل قامت الحالة بزيارة معالج شعبي أو شيخ؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 34: Wounds from Direct Exposure
	composer.slide({ pageProgress: "28/59" });
	composer.choiceInput("wounds_direct_exposure", {
		question: translate(localization, {
			en: "In case of direct exposure, are there laceration wounds?",
			ar: "في حال التعرض المباشر يوجد جروح قطعية",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	
	// Question 40: Number of Contacts
	composer.slide({ pageProgress: "33/59" });
	composer.numberInput("number_of_contacts", {
		question: translate(localization, {
			en: "Number of Contacts",
			ar: "عدد المخالطين للحالة فقط",
		}),
		min: 0,
		max: 1000,
	});

	// Question 41: Nature of Contact
	composer.slide({ pageProgress: "34/59" });
	composer.selectBox("contact_nature", {
		question: translate(localization, {
			en: "Nature of Contact",
			ar: "طبيعة المخالطة",
		}),
		options: [
			"مخالطة مباشرة",
			"مخالطة غير مباشرة",
		],
		required: false,
	});

	// Question 42: Building Condition
	composer.slide({ pageProgress: "35/59" });
	composer.selectBox("building_condition", {
		question: translate(localization, {
			en: "Building Condition",
			ar: "حالة المبنى",
		}),
		options:
			localization === "ar"
				? [ "قيد الانشاء", "منشئ بصيانة غير جيدة", "منشئ بصيانة جيدة"]
				: ["Good building", "Fair building", "under consutruction"],
		required: false,
	});

	// Question 43: Number of Household Members
	composer.slide({ pageProgress: "36/59" });
	composer.numberInput("household_members", {
		question: translate(localization, {
			en: "Number of Household Members",
			ar: "عدد الافراد بالمنزل",
		}),
		min: 1,
		max: 100,
	});

	// Question 44: Risk Factor Location
	composer.slide({ pageProgress: "37/59" });
	composer.selectBox("risk_factor_location", {
		question: translate(localization, {
			en: "Risk Factor Location",
			ar: "موقع عامل الخطورة",
		}),
		options: [
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
		],
		required: false,
	});

	// Question 45: Risk Factors
	composer.slide({ pageProgress: "38/59" });
	composer.selectBox("risk_factors", {
		question: translate(localization, {
			en: "Risk Factors",
			ar: "عوامل الخطورة",
		}),
		options: [
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
		],
		required: false,
	});

	// Question 46: Other Risk Factor
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
		displayCondition: {
			dependencies: ["risk_factors"],
			condition: "risk_factors == 'أخرى'",
		},
	});

	// Question 47: Risk Factor Result
	composer.slide({ pageProgress: "40/59" });
	composer.selectBox("risk_factor_result", {
		question: translate(localization, {
			en: "Risk Factor Result",
			ar: "نتيجة عامل الخطورة",
		}),
		options:
			localization === "ar"
				? ["إيجابي", "سلبي", ]
				: ["Positive", "Negative",],
		required: false,
	});

	// Question 48: Number of Individuals Educated
	composer.slide({ pageProgress: "41/59" });
	composer.numberInput("individuals_educated", {
		question: translate(localization, {
			en: "Number of individuals who received health education at the case's home",
			ar: "عدد الأفراد الذين تم تقديم التثقيف الصحي لهم بمنزل الحالة",
		}),
		min: 0,
		max: 1000,
	});

	// Question 49: Risk Factors Leading Opinion
	composer.slide({ pageProgress: "42/59" });
	composer.selectBox("risk_factors_opinion", {
		question: translate(localization, {
			en: "In your opinion, what are the risk factors that lead to mosquito breeding?",
			ar: "برأيك، ماهي عوامل الخطورة التي تؤدي الى تكاثر البعوض",
		}),
		options: [
			"الخزانات المفتوحة",
			"مياه المكيفات",
			"مياه المزهريات",
			"أحواض الزينة",
			"تخزين المياه في الحاويات",
			"عدم وجود شبك في النوافذ",
			"إطارات السيارات",
			"سقي الحيوانات والطيور",
			"المسابح",
			"صعوبة التخلص من المياة السطحية",
			"أخرى حدد",
			"لا أعلم",
		],
		required: false,
	});

	// Question 50: Mosquito Repellent Products
	composer.slide({ pageProgress: "43/59" });
	composer.selectBox("mosquito_repellent_products", {
		question: translate(localization, {
			en: "What mosquito repellent products do you use?",
			ar: "ماهي المنتجات الطاردة للبعوض التي تستخدمها",
		}),
		options: [
			"كريم طارد للبعوض",
			"بخاخ طارد للبعوض",
			"البخور",
			"استخدام الناموسية",
			"طارد بعوض كهربائي",
			"المضرب الكهربائي للحشرات",
			"لصقات طاردة للبعوض",
			"مبيد حشري",
			"لا أستخدم",
		],
		required: false,
	});

	// Question 51: Diseases Transmitted Opinion
	composer.slide({ pageProgress: "44/59" });
	composer.selectBox("diseases_transmitted_opinion", {
		question: translate(localization, {
			en: "In your opinion, what diseases are transmitted through mosquito bites?",
			ar: "برأيك، ماهي الأمراض التي تنتقل عن طريق لدغ البعوض",
		}),
		options: [
			"الضنك",
			"الملاريا",
			"الخمرة",
			"جميعها",
			"أخرى",
		],
		required: false,
	});

	// Question 52: Action When Symptoms Appear
	composer.slide({ pageProgress: "45/59" });
	composer.selectBox("action_symptoms_appear", {
		question: translate(localization, {
			en: "What action is taken when symptoms appear?",
			ar: "ماهو الإجراء المتخذ عند ظهور الأعراض؟",
		}),
		options: [
			"التوجه لأقرب منشأة صحية",
			"تناول المسكنات",
			"الاتصال بالرقم 937",
		],
		required: false,
	});

	// Question 53: Health Education Status
	composer.slide({ pageProgress: "46/59" });
	composer.selectBox("health_education_status", {
		question: translate(localization, {
			en: "Health Education Status",
			ar: "حالة التثقيف الصحي",
		}),
		options:
			localization === "ar"
				? ["تم التثقيف", "لم يتم التثقيف"]
				: ["Educated", "Not Educated"],
		required: false,
	});

	return composer;
}
