import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool8_insect_preservation_transport",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم حفظ ونقل العينات الحشرية",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Insect Sample Preservation and Transport (RVF)",
			ar: "تقييم حفظ ونقل العينات الحشرية لنواقل حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form for insect sample logistics.",
			ar: "يرجى إكمال أداة التقييم الخاصة بلوجستيات حفظ ونقل العينات الحشرية.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/21" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/21" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["مختبر ميداني", "نقطة جمع", "أثناء النقل", "مختبر مركزي", "أخرى"] 
			: ["Field Lab", "Collection Point", "During Transport", "Central Lab", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/21" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/21" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/21" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/21" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني (7-19)
	const insectLogisticsQuestions = [
		{ id: "affected_areas_id", ar: "التأكد من تحديد المناطق المتضررة والمهددة بالتفشي بناء على بيانات الجهات المعنية حسب الدليل الإرشادي", en: "Ensuring identification of affected/threatened areas based on guidelines" },
		{ id: "execution_outbreak_zones", ar: "التنفيذ مع الجهة المعينة في نطاق المناطق المتوقع التفشي فيها لجمع ونقل البعوض حسب المعايير", en: "Implementation in expected outbreak zones for mosquito collection and transport" },
		{ id: "trap_distribution_radius", ar: "التأكد من تحديد نطاق القطر للخط المحدد وتوزيع مصائد الجمع للبالغ حسب التوصيات", en: "Ensuring trap distribution and radius definition for adult collection" },
		{ id: "response_level_eval", ar: "تقييم مستوى الاستجابة لنطاق كل جهة في المناطق المهددة حسب التوصيات", en: "Evaluating response level for each entity in threatened areas" },
		{ id: "ppe_collection_transport", ar: "تقييم آلية الحماية الشخصية (PPE) أثناء الجمع والنقل حسب الدليل الإرشادي", en: "Evaluating PPE protocols during collection and transport" },
		{ id: "collection_timing_stage", ar: "تقييم أوقات الجمع للبعوض على مستوى الطور حسب المعايير المحددة", en: "Evaluating collection timing based on mosquito life stage" },
		{ id: "field_to_lab_transport", ar: "تقييم آلية نقل العينات من الحقل إلى المختبر حسب المعايير المحددة", en: "Evaluating the mechanism of sample transport from field to lab" },
		{ id: "data_registration_mech", ar: "تقييم آلية تسجيل البيانات حسب المعايير المحددة", en: "Evaluating the data registration mechanism" },
		{ id: "adult_mosquito_preservation", ar: "التأكد من استخدام الآلية المناسبة لحفظ ونقل البعوض البالغ حسب المعايير", en: "Ensuring appropriate mechanism for adult mosquito preservation and transport" },
		{ id: "larvae_preservation_transport", ar: "التأكد من استخدام الآلية المناسبة لحفظ ونقل يرقات البعوض حسب المعايير", en: "Ensuring appropriate mechanism for mosquito larvae preservation and transport" },
		{ id: "lab_response_comm", ar: "قياس مدى الاستجابة لدى المختبرات والتواصل حسب التوصيات", en: "Measuring lab response and communication efficiency" },
		{ id: "sample_data_availability", ar: "التأكد من توفر البيانات الخاصة بالعينات حسب المعايير المحددة", en: "Ensuring availability of specific sample data" },
		{ id: "transport_conditions_test_type", ar: "التأكد من وضع العينات في الظروف المناسبة للنقل حسب نوع الفحص", en: "Ensuring appropriate transport conditions based on test type" }
	];

	// توليد شرائح التقييم
	insectLogisticsQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/21` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (20-21)
	composer.slide({ pageProgress: "20/21" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "21/21" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}