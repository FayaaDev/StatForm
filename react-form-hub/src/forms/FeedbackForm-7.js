import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool6_vet_case_investigation",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzFcLXrZEPfbf7rGmP9WefLihZl_0bwQx8HBuO-IEOk4wA1XEH20fP0YldxnGat_ESeAw/exec",
		postSheetName: "تقييم تقصي الحالة البيطري",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Veterinary Case Investigation for RVF",
			ar: "تقييم تقصي الحالة البيطري",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form for the veterinary investigation team.",
			ar: "يرجى إكمال أداة التقييم الخاصة بفريق تقصي الحالة البيطري.",
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
			? ["مزرعة", "حظيرة", "موقع ميداني", "أخرى"] 
			: ["Farm", "Pen", "Field Site", "Other"],
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

	// أسئلة التقييم الفني (7-24)
	const vetCaseQuestions = [
		{ id: "herd_info_collection", ar: "جمع معلومات المزرعة والقطيع", en: "Collecting farm and herd information" },
		{ id: "breeder_interview", ar: "سؤال المربي عن العلامات السريرية ونسبة النفوق والاجهاضات", en: "Questioning the breeder about clinical signs, mortality rate, and abortions" },
		{ id: "epi_risk_factors", ar: "تحديد عوامل الخطورة الوبائية", en: "Identifying epidemiological risk factors" },
		{ id: "health_records_review", ar: "مراجعة السجل الصحي والتطعيمات", en: "Reviewing health and vaccination records" },
		{ id: "symptom_timeline", ar: "التسلسل الزمني للأعراض", en: "Chronological timeline of symptoms" },
		{ id: "biohazard_precautions", ar: "تطبيق احتياطات التعامل مع سوائل حيوية خطرة والتخلص الامن منها", en: "Applying precautions for handling hazardous biological fluids and safe disposal" },
		{ id: "logical_investigation_flow", ar: "اتباع تسلسل منطقي للفحص والتقصي", en: "Following a logical sequence for examination and investigation" },
		{ id: "rvf_suspicion_link", ar: "القدرة على ربط الأعراض بالتاريخ الوبائي والاشتباه ب RVF", en: "Ability to link symptoms with epidemiological history and suspect RVF" },
		{ id: "documentation_accuracy", ar: "دقة التوثيق النهائي", en: "Accuracy of the final documentation" },
		{ id: "animal_isolation", ar: "عزل الحيوانات المصابة", en: "Isolating infected animals" },
		{ id: "movement_control", ar: "وقف إدخال/خروج الحيوانات", en: "Stopping the entry/exit of animals (movement control)" },
		{ id: "vector_control_measures", ar: "مكافحة النواقل", en: "Implementing vector control measures" },
		{ id: "lab_sample_submission", ar: "رفع العينات إلى المختبر", en: "Submitting samples to the laboratory" },
		{ id: "urgent_reporting", ar: "رفع تقرير عاجل للجهات المختصة", en: "Submitting an urgent report to relevant authorities" },
		{ id: "vaccination_enhancement", ar: "تعزيز التحصين في المنطقة", en: "Enhancing vaccination in the area" },
		{ id: "pesticide_spraying", ar: "رش مبيدات مكافحة البعوض", en: "Spraying pesticides for mosquito control" },
		{ id: "case_monitoring_14d", ar: "مراقبة الحالات لمدة 14 يوم", en: "Monitoring cases for a period of 14 days" },
		{ id: "biosecurity_review", ar: "مراجعة إجراءات الأمن الحيوي لدى المربي", en: "Reviewing biosecurity procedures with the breeder" }
	];

	// توليد شرائح التقييم
	vetCaseQuestions.forEach((q, index) => {
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