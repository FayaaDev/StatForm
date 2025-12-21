import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool3_vet_samples",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		postSheetName: "تقييم أعمال جمع ونقل وحفظ العينات البيطرية",
	});

	// شريحة الترحيب
	composer.h1(
		translate(localization, {
			en: "Evaluation of Veterinary Sample Collection, Transport, and Preservation for RVF",
			ar: "تقييم أعمال جمع ونقل وحفظ العينات البيطرية للكشف عن فيروس حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form.",
			ar: "يرجى إكمال أداة التقييم الخاصة بالعمليات البيطرية.",
		}),
	);

	// الأسئلة التعريفية (1-6)
	composer.slide({ pageProgress: "1/41" });
	composer.selectBox("simulation_day", {
		question: translate(localization, { en: "Simulation Day", ar: "يوم المحاكاة" }),
		options: localization === "ar" ? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"] : ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	composer.slide({ pageProgress: "2/41" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, { en: "Evaluation Location", ar: "موقع التقييم" }),
		options: localization === "ar" 
			? ["حظيرة", "مزرعة", "مسلخ", "سوق مواشي", "موقع ميداني", "أخرى"] 
			: ["Pen", "Farm", "Slaughterhouse", "Livestock Market", "Field Site", "Other"],
		required: true,
	});

	composer.slide({ pageProgress: "3/41" });
	composer.textInput("evaluated_team", {
		question: translate(localization, { en: "Team Being Evaluated", ar: "الفريق الذي تم تقييمه" }),
		placeholder: translate(localization, { en: "Enter team name", ar: "أدخل اسم الفريق" }),
		required: true,
	});

	composer.slide({ pageProgress: "4/41" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, { en: "Evaluator Name", ar: "اسم المقيم" }),
		options: localization === "ar"
			? ["د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني", "د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين", "أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"]
			: ["Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani", "Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din", "Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"],
		required: true,
	});

	composer.slide({ pageProgress: "5/41" });
	composer.textInput("evaluator_position", {
		question: translate(localization, { en: "Evaluator Position", ar: "وظيفة المقيم" }),
		placeholder: translate(localization, { en: "Enter position", ar: "أدخل الوظيفة" }),
		required: true,
	});

	composer.slide({ pageProgress: "6/41" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, { en: "Evaluator Organization", ar: "جهة عمل المقيم" }),
		placeholder: translate(localization, { en: "Enter organization", ar: "أدخل جهة العمل" }),
		required: true,
	});

	// أسئلة التقييم الفني (7-39)
	const vetRatingQuestions = [
		{
			id: "vet_requirements_readiness",
			ar: "تم تجهيز كل الاحتياجات والمطلوبات اللازمة لجمع ونقل وحفظ العينات البيطرية حسب المعايير المعتمدة بهيئة الصحة العامة",
			en: "All requirements for veterinary sample collection, transport, and preservation were prepared per PHA standards"
		},
		{
			id: "vet_ppe_sequence",
			ar: "يتم ارتداء وسائل الوقاية الشخصية مع الالتزام بالتسلسل المعتمد وإزالتها بطريقة آمنة والتخلص من النفايات الطبية وفق اللوائح",
			en: "PPE is worn/removed following the approved sequence; medical waste disposed per regulations"
		},
		{
			id: "weqaa_biosafety",
			ar: "تم العمل على متطلبات السلامة الحيوية والتخزين اثناء سحب العينات حسب المعايير المعتمدة بمركز وقاء",
			en: "Biosafety and storage requirements during sampling followed Weqaa Center standards"
		},
		{
			id: "trained_vet_staff",
			ar: "تم سحب العينات عن طريق الطبيب البيطري او احد العملين المدربين من مركز وقاء",
			en: "Samples were collected by a veterinarian or trained staff from Weqaa Center"
		},
		{
			id: "vet_sampling_tools",
			ar: "تم استخدام أدوات سحب العينات واستئصال الانسجة (الإبرة، أنبوب فاكيوتينر، مشرط جراحي، مقص)",
			en: "Sampling and tissue excision tools (needle, Vacutainer, scalpel, scissors) were used"
		},
		{
			id: "site_disinfection_vet",
			ar: "تم تطهير مكان السحب بالكحول بعد تثبيت الحيوان وإزالة الشعر وسحب العينة من الأوعية العصعصية أو الوريد الوداجي",
			en: "Site disinfected after animal restraint/shaving; sample drawn from coccygeal or jugular vein"
		},
		{
			id: "blood_volume_organs",
			ar: "تم سحب 20 مل دم من الحيوان، وفي حال الوفاة يتم أخذ الكبد أو الطحال أو القلب",
			en: "20ml of blood collected; liver, spleen, or heart taken in case of animal death"
		},
		{
			id: "vet_tube_types",
			ar: "تم استخدام أنواع الانابيب والحاويات التالية (EDTA tubes, Gel separator, leak-proof bags)",
			en: "Appropriate tubes (EDTA, Gel separator) and leak-proof bags for tissues were used"
		},
		{
			id: "vet_permanent_labeling",
			ar: "تم ترقيم وكتابة البيانات على الانابيب والحاويات باستخدام أقلام حبر غير قابلة للإزالة",
			en: "Data and numbering written on tubes/containers using permanent ink"
		},
		{
			id: "vet_rapid_test",
			ar: "تم فحص العينات المسحوبة والمجمعة باستخدام تقنية الاختبار الكشف السريع (Rapid test) في حال التوفر",
			en: "Collected samples were checked using Rapid Test technology where available"
		},
		{
			id: "vet_preservation_cooling",
			ar: "تم استخدام المواد اللازمة لحفظ العينة (أكياس مانعة للتسرب، حافظات Polystyrene، ثلج جاف/مجروش)",
			en: "Preservation materials (leak-proof bags, polystyrene boxes, dry/crushed ice) were used"
		},
		{
			id: "vet_biohazard_management",
			ar: "تم استخدام أكياس وحاويات المخاطر البيولوجية (حمراء، صفراء، حاويات إبر) حسب نوع النفايات",
			en: "Used correct biohazard bags and containers (Red, Yellow, Sharps) for waste"
		},
		{
			id: "vet_sterilization_agents",
			ar: "تم استخدام مواد التعقيم (كحول 70% و 99.9%) لتعقيم اليدين ومكان العمل قبل وبعد الإجراء",
			en: "Sterilization agents (70% & 99.9% alcohol) used for hands and workspace before/after procedure"
		},
		{
			id: "vet_surface_cleaning",
			ar: "تم التأكد من تطهير الأسطح وأماكن سحب العينات واستئصال الانسجة قبل وبعد عمل الاجراءات",
			en: "Surfaces and sampling areas were decontaminated before and after procedures"
		},
		{
			id: "vet_no_face_touch",
			ar: "عدم لمس الوجه أو الكمامة أثناء التعامل مع الحالات المصابة او المشتبه اصابتهم بالفيروس",
			en: "Avoided touching face or mask during handling of suspected or confirmed cases"
		},
		{
			id: "vet_sharps_disposal",
			ar: "تم التخلص الآمن من الأدوات الحادة في الحاويات المخصصة",
			en: "Safe disposal of sharps in dedicated sharps containers"
		},
		{
			id: "vet_triple_packaging",
			ar: "تم نقل العينات في حاويات ثلاثية (تريبل بكجينق) مع تحذيرات بيولوجية واضحة",
			en: "Samples transported in triple packaging with clear biohazard warnings"
		},
		{
			id: "vet_glycerol_saline",
			ar: "في حال تأخر النقل، تُعالج الأنسجة المستأصلة بمحلول الجليسرول-السالين كحافظة مؤقتة",
			en: "In case of transport delay, tissues treated with glycerol-saline as a temporary preservative"
		},
		{
			id: "vet_first_aid_soap",
			ar: "اتباع إجراءات الإسعافات الأولية بغسل المنطقة مباشرة بالماء والصابون وفق الممارسات القياسية",
			en: "Standard first aid (washing with soap/water) followed in case of exposure"
		},
		{
			id: "vet_incident_report",
			ar: "يتم الإبلاغ الفوري عن الحادث وفق القنوات والبروتوكول المعتمد",
			en: "Immediate reporting of incidents via approved protocols and channels"
		},
		{
			id: "vet_medical_eval",
			ar: "إجراء التقييم الطبي والمراقبة الوقائية اليومية للاكتشاف المبكر لأي مؤشرات مرضية",
			en: "Medical evaluation and daily preventive monitoring conducted for early detection"
		},
		{
			id: "vet_clinical_support",
			ar: "دعم صحي عاجل بتقديم دعم سريري طبي للمريض (سوائل، مضادات) حسب الأعراض",
			en: "Urgent clinical support (fluids, antibiotics) provided based on symptoms"
		},
		{
			id: "vet_severe_symptoms",
			ar: "تم تامين الدعم السرير حسب الاعراض الخطيرة المصاحبة مثل النزف أو العدوى البكتيرية",
			en: "Clinical support secured for severe symptoms like bleeding or secondary infections"
		},
		{
			id: "vet_14day_monitor",
			ar: "تم اجراء المراقبة المستمرة لمدة 14 يوماً للحالة المشتبه",
			en: "Continuous 14-day monitoring conducted for suspected cases"
		},
		{
			id: "vet_937_contact",
			ar: "معرفة رقم التواصل المجاني: 937",
			en: "Knowledge of the free contact hotline: 937"
		},
		{
			id: "vet_transport_vehicle",
			ar: "استخدام وسيلة نقل مجهزة لمنع التسرب (دفع رباعي للوعرة أو عادية للسهلة)",
			en: "Use of equipped transport vehicles to prevent leaks (4x4 for rugged, normal for flat terrain)"
		},
		{
			id: "vet_cold_chain",
			ar: "النقل في صندوق تبريد (2-8 مئوية) أو تجميد (-70 الى -80) باستخدام النيتروجين أو الثلج الجاف للرحلات الطويلة",
			en: "Long trips: Samples kept at 2-8°C or frozen at -70 to -80°C using LN2 or dry ice"
		},
		{
			id: "vet_transport_ppe",
			ar: "استخدام أدوات الحماية الشخصية (كمامة، واقي وجه، قفازات نيتريل أو لاتكس) اثناء نقل العينات",
			en: "PPE used during transport (mask, face shield, nitrile/latex gloves)"
		},
		{
			id: "vet_sample_stabilization",
			ar: "تم تثبيت العينات والانسجة بشكل مناسب في الحاويات المخصصة",
			en: "Samples and tissues were properly stabilized in dedicated containers"
		},
		{
			id: "vet_white_biohazard",
			ar: "تم استخدام أكياس حافظات طبية بيضاء شفافة (White Biohazard Bags)",
			en: "Used white transparent biohazard bags for medical preservation"
		},
		{
			id: "vet_triple_wrap",
			ar: "تم تغليف العينات وذلك باستخدام نظام التغليف الثلاثي",
			en: "Samples were wrapped using the triple-wrap system"
		},
		{
			id: "vet_doc_accompanying",
			ar: "وجود وثائق مصاحبة (استمارة نقل، نوع العينة، الكود، تاريخ السحب، بيانات الاتصال)",
			en: "Accompanying documentation present (forms, sample type, codes, date, contact data)"
		},
		{
			id: "vet_transport_permit",
			ar: "وجود تصريح ساري المفعول من الجهات المختصة لنقل العينات",
			en: "Presence of a valid permit from competent authorities for sample transport"
		}
	];

	// توليد شرائح التقييم
	vetRatingQuestions.forEach((q, index) => {
		const slideNum = 7 + index;
		composer.slide({ pageProgress: `${slideNum}/41` });
		composer.ratingInput(q.id, {
			question: translate(localization, { en: q.en, ar: q.ar }),
			max: 5,
			required: true,
		});
	});

	// الأسئلة النصية النهائية (40-41)
	composer.slide({ pageProgress: "40/41" });
	composer.textInput("notes_details", {
		question: translate(localization, { en: "Notes and Details", ar: "الملاحظات والتفاصيل" }),
		placeholder: translate(localization, { en: "Enter any additional notes", ar: "أدخل أي ملاحظات إضافية" }),
		required: false,
	});

	composer.slide({ pageProgress: "41/41" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, { en: "Recommendations and suggestions", ar: "التوصيات والاقتراحات ماذا يمكن تحسينه" }),
		placeholder: translate(localization, { en: "Enter recommendations", ar: "أدخل التوصيات" }),
		required: false,
	});

	return composer;
}