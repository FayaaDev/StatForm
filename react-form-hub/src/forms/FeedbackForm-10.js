import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool9_health_education",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم التثقيف الصحي",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Health Education Activities (RVF)",
			ar: "تقييم أعمال التثقيف الصحي حول فيروس حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form for health education performance.",
			ar: "يرجى إكمال أداة التقييم الخاصة بأداء التثقيف الصحي.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/17" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/17" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["منزل", "مزرعة", "مسجد", "مدرسة", "مركز تجاري", "أخرى"] 
			: ["Home", "Farm", "Mosque", "School", "Mall", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/17" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Educator/Team Being Evaluated", ar: "المثقف / الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter name", ar: "أدخل الاسم" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/17" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/17" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/17" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني (7-15)
	const eduQuestions = [
		{ id: "rvf_vector_link", ar: "شرح ارتباط حمى الوادي المتصدع بالنواقل (البعوض) وتأثيرها على الإنسان والحيوان", en: "Explanation of RVF link to vectors (mosquitoes) and impact on humans/animals" },
		{ id: "personal_protection_msg", ar: "رسائل الحماية الشخصية (طارد البعوض، أكمام طويلة، ناموسية، تقليل التعرض للبؤر)", en: "Personal protection messages (repellent, long sleeves, nets, avoiding breeding sites)" },
		{ id: "animal_handling_safety", ar: "رسائل السلامة عند الذبح والإجهاضات وتقليل ملامسة الدم واستخدام القفازات", en: "Safety messages for slaughtering/abortions and avoiding blood/tissue contact" },
		{ id: "hygiene_precautions", ar: "التأكيد على ممارسات النظافة وتقليل التعرض لسوائل الجسم والاحترازات الأساسية", en: "Emphasis on hygiene practices and minimizing body fluid exposure" },
		{ id: "breeding_site_reduction", ar: "توجيه عملي لتقليل بؤر توالد البعوض حول المنازل والمزارع وتجفيف المياه الراكدة", en: "Practical guidance for reducing mosquito breeding sites and drying stagnant water" },
		{ id: "reporting_community_role", ar: "تعزيز دور المجتمع في الإبلاغ عن مواقع التكاثر عبر رقم الأمانة (940) أو منصة بلدي", en: "Community role in reporting breeding sites via 940 or Balady platform" },
		{ id: "medical_care_guidance", ar: "التوجيه بمراجعة المنشآت الصحية عند ظهور أعراض والتواصل مع رقم الصحة (937)", en: "Guidance to seek medical care for symptoms and contacting 937" },
		{ id: "vet_reporting_939", ar: "الإرشاد بضرورة إبلاغ مركز وقاء (939) خلال 24 ساعة عند نفوق أو إجهاض الحيوانات", en: "Guidance to report animal deaths/abortions to Weqaa (939) within 24 hours" },
		{ id: "comm_skills_efficiency", ar: "تنفيذ التثقيف في وقت قياسي (10 دقائق) باحترافية ووضوح وإنصات فعال", en: "Efficiency (max 10 mins) and professional communication skills (clarity, listening)" }
	];

	// توليد شرائح التقييم
	eduQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/17` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (16-17)
	composer.slide({ pageProgress: "16/17" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "17/17" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}