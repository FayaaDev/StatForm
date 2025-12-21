import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool7_vet_clinical_exam",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم الفحص الظاهري والسريري البيطري",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Veterinary Visual and Clinical Examination for RVF",
			ar: "تقييم الفحص الظاهري والسريري البيطري للكشف عن فيروس حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this clinical evaluation form.",
			ar: "يرجى إكمال أداة التقييم الخاصة بالفحص السريري البيطري.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/26" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/26" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["مزرعة", "حظيرة", "نقطة فحص حدودية", "موقع ميداني", "أخرى"] 
			: ["Farm", "Pen", "Border Checkpoint", "Field Site", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/26" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/26" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/26" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/26" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني والسريري (7-24)
	const clinicalQuestions = [
		{ id: "general_equip_prep", ar: "التجهيز العام للمعدات", en: "General equipment preparation" },
		{ id: "ppe_compliance_clinical", ar: "الالتزام بوسائل الوقاية الشخصية (PPE)", en: "Compliance with Personal Protective Equipment (PPE)" },
		{ id: "sampling_cooling_prep", ar: "تجهيز أدوات الجمع والتبريد", en: "Preparation of sample collection and cooling tools" },
		{ id: "data_recording_clinical", ar: "تسجيل جميع بيانات الحيوان والفاحص", en: "Recording all animal and examiner data" },
		{ id: "activity_level_eval", ar: "فحص مستوى النشاط (خمول، إجهاد)", en: "Evaluation of activity level (lethargy, stress)" },
		{ id: "body_condition_score", ar: "تقييم الحالة الجسدية", en: "Assessment of body condition score" },
		{ id: "external_signs_eval", ar: "فحص العلامات الظاهرية (إفرازات، تقرحات)", en: "Examination of external signs (discharges, ulcers)" },
		{ id: "vitals_check", ar: "فحص الحرارة والنبض والتنفس", en: "Checking vital signs (Temperature, Pulse, Respiration)" },
		{ id: "crt_evaluation", ar: "زمن اعادة امتلاء الشعيرات الدموية (CRT)", en: "Evaluation of Capillary Refill Time (CRT)" },
		{ id: "mucus_dehydration_check", ar: "فحص لون الأغشية المخاطية والجفاف", en: "Checking mucous membrane color and dehydration level" },
		{ id: "hemorrhagic_signs_eval", ar: "رصد العلامات النزفية", en: "Monitoring for hemorrhagic signs" },
		{ id: "liver_signs_jaundice", ar: "رصد علامات الكبد (اليرقان/الصفار)", en: "Monitoring for liver signs (Jaundice)" },
		{ id: "neurological_signs_eval", ar: "رصد العلامات العصبية", en: "Monitoring for neurological signs" },
		{ id: "repro_digestive_signs", ar: "فحص العلامات التناسلية (إجهاضات) والهضمية", en: "Examination of reproductive (abortions) and digestive signs" },
		{ id: "rvf_suspicion_level", ar: "تحديد مستوى الاشتباه بحمى الوادي المتصدع", en: "Determining the suspicion level for RVF" },
		{ id: "isolation_decision_clinical", ar: "قرار العزل الفوري للحالات المشتبهة", en: "Immediate isolation decision for suspected cases" },
		{ id: "sampling_decision_clinical", ar: "قرار أخذ العينات المخبرية", en: "Decision to collect laboratory samples" },
		{ id: "final_summary_doc", ar: "توثيق الخلاصة والتقرير النهائي للفحص", en: "Documentation of the final summary and examination report" }
	];

	// توليد شرائح التقييم
	clinicalQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/26` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (25-26)
	composer.slide({ pageProgress: "25/26" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "26/26" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}