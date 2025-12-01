import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createAcuteAbdomenFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "acute-abdomen-form",
		...getSharedFormConfig(localization, theme),
		postUrl: null, // No submission for this template generator
		restartButton: "hide",
		pageProgress: "hide", // Hide default progress bar
		thankYouScreenTitle: "",
		thankYouScreenDescription: "",
		paddingInlineTop: 120, // Adjusted space for the step progress header
	});

	// Header
	composer.h1(
		translate(localization, {
			en: "Acute Abdomen History Form",
			ar: "نموذج تاريخ البطن الحاد",
		}),
	);

	composer.p(
		translate(localization, {
			en: "Acute Abdomen Template",
			ar: "نموذج ألم البطن الحاد",
		}),
	);

	// 1. Age
	composer.slide({ pageProgress: "1/27" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "ما هو عمرك؟",
		}),
		min: 1,
		max: 120
	});

	// 2. Gender
	composer.slide({ pageProgress: "2/27" });
	composer.choiceInput("gender", {
		question: translate(localization, {
			en: "What's your gender?",
			ar: "ما هو جنسك؟",
		}),
		choices: [
			translate(localization, { en: "Male", ar: "ذكر" }),
			translate(localization, { en: "Female", ar: "أنثى" }),
		],
	});

	// 3. Pain Location
	composer.slide({ pageProgress: "3/27" });
	composer.choiceInput("pain_location", {
		question: translate(localization, {
			en: "Where is the pain located?",
			ar: "أين يقع الألم؟",
		}),
		choices: [
			translate(localization, { en: "Right Upper Quadrant", ar: "الربع العلوي الأيمن" }),
			translate(localization, { en: "Left Upper Quadrant", ar: "الربع العلوي الأيسر" }),
			translate(localization, { en: "Right Lower Quadrant", ar: "الربع السفلي الأيمن" }),
			translate(localization, { en: "Left Lower Quadrant", ar: "الربع السفلي الأيسر" }),
			translate(localization, { en: "Epigastric (Upper Middle)", ar: "فم المعدة (أعلى الوسط)" }),
			translate(localization, { en: "Periumbilical (Center)", ar: "حول السرة (الوسط)" }),
			translate(localization, { en: "Suprapubic (Lower Middle)", ar: "أسفل البطن (فوق العانة)" }),
			translate(localization, { en: "Generalized", ar: "منتشر في كامل البطن" }),
		],
	});

	composer.textInput("pain_location_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 4. Pain Radiation
	composer.slide({ pageProgress: "4/27" });
	composer.choiceInput("pain_radiation", {
		question: translate(localization, {
			en: "Does the pain radiate (move) anywhere else?",
			ar: "هل ينتقل الألم إلى أي مكان آخر؟",
		}),
		choices: [
			translate(localization, { en: "No", ar: "لا" }),
			translate(localization, { en: "Back", ar: "الظهر" }),
			translate(localization, { en: "Right Shoulder", ar: "الكتف الأيمن" }),
			translate(localization, { en: "Left Shoulder", ar: "الكتف الأيسر" }),
			translate(localization, { en: "Groin", ar: "الفخذ" }),
			translate(localization, { en: "Chest", ar: "الصدر" }),
		],
	});

	composer.textInput("pain_radiation_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 5. Onset
	composer.slide({ pageProgress: "5/27" });
	composer.textInput("onset_time", {
		question: translate(localization, {
			en: "When did the pain start?",
			ar: "متى بدأ الألم؟",
		}),
	});

	// 6. Onset Type
	composer.slide({ pageProgress: "6/27" });
	composer.choiceInput("onset_type", {
		question: translate(localization, {
			en: "How did the pain start?",
			ar: "كيف بدأ الألم؟",
		}),
		choices: [
			translate(localization, { en: "Sudden", ar: "فجأة" }),
			translate(localization, { en: "Gradual", ar: "تدريجياً" }),
		],
	});

	composer.textInput("onset_type_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 7. Character
	composer.slide({ pageProgress: "7/27" });
	composer.choiceInput("pain_character", {
		question: translate(localization, {
			en: "How would you describe the pain?",
			ar: "كيف تصف الألم؟",
		}),
		choices: [
			translate(localization, { en: "Sharp/Stabbing", ar: "حاد/طعن" }),
			translate(localization, { en: "Burning", ar: "حارق" }),
			translate(localization, { en: "Cramping/Colicky", ar: "مغص/تقلصات" }),
			translate(localization, { en: "Dull/Aching", ar: "كليل/وجع" }),
			translate(localization, { en: "Tearing/Ripping", ar: "تمزق" }),
		],
	});

	composer.textInput("pain_character_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 8. Severity
	composer.slide({ pageProgress: "8/27" });
	composer.numberInput("severity", {
		question: translate(localization, {
			en: "Severity on a scale of 1-10?",
			ar: "شدة الألم من 1 إلى 10؟",
		}),
		min: 1,
		max: 10
	});

	// 9. Progression
	composer.slide({ pageProgress: "9/27" });
	composer.choiceInput("progression", {
		question: translate(localization, {
			en: "Is the pain getting worse, better, or staying the same?",
			ar: "هل الألم يزداد سوءاً، يتحسن، أم يبقى كما هو؟",
		}),
		choices: [
			translate(localization, { en: "Worsening", ar: "يزداد سوءاً" }),
			translate(localization, { en: "Improving", ar: "يتحسن" }),
			translate(localization, { en: "Constant", ar: "ثابت" }),
			translate(localization, { en: "Intermittent", ar: "متقطع" }),
		],
	});

	composer.textInput("progression_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 10. Aggravating Factors
	composer.slide({ pageProgress: "10/27" });
	composer.textInput("aggravating_factors", {
		question: translate(localization, {
			en: "What makes the pain worse? (e.g., eating, movement, coughing)",
			ar: "ما الذي يزيد الألم؟ (مثل الأكل، الحركة، السعال)",
		}),
	});

	// 11. Alleviating Factors
	composer.slide({ pageProgress: "11/27" });
	composer.textInput("alleviating_factors", {
		question: translate(localization, {
			en: "What makes the pain better? (e.g., vomiting, lying still, leaning forward)",
			ar: "ما الذي يخفف الألم؟ (مثل القيء، الاستلقاء، الانحناء للأمام)",
		}),
	});

	// 12. Nausea/Vomiting
	composer.slide({ pageProgress: "12/27" });
	composer.choiceInput("nausea_vomiting", {
		question: translate(localization, {
			en: "Do you have nausea or vomiting?",
			ar: "هل تعاني من الغثيان أو القيء؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("vomit_details", {
		question: translate(localization, {
			en: "Details (Content: blood/bilious/food? Frequency?)",
			ar: "التفاصيل (المحتوى: دم/صفراوي/طعام؟ التكرار؟)",
		}),
		required: false,
	});

	// 13. Fever
	composer.slide({ pageProgress: "13/27" });
	composer.choiceInput("fever", {
		question: translate(localization, {
			en: "Do you have a fever or chills?",
			ar: "هل لديك حمى أو قشعريرة؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("fever_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 14. Bowel Habits
	composer.slide({ pageProgress: "14/27" });
	composer.choiceInput("bowel_habits", {
		question: translate(localization, {
			en: "Any change in bowel habits?",
			ar: "أي تغيير في عادات الأمعاء؟",
		}),
		choices: [
			translate(localization, { en: "None", ar: "لا يوجد" }),
			translate(localization, { en: "Diarrhea", ar: "إسهال" }),
			translate(localization, { en: "Constipation", ar: "إمساك" }),
			translate(localization, { en: "No gas passing (Obstipation)", ar: "عدم خروج غازات" }),
		],
	});

	composer.textInput("bowel_habits_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 15. Stool Characteristics
	composer.slide({ pageProgress: "15/27" });
	composer.choiceInput("stool_blood", {
		question: translate(localization, {
			en: "Any blood in stool or black tarry stool?",
			ar: "هل يوجد دم في البراز أو براز أسود؟",
		}),
		choices: [
			translate(localization, { en: "No", ar: "لا" }),
			translate(localization, { en: "Bright Red Blood", ar: "دم أحمر فاتح" }),
			translate(localization, { en: "Black/Tarry (Melena)", ar: "أسود/قطراني" }),
		],
	});

	composer.textInput("stool_blood_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 16. Urinary Symptoms
	composer.slide({ pageProgress: "16/27" });
	composer.choiceInput("urinary_symptoms", {
		question: translate(localization, {
			en: "Any urinary symptoms?",
			ar: "أي أعراض بولية؟",
		}),
		choices: [
			translate(localization, { en: "No", ar: "لا" }),
			translate(localization, { en: "Pain/Burning (Dysuria)", ar: "ألم/حرقان" }),
			translate(localization, { en: "Blood in urine (Hematuria)", ar: "دم في البول" }),
			translate(localization, { en: "Frequency/Urgency", ar: "تكرار/إلحاح" }),
		],
	});

	composer.textInput("urinary_symptoms_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 17. Anorexia/Weight Loss
	composer.slide({ pageProgress: "17/27" });
	composer.choiceInput("anorexia", {
		question: translate(localization, {
			en: "Loss of appetite or unintentional weight loss?",
			ar: "فقدان الشهية أو فقدان وزن غير مقصود؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("anorexia_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// 18. Past Surgeries
	composer.slide({ pageProgress: "18/27" });
	composer.choiceInput("past_surgeries", {
		question: translate(localization, {
			en: "Any previous abdominal surgeries?",
			ar: "هل خضعت لعمليات جراحية سابقة في البطن؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("past_surgeries_details", {
		question: translate(localization, {
			en: "Details (What surgery? When?)",
			ar: "التفاصيل (ما هي العملية؟ متى؟)",
		}),
		required: false,
	});

	// 19. Past Medical History
	composer.slide({ pageProgress: "19/27" });
	composer.textInput("pmh", {
		question: translate(localization, {
			en: "Past Medical History (e.g., Ulcers, Gallstones, Diabetes, Heart Disease)?",
			ar: "التاريخ الطبي السابق (مثل القرحة، حصى المرارة، السكري، أمراض القلب)؟",
		}),
	});

	// 20. Medications
	composer.slide({ pageProgress: "20/27" });
	composer.textInput("medications", {
		question: translate(localization, {
			en: "Current medications (especially NSAIDs, Steroids, Anticoagulants)?",
			ar: "الأدوية الحالية (خاصة المسكنات، الستيرويدات، مميعات الدم)؟",
		}),
	});

	// 21. Allergies
	composer.slide({ pageProgress: "21/27" });
	composer.textInput("allergies", {
		question: translate(localization, {
			en: "Allergies?",
			ar: "هل لديك حساسية؟",
		}),
	});

	// 22. Social History
	composer.slide({ pageProgress: "22/27" });
	composer.textInput("social_history", {
		question: translate(localization, {
			en: "Do you smoke or drink alcohol?",
			ar: "هل تدخن أو تشرب الكحول؟",
		}),
	});

	// 23. Gynecological (Females)
	composer.slide({ pageProgress: "23/27" });
	composer.textInput("gyne_history", {
		question: translate(localization, {
			en: "LMP? Chance of pregnancy? Vaginal bleeding?",
			ar: "تاريخ آخر دورة؟ احتمالية الحمل؟ نزيف مهبلي؟",
		}),
		required: false,
		displayCondition: {
			dependencies: ["gender"],
			condition: "gender == 'Female' or gender == 'أنثى'",
		},
	});

	// Review of Systems - Cardiopulmonary
	composer.slide({ pageProgress: "24/27" });
	composer.h2(
		translate(localization, {
			en: "Review of Systems",
			ar: "مراجعة الأنظمة",
		}),
	);

	composer.choiceInput("ros_cp", {
		question: translate(localization, {
			en: "Chest pain, Shortness of breath, Palpitations?",
			ar: "ألم في الصدر، ضيق في التنفس، خفقان؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_cp_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// ROS - Skin/Jaundice
	composer.slide({ pageProgress: "25/27" });
	composer.choiceInput("ros_skin", {
		question: translate(localization, {
			en: "Jaundice (Yellow skin/eyes) or Rash?",
			ar: "يرقان (اصفرار الجلد/العين) أو طفح جلدي؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_skin_details", {
		question: translate(localization, {
			en: "Details",
			ar: "التفاصيل",
		}),
		required: false,
	});

	// ROS - Other
	composer.slide({ pageProgress: "26/27" });
	composer.textInput("ros_other", {
		question: translate(localization, {
			en: "Any other symptoms?",
			ar: "أي أعراض أخرى؟",
		}),
	});

	// Generate Story
	composer.slide({ pageProgress: "27/27" });
	composer.h2(
		translate(localization, {
			en: "Patient Story",
			ar: "قصة المريض",
		}),
	);

	const buttonLabel = translate(localization, {
		en: "Generate Story",
		ar: "توليد القصة",
	});
	const loadingLabel = translate(localization, {
		en: "Generating...",
		ar: "جاري التوليد...",
	});
	const clearDataLabel = translate(localization, {
		en: "Clear Data",
		ar: "مسح البيانات",
	});
	const confirmTitle = translate(localization, {
		en: "Clear All Data?",
		ar: "مسح جميع البيانات؟",
	});
	const confirmMessage = translate(localization, {
		en: "Are you sure you want to clear all data? This action cannot be undone.",
		ar: "هل أنت متأكد أنك تريد مسح جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.",
	});
	const confirmYes = translate(localization, {
		en: "Yes, Clear",
		ar: "نعم، مسح",
	});
	const confirmNo = translate(localization, {
		en: "Cancel",
		ar: "إلغاء",
	});

	composer.free(`
<div class="fmd-next-controls fmd-d-flex fmd-justify-content-center fmd-mb-4">
<button type="button" id="btn-generate-story" class="fmd-btn fmd-btn-accent fmd-d-flex fmd-align-items-center fmd-justify-content-center" data-loading-text="${loadingLabel}">
${buttonLabel}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="fmd-icon fmd-ms-2 fmd-hide-rtl" aria-hidden="true" focusable="false"><path d="M273 239c9.4 9.4 9.4 24.6 0 33.9L113 433c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l143-143L79 113c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L273 239z"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="fmd-icon fmd-ms-2 fmd-hide-ltr" aria-hidden="true" focusable="false"><path d="M47 239c-9.4 9.4-9.4 24.6 0 33.9L207 433c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L97.9 256 241 113c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L47 239z"/></svg>
</button>
<button type="button" id="btn-clear-data" class="fmd-btn" style="background-color: #dc3545; color: white; margin-inline-start: 10px;">
${clearDataLabel}
</button>
</div>
<div id="story-result" class="fmd-card fmd-p-4 fmd-mt-4" style="display: none; white-space: pre-wrap; text-align: start;"></div>
<div class="fmd-text-center fmd-mt-2">
<button type="button" id="btn-copy-story" class="fmd-btn fmd-btn-sm fmd-btn-accent" style="display: none;">
Copy
</button>
</div>

<div id="clear-data-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
    <div style="background: white; padding: 20px; border-radius: 8px; max-width: 400px; width: 90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h3 style="margin-top: 0; color: #dc3545;">${confirmTitle}</h3>
        <p>${confirmMessage}</p>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
            <button type="button" id="btn-modal-cancel" class="fmd-btn" style="background: #f8f9fa; color: #212529; border: 1px solid #dee2e6;">${confirmNo}</button>
            <button type="button" id="btn-modal-confirm" class="fmd-btn" style="background: #dc3545; color: white;">${confirmYes}</button>
        </div>
    </div>
</div>
`);

	return composer;
}