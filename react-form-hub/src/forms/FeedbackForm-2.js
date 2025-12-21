import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool2_operations",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzFcLXrZEPfbf7rGmP9WefLihZl_0bwQx8HBuO-IEOk4wA1XEH20fP0YldxnGat_ESeAw/exec",
		postSheetName: "أداة تقييم أعمال المكافحة لنواقل حمى الوادي المتصدع",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Evaluation Tool for Rift Valley Fever Vector Control Operations",
			ar: "أداة تقييم أعمال المكافحة لنواقل حمى الوادي المتصدع",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form.",
			ar: "يرجى إكمال أداة التقييم.",
		}),
	);

	// Question 1: يوم المحاكاة
	composer.slide({ pageProgress: "1/53" });
	composer.selectBox("simulation_day", {
		question: translate(localization, {
			en: "Simulation Day",
			ar: "يوم المحاكاة",
		}),
		options:
			localization === "ar"
				? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث"]
				: ["Day 1", "Day 2", "Day 3"],
		required: false,
	});

	// Question 2: موقع التقييم
	composer.slide({ pageProgress: "2/53" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, {
			en: "Evaluation Location",
			ar: "موقع التقييم",
		}),
		options:
			localization === "ar"
				? [
					"الحالة الاولى", "سوق المواشي", "المسلخ العشوائي", "سكن العمالة",
					"موقع خطر محتمل 1", "موقع خطر محتمل 2", "موقع خطر محتمل 3",
					"موقع خطر محتمل 4", "موقع خطر محتمل 5", "موقع خطر محتمل 6",
					"موقع خطر محتمل 7", "موقع خطر محتمل 8", "حظيرة X", "حظيرة Y"
				]
				: [
					"First Case", "Livestock Market", "Informal Slaughterhouse", "Labor Housing",
					"Potential Hazard Site 1", "Potential Hazard Site 2", "Potential Hazard Site 3",
					"Potential Hazard Site 4", "Potential Hazard Site 5", "Potential Hazard Site 6",
					"Potential Hazard Site 7", "Potential Hazard Site 8", "Pen X", "Pen Y"
				],
		required: false,
	});

	// Question 3: الفريق الذي تم تقييمه
	composer.slide({ pageProgress: "3/53" });
	composer.textInput("evaluated_team", {
		question: translate(localization, {
			en: "Team Being Evaluated",
			ar: "الفريق الذي تم تقييمه",
		}),
		placeholder: translate(localization, {
			en: "Enter team name",
			ar: "أدخل اسم الفريق",
		}),
		required: false,
	});

	// Question 4: اسم المقيم
	composer.slide({ pageProgress: "4/53" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, {
			en: "Evaluator Name",
			ar: "اسم المقيم",
		}),
		options:
			localization === "ar"
				? [
					"د. عبدالله قيسي", "د. محمد الحازمي", "أد.زكي منور", "د. خالد الشرواني",
					"د. خالد العنزي", "د. يزيد خليفة", "د. عمر دفع الله", "د. صديق نور الدين",
					"أ. احمد غزواني", "د. وحيد", "د. ثامر باخميس"
				]
				: [
					"Dr. Abdullah Qaisi", "Dr. Mohammed Al-Hazmi", "Prof. Zaki Munawar", "Dr. Khaled Al-Sharawani",
					"Dr. Khaled Al-Anazi", "Dr. Yazeed Khalifa", "Dr. Omar Dafaallah", "Dr. Sadiq Noor Al-Din",
					"Mr. Ahmed Ghazwani", "Dr. Waheed", "Dr. Thamer Bakhamis"
				],
		required: false,
	});

	// Question 5: وظيفة المقيم
	composer.slide({ pageProgress: "5/53" });
	composer.textInput("evaluator_position", {
		question: translate(localization, {
			en: "Evaluator Position",
			ar: "وظيفة المقيم",
		}),
		placeholder: translate(localization, {
			en: "Enter position",
			ar: "أدخل الوظيفة",
		}),
		required: false,
	});

	// Question 6: جهة عمل المقيم
	composer.slide({ pageProgress: "6/53" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, {
			en: "Evaluator Organization",
			ar: "جهة عمل المقيم",
		}),
		placeholder: translate(localization, {
			en: "Enter organization",
			ar: "أدخل جهة العمل",
		}),
		required: false,
	});

	// --- NEW RATING QUESTIONS ---

	const technicalQuestions = [
		{
			id: "field_requirements",
			ar: "جهّز كل الاحتياجات والمطلوبات الحقلية اللازمة للمكافحة حسب المعايير المعتمدة",
			en: "Prepare all necessary field requirements and supplies for control according to approved standards"
		},
		{
			id: "analyze_reports",
			ar: "حلل تقارير التقصي الحشري اليومية (يرقي/ بالغ) وحدد النقاط الساخنة (Hotspots)",
			en: "Analyze daily entomological surveillance reports (larvae/adult) and identify hotspots"
		},
		{
			id: "control_priorities",
			ar: "حدد أولويات المكافحة وخط السير حسب البروتوكول التشغيلي",
			en: "Determine control priorities and itinerary according to operational protocol"
		},
		{
			id: "routine_control_red_orange",
			ar: "قم بالمكافحة الروتينية (حشري/يرقي) في نطاق الأحزمة الوبائية (الأحمر والبرتقالي) حسب البروتوكول التشغيلي",
			en: "Perform routine control (insect/larvae) in epidemiological zones (Red and Orange) according to protocol"
		},
		{
			id: "routine_control_yellow",
			ar: "قم بالمكافحة الروتينية (حشري/يرقي) في نطاق الأحزمة الوبائية (الأصفر) حسب البروتوكول التشغيلي",
			en: "Perform routine control (insect/larvae) in epidemiological zones (Yellow) according to protocol"
		},
		{
			id: "routine_control_high_risk",
			ar: "قم بالمكافحة الروتينية (حشري/يرقي) في المواقع عالية الخطورة حسب البروتوكول التشغيلي",
			en: "Perform routine control (insect/larvae) in high-risk sites according to protocol"
		},
		{
			id: "monitor_weather",
			ar: "راقب حالات هطول الأمطار الغزيرة، والفيضانات، ووجود الغطاء النباتي الكثيف وكن مستعداَ لتفعيل الجاهزية حسب المعايير المعتمدة",
			en: "Monitor heavy rainfall, floods, and dense vegetation; be ready to activate readiness per standards"
		},
		{
			id: "emergency_plan_activation",
			ar: "فعّل خطة الطوارئ عند الإبلاغ عن حالات بشرية أو حيوانية مؤكدة او مشتبهة حسب البروتوكول التشغيلي",
			en: "Activate emergency plan upon reporting confirmed or suspected human or animal cases"
		},
		{
			id: "command_room_activation",
			ar: "فعّل غرفة قيادة الطوارئ المشتركة (الصحة الواحدة) حسب المعايير المعتمدة وحسب البروتوكول التشغيلي",
			en: "Activate the Joint Emergency Command Room (One Health) according to standards and protocol"
		},
		{
			id: "ppe_availability",
			ar: "توفر معدات الوقاية الشخصية PPE كاملة",
			en: "Availability of full Personal Protective Equipment (PPE)"
		},
		{
			id: "equipment_inspection",
			ar: "إجراء فحص وسلامة معدات واجهزة الرش ومعايرتها قبل التشغيل",
			en: "Conduct inspection, safety checks, and calibration of spraying equipment before operation"
		},
		{
			id: "site_control_day2",
			ar: "إبدأ بالمكافحة (حشري/ يرقي) في موقع الإصابة أو الاشتباه (حظيرة أو مزرعة) حسب البروتوكول التشغيلي (اليوم الثاني عقب الانتهاء من التقصي الحشري في اليوم الأول)",
			en: "Start control (insect/larvae) at the infection/suspicion site (pen or farm) on Day 2"
		},
		{
			id: "extended_control_5km",
			ar: "إستمر بالمكافحة (حشري/ يرقي) بعد واحد كلم من موقع الإصابة أو الاشتباه وحتى 5 كلم في كل الاتجاهات حسب البروتوكول التشغيلي (اليوم الثاني)",
			en: "Continue control from 1km up to 5km from the infection/suspicion site in all directions (Day 2)"
		},
		{
			id: "thermal_fogging_cycle",
			ar: "قم بأعمال التضبيب الحراري حول بؤرة الإصابة او الاشتباه وتابع التضبيب حتى 5 كلم في كل اتجاه، ثم كرر التضبيب الحراري كل 3 أيام ولمدة عشرة أيام (اليوم الثاني، الخامس، الثامن، الحادي عشر)",
			en: "Perform thermal fogging around the focus up to 5km; repeat every 3 days for 10 days"
		},
		{
			id: "municipality_coordination",
			ar: "نسّق مع فرع وزارة البلدية والإسكان للقيام بنفس خطوات المكافحة أعلاه (داخل سكن) موقع الإصابة أو الاشتباه وما حوله",
			en: "Coordinate with the Ministry of Municipality for control steps inside/around housing at infection sites"
		},
		{
			id: "control_duration",
			ar: "استمر في أعمال المكافحة (حشري/ يرقي) لمدة شهر أو حتى إغلاق الحالة حسب البروتوكول التشغيلي",
			en: "Continue control operations for one month or until the case is closed per protocol"
		},
		{
			id: "space_spraying",
			ar: "استخدم الرش الفراغي عند حدوث الأوبئة /الكثافات العالية للبعوض حسب البروتوكول",
			en: "Use space spraying during outbreaks or high mosquito density according to protocol"
		},
		{
			id: "wind_speed_check",
			ar: "سرعة الرياح كانت ضمن المسموح به ((1–10 كم/ساعة) – هل يوجد جهاز قياس سرعة الرياح بالسيارة؟",
			en: "Wind speed within allowed range (1–10 km/h) – Is there a wind gauge in the vehicle?"
		},
		{
			id: "vehicle_speed",
			ar: "سرعة السيارة كانت ضمن المسموح (8–10 كم/ساعة)",
			en: "Vehicle speed within allowed range (8–10 km/h)"
		},
		{
			id: "flow_rate_calibration",
			ar: "تم ضبط معدل التدفق Flow Rate ومعايرة جهاز الرش",
			en: "Flow rate was adjusted and spraying equipment calibrated"
		},
		{
			id: "area_coverage",
			ar: "تم تغطية المنطقة المحددة بالخطة بشكل كامل (المساحة المرشوشة)",
			en: "Complete coverage of the area specified in the plan (sprayed area)"
		},
		{
			id: "daily_report_form",
			ar: "وجود استمارة التقرير اليومي",
			en: "Presence of the daily report form"
		},
		{
			id: "worker_guidance",
			ar: "أرشد العاملين بالحظائر والمزارع وما حولهم لاستخدام الناموسيات والمراهم الطاردة والملابس الواقية",
			en: "Guide farm workers and residents on using bed nets, repellents, and protective clothing"
		},
		{
			id: "stagnant_water_removal",
			ar: "إزالة اوتقليل تجمعات المياه الراكدة (حظائر – مزارع – مساكن)",
			en: "Remove or reduce stagnant water (pens – farms – housing)"
		},
		{
			id: "drainage_improvement",
			ar: "تحسين الصرف في مواقع الحيوانات",
			en: "Improve drainage at animal sites"
		},
		{
			id: "vessel_cleaning",
			ar: "نظافة اوعية شرب الحيوانات بالحظائر",
			en: "Cleanliness of animal drinking vessels in pens"
		},
		{
			id: "swamp_removal",
			ar: "إزالة المستنقعات وجيوب المياه الصغيرة",
			en: "Removal of swamps and small water pockets"
		},
		{
			id: "water_tank_coverage",
			ar: "تغطية خزانات المياه ومعالجة التسربات",
			en: "Covering water tanks and addressing leaks"
		},
		{
			id: "tire_disposal",
			ar: "التخلص من الإطارات والمواد التي تجمع الماء",
			en: "Disposal of tires and water-collecting materials"
		},
		{
			id: "larvicide_usage",
			ar: "قم باستخدام المبيدات اليرقية (عند تعذر المكافحة البيئية/ الميكانيكية)",
			en: "Use larvicides when environmental/mechanical control is not feasible"
		},
		{
			id: "aerial_spraying_justification",
			ar: "وجود مبرّر علمي وتشغيلي لاستخدام الرش الجوي",
			en: "Scientific and operational justification for aerial spraying"
		},
		{
			id: "flight_maps",
			ar: "توفير خرائط دقيقة لمسارات الطيران",
			en: "Provision of accurate flight path maps"
		},
		{
			id: "aerial_calibration",
			ar: "معايرة نظام الرش (Nozzles – Flow Rate – Swath Width)",
			en: "Calibration of spraying system (Nozzles – Flow Rate – Swath Width)"
		},
		{
			id: "aerial_weather",
			ar: "الالتزام بظروف جوية ملائمة (رياح 1–16 كم/ساعة)",
			en: "Adherence to suitable weather conditions (wind 1–16 km/h)"
		},
		{
			id: "drone_permit",
			ar: "وجود تصريح تشغيل للدرون من الجهة المختصة",
			en: "Presence of a drone operation permit from the competent authority"
		},
		{
			id: "drone_license",
			ar: "المشغّل حاصل على رخصة تشغيل طائرات بدون طيار",
			en: "The operator holds a valid drone pilot license"
		},
		{
			id: "drone_flight_plan",
			ar: "وضع خطة طيران واضحة (ارتفاع – سرعة – مسار – تغطية)",
			en: "Clear flight plan established (altitude – speed – path – coverage)"
		},
		{
			id: "drone_system_check",
			ar: "فحص نظام الرش للدرون (مضخة – فوهات – معدل تدفق)",
			en: "Inspection of drone spray system (pump – nozzles – flow rate)"
		},
		{
			id: "drone_wind_limit",
			ar: "الالتزام بظروف رياح مناسبة (< 8–10 كم/ساعة)",
			en: "Adherence to suitable wind conditions (< 8–10 km/h)"
		},
		{
			id: "drone_monitoring",
			ar: "استخدام الدرون لرصد المستنقعات وبؤر التوالتكاثر",
			en: "Using the drone to monitor swamps and breeding sites"
		},
		{
			id: "flight_log_documentation",
			ar: "توثيق Flight Log للمسار والتغطية",
			en: "Documentation of Flight Log for path and coverage"
		},
		{
			id: "mission_log_presence",
			ar: "وجود سجل يومي للمهمة (الوقت– الفريق – المبيد – الجهاز – سرعة الرياح – الموقع – المساحة)",
			en: "Presence of a daily mission log (Time, Team, Pesticide, Equipment, Wind, Location, Area)"
		},
		{
			id: "post_op_report",
			ar: "رفع تقرير ما بعد العملية خلال 24 ساعة",
			en: "Submission of post-operation report within 24 hours"
		},
		{
			id: "effectiveness_evaluation",
			ar: "وجود تقييم للفعالية قبل وبعد المكافحة",
			en: "Presence of effectiveness evaluation before and after control"
		}
	];

	// Loop to generate rating slides 8 to 51
	technicalQuestions.forEach((q, index) => {
		const slideNum = 8 + index;
		composer.slide({ pageProgress: `${slideNum}/53` });
		composer.ratingInput(q.id, {
			question: translate(localization, {
				en: q.en,
				ar: q.ar,
			}),
			max: 5,
			required: false,
		});
	});

	// Question 52: الملاحظات والتفاصيل
	composer.slide({ pageProgress: "52/53" });
	composer.textInput("notes_details", {
		question: translate(localization, {
			en: "Notes and Details",
			ar: "الملاحظات والتفاصيل",
		}),
		placeholder: translate(localization, {
			en: "Enter any additional notes",
			ar: "أدخل أي ملاحظات إضافية",
		}),
		required: false,
	});

	// Question 53: التوصيات والاقتراحات
	composer.slide({ pageProgress: "53/53" });
	composer.textInput("recommendations_improvements", {
		question: translate(localization, {
			en: "Recommendations and suggestions for improvement",
			ar: "التوصيات والاقتراحات ماذا يمكن تحسينه",
		}),
		placeholder: translate(localization, {
			en: "Enter recommendations",
			ar: "أدخل التوصيات",
		}),
		required: false,
	});

	return composer;
}