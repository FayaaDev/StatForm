import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool2_human_samples",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzFcLXrZEPfbf7rGmP9WefLihZl_0bwQx8HBuO-IEOk4wA1XEH20fP0YldxnGat_ESeAw/exec",
		postSheetName: "تقييم أعمال جمع ونقل وحفظ العينات البشرية",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Evaluation of Human Sample Collection, Transport, and Preservation for RVF",
			ar: "تقييم أعمال جمع ونقل وحفظ العينات البشرية للكشف عن فيروس حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form.",
			ar: "يرجى إكمال أداة التقييم.",
		}),
	);

	// Metadata Questions (1-6)
	composer.slide({ pageProgress: "1/40" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: false,
	});

	composer.slide({ pageProgress: "2/40" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["المستشفى", "المركز الصحي", "المختبر", "موقع ميداني", "أخرى"] 
			: ["Hospital", "Health Center", "Laboratory", "Field Site", "Other"],
		required: false,
	});

	composer.slide({ pageProgress: "3/40" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: false,
	});

	composer.slide({ pageProgress: "4/40" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: false,
	});

	composer.slide({ pageProgress: "5/40" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: false,
	});

	composer.slide({ pageProgress: "6/40" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: false,
	});

	// Rating Questions (7-38)
	const ratingQuestions = [
		{
			id: "requirements_readiness",
			ar: "تم تجهيز كل الاحتياجات والمطلوبات اللازمة لجمع ونقل وحفظ العينات البشرية حسب المعايير المعتمدة بهيئة الصحة العامة",
			en: "All requirements for collection, transport, and preservation of human samples were prepared according to PHA standards"
		},
		{
			id: "ppe_donning_doffing",
			ar: "يتم ارتداء وسائل الوقاية الشخصية مع الالتزام بالتسلسل المعتمد وإزالتها بطريقة آمنة والتخلص من النفايات الطبية وفق اللوائح",
			en: "PPE is worn and removed following the approved sequence; medical waste is disposed of per regulations"
		},
		{
			id: "biosafety_storage",
			ar: "تم العمل على متطلبات السلامة الحيوية والتخزين اثناء سحب العينات حسب المعايير المعتمدة بهيئة الصحة",
			en: "Biosafety and storage requirements were maintained during sampling according to PHA standards"
		},
		{
			id: "sampling_tools_usage",
			ar: "تم استخدام أدوات سحب العينات التالية (Alcohol swabs, العاصبة, إبرة وحقنة أو نظام سحب أنبوبي مثل Vacutainer)",
			en: "Sampling tools (alcohol swabs, tourniquet, needle/syringe, or Vacutainer) were used correctly"
		},
		{
			id: "site_disinfection_procedure",
			ar: "تم تطهير مكان السحب بالكحول ووضع العاصبة (5-10 سم) واستخدام نظام السحب لإدخالها في الوريد",
			en: "Site was disinfected, tourniquet applied (5-10cm), and sampling system used for venipuncture"
		},
		{
			id: "sample_volume_tubes",
			ar: "تم سحب عينات دم بمقدار 5 الى 10 مل في انابيب ذات غطاء اصفر وبنفسجي واخضر (لفصل السيرم والبلازما)",
			en: "5-10ml of blood was drawn into yellow, purple, and green top tubes for serum/plasma separation"
		},
		{
			id: "post_sampling_bandage",
			ar: "تم وضع لاصق طبي على موقع سحب العينة بعد السحب مباشرة من الشخص المصاب او المشتبه اصابته",
			en: "Medical adhesive was placed on the sampling site immediately after collection"
		},
		{
			id: "labeling_permanent_ink",
			ar: "تم ترقيم وكتابة البيانات على الانابيب والحاويات واكياس الحماية باستخدام أقلام حبر غير قابلة للإزالة",
			en: "Data and numbering were written on tubes/containers using non-erasable ink"
		},
		{
			id: "rapid_test_check",
			ar: "تم فحص العينات المسحوبة والمجمعة باستخدام تقنية الاختبار الكشف السريع (Rapid test) في حال التوفر",
			en: "Samples were checked using Rapid Test technology where available"
		},
		{
			id: "preservation_materials",
			ar: "تم استخدام المواد التالية لحفظ العينة (أكياس بلاستيكية, Plastic Rack, Styrofoam cooler, Ice bags/Dry Ice)",
			en: "Preservation materials (leak-proof bags, racks, coolers, ice/dry ice) were used correctly"
		},
		{
			id: "biohazard_bags_containers",
			ar: "تم استخدام أكياس وحاويات المخاطر البيولوجية (حمراء, صفراء, حاويات إبر, سوداء) حسب نوع النفايات",
			en: "Appropriate biohazard bags and containers (Red, Yellow, Sharps, Black) were used"
		},
		{
			id: "sterilization_materials",
			ar: "تم استخدام مواد التعقيم (Alcohol swabs, معقمات كحولية 70% و 99.9%) لتعقيم اليدين ومكان العمل",
			en: "Sterilization agents (70% and 99.9% alcohol) were used for hands and workspace"
		},
		{
			id: "surface_decontamination",
			ar: "تم التأكد من تطهير الأسطح وأماكن سحب العينات واستئصال الانسجة قبل وبعد عمل الاجراءات",
			en: "Surfaces and sampling areas were decontaminated before and after procedures"
		},
		{
			id: "no_face_touching",
			ar: "عدم لمس الوجه أو الكمامة أثناء التعامل مع الحالات المصابة او المشتبه اصابتهم بالفيروس",
			en: "Avoided touching face or mask during handling of suspected or confirmed cases"
		},
		{
			id: "sharps_safety_disposal",
			ar: "تم التخلص الآمن من الأدوات الحادة في الحاويات المخصصة",
			en: "Safe disposal of sharps in dedicated sharps containers"
		},
		{
			id: "triple_packaging_transport",
			ar: "تم نقل العينات في حاويات ثلاثية (تريبل بكجينق) مع تحذيرات بيولوجية واضحة",
			en: "Samples were transported in triple packaging with clear biohazard warnings"
		},
		{
			id: "tissue_preservative_glycerol",
			ar: "في حال تأخر النقل، تُعالج الأنسجة المستأصلة بمحلول الجليسرول-السالين كحافظة مؤقتة",
			en: "In case of transport delay, tissues were treated with glycerol-saline as a temporary preservative"
		},
		{
			id: "first_aid_exposure",
			ar: "يتم اتباع إجراءات الإسعافات الأولية الفورية بغسل المنطقة بالماء والصابون وفق الممارسات القياسية",
			en: "Immediate first aid (washing with soap/water) was followed in case of exposure"
		},
		{
			id: "incident_reporting_protocol",
			ar: "يتم الإبلاغ الفوري عن الحادث وفق القنوات والبروتوكول المعتمد",
			en: "Immediate reporting of incidents via approved protocols and channels"
		},
		{
			id: "medical_evaluation_monitoring",
			ar: "يتم إجراء التقييم الطبي والمراقبة الوقائية اليومية عبر السؤال المباشر عن الأعراض للاكتشاف المبكر",
			en: "Medical evaluation and daily preventive monitoring for early detection of symptoms"
		},
		{
			id: "clinical_support_general",
			ar: "دعم صحي عاجل بتقديم دعم سريري طبي للمريض (سوائل، مضادات) حسب الأعراض الظاهرة",
			en: "Urgent clinical support (fluids, antibiotics) provided based on symptoms"
		},
		{
			id: "severe_clinical_support",
			ar: "تم تامين الدعم السرير حسب الاعراض الخطيرة المصاحبة مثل النزف أو العدوى البكتيرية المتزامنة",
			en: "Clinical support secured for severe symptoms like bleeding or secondary infections"
		},
		{
			id: "suspect_monitoring_14d",
			ar: "تم اجراء المراقبة المستمرة لمدة 14 يوماً للحالة المشتبه",
			en: "Continuous 14-day monitoring conducted for suspected cases"
		},
		{
			id: "hotline_937_awareness",
			ar: "معرفة رقم التواصل المجاني: 937",
			en: "Knowledge of the free contact hotline: 937"
		},
		{
			id: "transport_vehicle_type",
			ar: "استخدام وسيلة نقل مجهزة لمنع التسرب (دفع رباعي في الوعرة أو عادية في السهلة)",
			en: "Use of equipped transport vehicles to prevent leaks (4x4 for rugged terrain, normal for flat)"
		},
		{
			id: "cold_chain_maintenance",
			ar: "في الرحلات الطويلة: العينة تُنقل في درجة 2-8 مئوية أو تجميد -70 الى -80 درجة باستخدام النيتروجين أو الثلج الجاف",
			en: "Long trips: Samples kept at 2-8°C or frozen at -70 to -80°C using LN2 or dry ice"
		},
		{
			id: "transport_ppe_usage",
			ar: "تم استخدام أدوات الحماية الشخصية اثناء نقل العينات (كمامة، واقي وجه، قفازات نيتريل أو لاتكس)",
			en: "PPE used during transport (mask, face shield, nitrile/latex gloves)"
		},
		{
			id: "sample_stabilization",
			ar: "تم تثبيت العينات والانسجة بشكل مناسب في الحاويات المخصصة",
			en: "Samples and tissues were properly stabilized in dedicated containers"
		},
		{
			id: "white_biohazard_bags",
			ar: "تم استخدام أكياس وحاويات المخاطر البيولوجية التالية (أكياس حافظات طبية بيضاء شفافة)",
			en: "Used appropriate biohazard bags (White transparent medical preservative bags)"
		},
		{
			id: "triple_wrap_system",
			ar: "تم تغليف العينات وذلك باستخدام نظام التغليف الثلاثي",
			en: "Samples were wrapped using the triple-wrap system"
		},
		{
			id: "accompanying_documentation",
			ar: "وجود وثائق مصاحبة (استمارة نقل، نوع العينة، الكود، بيانات التواصل والطوارئ)",
			en: "Accompanying documentation present (forms, sample type, codes, emergency contact data)"
		},
		{
			id: "transport_permits",
			ar: "وجود تصريح ساري المفعول من الجهات المختصة لنقل العينات",
			en: "Presence of valid permits from competent authorities for sample transport"
		}
	];

	// Generate Rating Slides
	ratingQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/40` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: false,
		});
	});

	// Final Text Questions (39-40)
	composer.slide({ pageProgress: "39/40" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "40/40" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}