import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool4_human_epidemiology",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم أعمال التقصي الوبائي البشري",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Human Epidemiological Investigation for RVF",
			ar: "تقييم أعمال التقصي الوبائي البشري للكشف عن فيروس حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form for the epidemiological team.",
			ar: "يرجى إكمال أداة التقييم الخاصة بفريق التقصي الوبائي.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/34" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/34" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["منزل الحالة", "مستشفى", "مركز صحي", "مقر العمل", "أخرى"] 
			: ["Case Residence", "Hospital", "Health Center", "Workplace", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/34" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/34" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/34" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/34" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني (7-32)
	const epiRatingQuestions = [
		{ id: "report_receipt", ar: "تأكيد استقبال البلاغ من الجهات ذات العلاقة عن الحالة المشتبه بها أو المؤكدة", en: "Confirming receipt of reports from relevant authorities regarding suspected or confirmed cases" },
		{ id: "case_definition", ar: "التأكد من مطابقة الحالة لتعريف الحالة المعتمد في التقصي الوبائي", en: "Verifying that the case matches the approved case definition for epidemiological investigation" },
		{ id: "open_epi_file", ar: "تم مباشرة فتح ملف تقصي وبائي للحالة", en: "Initiating the opening of an epidemiological investigation file for the case" },
		{ id: "team_coordination", ar: "تم التنسيق بين الفريق الصحي المشرف على الحالة والفريق المختص بالتقصي بصورة سريعة", en: "Rapid coordination between the medical team and the investigation team" },
		{ id: "ppe_prep_supervision", ar: "تم تجهيز أدوات ومعدات الحماية الشخصية قبل بدء العمل والاشراف على الحالة", en: "Preparing PPE before starting work and supervising the case" },
		{ id: "ppe_availability", ar: "تم تجهيز معدات وأدوات الحماية الشخصية (PPE)", en: "Availability and preparation of Personal Protective Equipment (PPE)" },
		{ id: "forms_readiness", ar: "تم تجهيز النماذج والاستمارات الوبائية المطلوبة والخاصة في التقصي الوبائي", en: "Preparation of required epidemiological forms and documents" },
		{ id: "sampling_tools_prep", ar: "تم جمع الأدوات والمواد اللازمة لأخذ العينات إن احتاج الأمر", en: "Collection of necessary tools and materials for sampling if required" },
		{ id: "patient_interview", ar: "تم مقابلة المريض أو ذويه لجمع المعلومات الأولية", en: "Interviewing the patient or their relatives to collect primary information" },
		{ id: "history_taking", ar: "تم أخذ التاريخ المرضي والوبائي (سفر/ تواصل / تجمعات / أماكن زيارة / احتكاك بالحيوانات)", en: "Taking medical and epidemiological history (travel, contact, gatherings, visits, animal contact)" },
		{ id: "clinical_signs_collection", ar: "تم جمع التاريخ المرضي والعلامات السريرية الظاهرة على الحالة", en: "Collecting clinical signs and symptoms observed on the case" },
		{ id: "occupation_identification", ar: "تم تحديد نوع الوظيفة التي يشغلها المصاب أو المشتبه بإصابته", en: "Identifying the occupation of the infected or suspected person" },
		{ id: "work_env_assessment", ar: "تم تقييم طبيعة بيئة العمل (مغلقة/مفتوحة ، فردية/جماعية)", en: "Assessing the nature of the work environment (closed/open, individual/group)" },
		{ id: "infection_factors_doc", ar: "تم توثيق وكتابة جميع العوامل المحتملة للعدوى", en: "Documenting and writing all potential infection factors" },
		{ id: "contact_data_collection", ar: "تم جمع بيانات المخالطين المباشرين وغير المباشرين للحالة الوبائية", en: "Collecting data on direct and indirect contacts of the epidemiological case" },
		{ id: "contact_type_doc", ar: "تم تحديد وتوثيق أنواع المخالطة للحالة (مباشرة / غير مباشرة / طويلة المدى / قصيرة المدى)", en: "Identifying and documenting contact types (direct/indirect, long/short term)" },
		{ id: "comprehensive_contact_list", ar: "تم إعداد قائمة شاملة للمخالطين مع كتابة بيانات التواصل", en: "Preparing a comprehensive contact list with contact details" },
		{ id: "contact_risk_stratification", ar: "تم تصنيف المخالطين حسب درجة الخطورة ونوع المخالطة", en: "Classifying contacts based on risk level and type of exposure" },
		{ id: "periodic_followup", ar: "تم متابعة المخالطين بشكل دوري وذلك خلال فترة الحضانة المناسبة", en: "Periodic follow-up of contacts during the appropriate incubation period" },
		{ id: "site_field_visit", ar: "تم عمل زيارة ميدانية لموقع إقامة الحالة والمخالطين", en: "Conducting a field visit to the residence of the case and contacts" },
		{ id: "env_health_assessment", ar: "تم تقييم الوضع البيئي والصحي للموقع", en: "Assessing the environmental and health status of the site" },
		{ id: "exposure_level_eval", ar: "تم تقييم مستوى التعرض لدى المخالطين المحتملين للحالة", en: "Evaluating the exposure level of potential contacts" },
		{ id: "contact_interviews", ar: "تم إجراء مقابلات مع المخالطين وجمع بياناتهم بشكل كامل", en: "Conducting interviews with contacts and fully collecting their data" },
		{ id: "incubation_monitoring", ar: "تم متابعة المخالطين لمدة فترة الحضانة", en: "Monitoring contacts for the duration of the incubation period" },
		{ id: "health_guidance_contacts", ar: "تم تقديم الإرشادات الصحية للمخالطين (وقاية / أعراض / علاج / مواعيد المراجعة)", en: "Providing health guidance to contacts (prevention, symptoms, treatment, follow-up dates)" },
		{ id: "transmission_pattern_id", ar: "تم تحديد نمط انتشار المرض (مباشر/ غير مباشر /غذائي / بيئي / عبر المياه / عبر النواقل / إلخ)", en: "Identifying the disease transmission pattern (direct, indirect, foodborne, vectors, etc.)" }
	];

	// توليد شرائح التقييم
	epiRatingQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/34` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (33-34)
	composer.slide({ pageProgress: "33/34" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "34/34" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}