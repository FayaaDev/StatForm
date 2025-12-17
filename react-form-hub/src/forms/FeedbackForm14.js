import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createFeedbackForm14Composer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "tool14_operations",
		...getSharedFormConfig(localization, theme),
		postUrl: GOOGLE_SCRIPT_URL,
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Evaluation Tool 14 - Operations",
			ar: "اداة التقييم 14 - العمليات التشغيلية",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this evaluation form.",
			ar: "يرجى إكمال اداة التقييم.",
		}),
	);

	// Question 1: يوم المحاكاة
	composer.slide({ pageProgress: "1/16" });
	composer.selectBox("simulation_day", {
		question: translate(localization, {
			en: "Simulation Day",
			ar: "يوم المحاكاة",
		}),
		options:
			localization === "ar"
				? ["اليوم الأول", "اليوم الثاني", "اليوم الثالث",]
				: ["Day 1", "Day 2", "Day 3"],
		required: true,
	});

	// Question 2: موقع التقييم
	composer.slide({ pageProgress: "2/16" });
	composer.selectBox("evaluation_location", {
		question: translate(localization, {
			en: "Evaluation Location",
			ar: "موقع التقييم",
		}),
		options:
			localization === "ar"
				? [
					"الحالة الاولى",
					"سوق المواشي",
					"المسلخ العشوائي",
					"سكن العمالة",
					"موقع خطر محتمل 1",
					"موقع خطر محتمل 2",
					"موقع خطر محتمل 3",
					"موقع خطر محتمل 4",
					"موقع خطر محتمل 5",
					"موقع خطر محتمل 6",
					"موقع خطر محتمل 7",
					"موقع خطر محتمل 8",
					"حظيرة X",
					"حظيرة Y"
				]
				: [
					"First Case",
					"Livestock Market",
					"Informal Slaughterhouse",
					"Labor Housing",
					"Potential Hazard Site 1",
					"Potential Hazard Site 2",
					"Potential Hazard Site 3",
					"Potential Hazard Site 4",
					"Potential Hazard Site 5",
					"Potential Hazard Site 6",
					"Potential Hazard Site 7",
					"Potential Hazard Site 8",
					"Pen X",
					"Pen Y"
				],
		required: true,
	});

	// Question 3: الفريق الذي تم تقييمه
	composer.slide({ pageProgress: "3/16" });
	composer.textInput("evaluated_team", {
		question: translate(localization, {
			en: "Team Being Evaluated",
			ar: "الفريق الذي تم تقييمه",
		}),
		placeholder: translate(localization, {
			en: "Enter team name",
			ar: "أدخل اسم الفريق",
		}),
		required: true,
	});

	// Question 4: اسم المقيم
	composer.slide({ pageProgress: "4/16" });
	composer.selectBox("evaluator_name", {
		question: translate(localization, {
			en: "Evaluator Name",
			ar: "اسم المقيم",
		}),
		options:
			localization === "ar"
				? [
					"د. عبدالله قيسي",
					"د. محمد الحازمي",
					"أد.زكي منور",
					"د. خالد الشرواني",
					"د. خالد العنزي",
					"د. يزيد خليفة",
					"د. عمر دفع الله",
					"د. صديق نور الدين",
					"أ. احمد غزواني",
					"د. وحيد",
					"د. ثامر باخميس"
				]
				: [
					"Dr. Abdullah Qaisi",
					"Dr. Mohammed Al-Hazmi",
					"Prof. Zaki Munawar",
					"Dr. Khaled Al-Sharawani",
					"Dr. Khaled Al-Anazi",
					"Dr. Yazeed Khalifa",
					"Dr. Omar Dafaallah",
					"Dr. Sadiq Noor Al-Din",
					"Mr. Ahmed Ghazwani",
					"Dr. Waheed",
					"Dr. Thamer Bakhamis"
				],
		required: true,
	});

	// Question 5: وظيفة المقيم
	composer.slide({ pageProgress: "5/16" });
	composer.textInput("evaluator_position", {
		question: translate(localization, {
			en: "Evaluator Position",
			ar: "وظيفة المقيم",
		}),
		placeholder: translate(localization, {
			en: "Enter position",
			ar: "أدخل الوظيفة",
		}),
		required: true,
	});

	// Question 6: جهة عمل المقيم
	composer.slide({ pageProgress: "6/16" });
	composer.textInput("evaluator_organization", {
		question: translate(localization, {
			en: "Evaluator Organization",
			ar: "جهة عمل المقيم",
		}),
		placeholder: translate(localization, {
			en: "Enter organization",
			ar: "أدخل جهة العمل",
		}),
		required: true,
	});

	// Question 7: التنسيق والتكامل مع فرق العمل المختلفة
	composer.slide({ pageProgress: "7/16" });
	composer.ratingInput("coordination_integration", {
		question: translate(localization, {
			en: "Coordination and Integration with Different Work Teams",
			ar: "التنسيق والتكامل مع فرق العمل المختلفة",
		}),
		max: 5,
		required: true,
	});

	// Question 8: معالجة أي عوائق أو تحديات تواجه الفرق الميدانية
	composer.slide({ pageProgress: "8/16" });
	composer.ratingInput("handling_obstacles", {
		question: translate(localization, {
			en: "Handling Any Obstacles or Challenges Facing Field Teams",
			ar: "معالجة أي عوائق أو تحديات تواجه الفرق الميدانية",
		}),
		max: 5,
		required: true,
	});

	// Question 9: توزيع المهام والمسؤوليات حسب اختصاص كل جهة بشكل صحيح
	composer.slide({ pageProgress: "9/16" });
	composer.ratingInput("task_distribution", {
		question: translate(localization, {
			en: "Distribution of Tasks and Responsibilities According to Each Entity's Jurisdiction Correctly",
			ar: "توزيع المهام والمسؤوليات حسب اختصاص كل جهة بشكل صحيح",
		}),
		max: 5,
		required: true,
	});

	// Question 10: التنسيق والموائمة في الأعمال التشغيلية بين الجهات
	composer.slide({ pageProgress: "10/16" });
	composer.ratingInput("operational_coordination", {
		question: translate(localization, {
			en: "Coordination and Alignment in Operational Work Between Entities",
			ar: "التنسيق والموائمة في الأعمال التشغيلية بين الجهات",
		}),
		max: 5,
		required: true,
	});

	// Question 11: المراقبة والمتابعة أثناء التنفيذ
	composer.slide({ pageProgress: "11/16" });
	composer.ratingInput("monitoring_followup", {
		question: translate(localization, {
			en: "Monitoring and Follow-up During Implementation",
			ar: "المراقبة والمتابعة أثناء التنفيذ",
		}),
		max: 5,
		required: true,
	});

	// Question 12: رفع تقارير مشتركة الى اللجان التوجيهية و الوزارية
	composer.slide({ pageProgress: "12/16" });
	composer.ratingInput("joint_reports", {
		question: translate(localization, {
			en: "Submitting Joint Reports to Steering and Ministerial Committees",
			ar: "رفع تقارير مشتركة الى اللجان التوجيهية و الوزارية",
		}),
		max: 5,
		required: true,
	});

	// Question 13: جمع المعلومات و متابعة الأعمال التشغيلية الميدانية
	composer.slide({ pageProgress: "13/16" });
	composer.ratingInput("information_collection", {
		question: translate(localization, {
			en: "Information Collection and Follow-up of Field Operational Work",
			ar: "جمع المعلومات و متابعة الأعمال التشغيلية الميدانية",
		}),
		max: 5,
		required: true,
	});

	// Question 14: التصعيد عند الحاجة لذلك وفق الآلية المعتمدة
	composer.slide({ pageProgress: "14/16" });
	composer.ratingInput("escalation", {
		question: translate(localization, {
			en: "Escalation When Needed According to the Approved Mechanism",
			ar: "التصعيد عند الحاجة لذلك وفق الآلية المعتمدة",
		}),
		max: 5,
		required: true,
	});

	// Question 15: الملاحظات والتفاصيل
	composer.slide({ pageProgress: "15/16" });
	composer.textInput("notes_details", {
		question: translate(localization, {
			en: "Notes and Details",
			ar: "الملاحظات والتفاصيل",
		}),
		max: 5,
		required: true,
	});

	// Question 16: التوصيات والاقتراحات ماذا يمكن تحسينه
	composer.slide({ pageProgress: "16/16" });
	composer.textInput("recommendations", {
		question: translate(localization, {
			en: "Recommendations and Suggestions - What Can Be Improved",
			ar: "التوصيات والاقتراحات ماذا يمكن تحسينه",
		}),
		max: 5,
		required: true,
	});

	return composer;
}
