import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool5_entomological_surveillance",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم أعمال التقصي الحشري",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Entomological Surveillance for RVF Vectors",
			ar: "تقييم أعمال التقصي الحشري لنواقل حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form for the entomological surveillance operations.",
			ar: "يرجى إكمال أداة التقييم الخاصة بعمليات التقصي الحشري.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/35" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/35" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["حظيرة", "مزرعة", "موقع مائي/مستنقع", "نقطة استكشاف", "أخرى"] 
			: ["Pen", "Farm", "Water/Swamp Site", "Surveillance Point", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/35" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/35" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/35" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/35" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني (7-33)
	const entoQuestions = [
		{ id: "field_readiness", ar: "جهّز كل الاحتياجات والمطلوبات الحقلية اللازمة للاستكشاف الحشري حسب المعايير المعتمدة", en: "Prepare all field requirements for entomological exploration per standards" },
		{ id: "red_orange_points", ar: "قم بإنشاء نقاط استكشاف حشري/يرقي في نطاق الأحزمة الوبائية (الأحمر والبرتقالي) حسب الخطة التشغيلية", en: "Establish larval/adult surveillance points in Red and Orange zones" },
		{ id: "yellow_points", ar: "قم بإنشاء نقاط استكشاف حشري/يرقي في نطاق الأحزمة الوبائية (الأصفر) حسب الخطة التشغيلية", en: "Establish larval/adult surveillance points in Yellow zones" },
		{ id: "high_risk_points", ar: "قم بإنشاء نقاط استكشاف حشري/يرقي في المواقع عالية الخطورة حسب الخطة التشغيلية", en: "Establish larval/adult surveillance points in high-risk sites" },
		{ id: "sentinel_points", ar: "قم بإنشاء نقاط استكشاف حشري/يرقي في مواقع القطعان الكاشفة حسب المعايير المعتمدة", en: "Establish larval/adult surveillance points at sentinel herd locations" },
		{ id: "light_trap_site", ar: "ضع المصيدة الضوئية في موقع الإصابة أو الاشتباه (حظيرة أو مزرعة) حسب البروتوكول (اليوم الأول)", en: "Place light traps at infection/suspected sites (Day 1)" },
		{ id: "trap_extended_radius", ar: "ضع مصيدة على بعد 1 كلم من الموقع وحتى 5 كلم في كل الاتجاهات حسب البروتوكول (اليوم الأول)", en: "Place traps from 1km up to 5km in all directions (Day 1)" },
		{ id: "pyrethrum_aspirator", ar: "استخدم الرش بالبيرثرم أو الشفاط لجمع البعوض المستريح بجدران وأسقف الحظائر والمساكن", en: "Use pyrethrum spray or aspirator to collect resting mosquitoes on walls/ceilings" },
		{ id: "water_sampling_5km", ar: "خذ عينات مياه من كل بؤر التكاثر في موقع الإصابة ومحيطها لمسافة 5 كلم (اليوم الأول)", en: "Collect water samples from all breeding sites within a 5km radius (Day 1)" },
		{ id: "larvae_storage_data", ar: "ضع عينات المياه واليرقات في أوعية مناسبة مع البيانات اللازمة للمختبر (اليوم الأول)", en: "Place water/larvae samples in proper containers with data for the lab (Day 1)" },
		{ id: "municipality_coord_ento", ar: "نسّق مع فرع وزارة البلدية والإسكان للقيام بنفس الخطوات أعلاه داخل السكن ومحيطه (اليوم الأول)", en: "Coordinate with the Municipality for indoor/outdoor steps (Day 1)" },
		{ id: "trap_retrieval_sorting", ar: "خذ المصيدة صبيحة اليوم الثاني وقم بفرز وتجهيز البعوض لإرساله للمختبر (اليوم الثاني)", en: "Retrieve traps on Day 2 morning; sort and prep mosquitoes for the lab" },
		{ id: "larvae_preservation", ar: "قم بحفظ اليرقات في الأوعية المخصصة مع كتابة بياناتها وارسالها للمختبر حسب المعايير", en: "Preserve larvae in designated containers with full data for the lab" },
		{ id: "expansion_15km", ar: "قم بتوسيع دائرة الاستكشاف الحشري واليرقي إلى 15 كم (ما أمكن) حسب البروتوكول (اليوم الثالث)", en: "Expand surveillance radius to 15km where possible (Day 3)" },
		{ id: "surveillance_duration", ar: "استمر في أعمال الاستكشاف (حشري/ يرقي) لمدة شهر أو حتى إغلاق الحالة", en: "Continue surveillance for one month or until case closure" },
		{ id: "trap_height", ar: "ضع المصيدة الضوئية في الموقع على ارتفاع متر ونصف من سطح الأرض حسب البروتوكول (اليوم الأول)", en: "Place light traps at a height of 1.5 meters from the ground (Day 1)" },
		{ id: "trap_processing_day2", ar: "خذ المصيدة صبيحة اليوم الثاني وقم بفرز وتجهيز ما بها من بعوض للمختبر (اليوم الثاني)", en: "Retrieve and process light trap contents on Day 2 morning" },
		{ id: "resting_collection_repeat", ar: "استخدم الرش بالبيرثرم أو الشفاط لجمع البعوض المستريح بجدران وأسقف الحظائر والمساكن", en: "Collect resting mosquitoes from walls/ceilings using pyrethrum or aspirators" },
		{ id: "breeding_site_inventory", ar: "قم بحصر بؤر تكاثر البعوض المختلفة بالموقع/ المواقع المستهدفة حسب المعايير", en: "Inventory various mosquito breeding sites in target locations" },
		{ id: "dipping_netting", ar: "خذ غرفات من تجمعات المياه ببؤر التكاثر بواسطة المغرفة المعيارية أو الشبكة", en: "Collect samples from breeding sites using a standard dipper or net" },
		{ id: "larvae_storage_specific", ar: "قم بحفظ اليرقات في الأوعية المخصصة مع كتابة بياناتها وارسالها للمختبر حسب البروتوكول", en: "Preserve and label larvae in specific containers for the lab" },
		{ id: "env_data_recording", ar: "سجّل البيانات البيئية وكل المعلومات الأخرى المطلوبة عن بؤر التكاثر حسب النماذج", en: "Record environmental data and breeding site info in approved forms" },
		{ id: "adult_morphology", ar: "قم بالتصنيف المورفولوجي للبعوض البالغ حتى النوع حسب المعايير والمفاتيح المناسبة", en: "Perform morphological identification of adult mosquitoes to species level" },
		{ id: "larvae_morphology", ar: "قم بالتصنيف المورفولوجي ليرقات البعوض حتى النوع حسب المعايير والمفاتيح المناسبة", en: "Perform morphological identification of larvae to species level" },
		{ id: "molecular_pcr_rvfv", ar: "تأكيد التصنيف المورفولوجي والتقصي عن وجود RVFV بالناقل باستخدام PCR حسب البروتوكول", en: "Confirm morphology and detect RVFV in vectors using PCR" },
		{ id: "analysis_mapping", ar: "قم بتحليل نتائج الاستكشاف الحشري وعمل الخرائط اللازمة حسب المعايير المعتمدة", en: "Analyze surveillance results and create necessary maps" },
		{ id: "periodic_reporting", ar: "قم بإعداد التقارير الدورية المطلوبة حسب البروتوكول", en: "Prepare required periodic reports according to protocol" }
	];

	// توليد شرائح التقييم
	entoQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/35` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (34-35)
	composer.slide({ pageProgress: "34/35" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "35/35" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}