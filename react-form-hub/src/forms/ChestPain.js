import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createChestPainHistoryFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "chest-pain-history-form",
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
			en: "Chest Pain History Form",
			ar: "نموذج تاريخ ألم الصدر",
		}),
	);

	composer.p(
		translate(localization, {
			en: "Chest Pain Template",
			ar: "نموذج ألم الصدر",
		}),
	);

	// 1. Age
	composer.slide({ pageProgress: "1/32" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "العمر",
		}),
		min: 1,
		max: 120,
		required: true,
	});

	// 2. Gender
	composer.slide({ pageProgress: "2/32" });
	composer.choiceInput("gender", {
		question: translate(localization, {
			en: "Gender",
			ar: "الجنس",
		}),
		choices: [
			translate(localization, { en: "Male", ar: "ذكر" }),
			translate(localization, { en: "Female", ar: "أنثى" }),
		],
		required: true,
	});

	// 3. Onset - Activity
	composer.slide({ pageProgress: "3/32" });
	composer.choiceInput("onset_activity", {
		question: translate(localization, {
			en: "What were you doing when the pain started?",
			ar: "ماذا كنت تفعل عندما بدأ الألم؟",
		}),
		choices: [
			translate(localization, { en: "Resting", ar: "في حالة راحة" }),
			translate(localization, { en: "Exertion / Exercise", ar: "مجهود / تمرين" }),
			translate(localization, { en: "Sleeping", ar: "نائم" }),
			translate(localization, { en: "Emotional Stress", ar: "تويتر عاطفي" }),
		],
	});

	composer.textInput("onset_activity_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 2. Onset - Type
	composer.slide({ pageProgress: "4/32" });
	composer.choiceInput("onset_type", {
		question: translate(localization, {
			en: "Did the pain start suddenly or gradually?",
			ar: "هل بدأ الألم فجأة أم تدريجياً؟",
		}),
		choices: [
			translate(localization, { en: "Sudden", ar: "فجأة" }),
			translate(localization, { en: "Gradual", ar: "تدريجياً" }),
		],
	});

	composer.textInput("onset_type_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 3. Location
	composer.slide({ pageProgress: "5/32" });
	composer.choiceInput("location", {
		question: translate(localization, {
			en: "Where is the pain exactly?",
			ar: "أين مكان الألم بالضبط؟",
		}),
		choices: [
			translate(localization, { en: "Center of chest (Retrosternal)", ar: "وسط الصدر (خلف القص)" }),
			translate(localization, { en: "Left side", ar: "الجانب الأيسر" }),
			translate(localization, { en: "Right side", ar: "الجانب الأيمن" }),
			translate(localization, { en: "Epigastric (Stomach area)", ar: "فم المعدة" }),
			translate(localization, { en: "Diffuse (Can't point with one finger)", ar: "منتشر (لا يمكن تحديده بإصبع واحد)" }),
		],
	});

	composer.textInput("location_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 4. Radiation
	composer.slide({ pageProgress: "6/32" });
	composer.choiceInput("radiation", {
		question: translate(localization, {
			en: "Does the pain radiate (move) anywhere?",
			ar: "هل ينتقل الألم إلى أي مكان؟",
		}),
		choices: [
			translate(localization, { en: "No", ar: "لا" }),
			translate(localization, { en: "Left Arm/Shoulder", ar: "الذراع/الكتف الأيسر" }),
			translate(localization, { en: "Jaw/Neck", ar: "الفك/الرقبة" }),
			translate(localization, { en: "Back (Between shoulder blades)", ar: "الظهر (بين الكتفين)" }),
			translate(localization, { en: "Stomach", ar: "المعده" }),
		],
	});

	composer.textInput("radiation_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 5. Character
	composer.slide({ pageProgress: "7/32" });
	composer.choiceInput("character", {
		question: translate(localization, {
			en: "How does the pain feel?",
			ar: "كيف تصف شعور الألم؟",
		}),
		choices: [
			translate(localization, { en: "Heavy/Crushing/Squeezing (Elephant on chest)", ar: "ثقيل/ضاغط/عصر (فيل على الصدر)" }),
			translate(localization, { en: "Tightness/Pressure", ar: "ضيق/ضغط" }),
			translate(localization, { en: "Sharp/Stabbing", ar: "حاد/طعن" }),
			translate(localization, { en: "Burning", ar: "حارق" }),
			translate(localization, { en: "Tearing/Ripping", ar: "تمزق" }),
			translate(localization, { en: "Pleuritic (Worse with deep breath)", ar: "جنبي (يزداد مع التنفس العميق)" }),
		],
	});

	composer.textInput("character_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 6. Severity
	composer.slide({ pageProgress: "8/32" });
	composer.numberInput("severity", {
		question: translate(localization, {
			en: "Severity (0-10)?",
			ar: "الشدة (0-10)؟",
		}),
		min: 0,
		max: 10
	});

	// 7. Duration
	composer.slide({ pageProgress: "9/32" });
	composer.textInput("duration", {
		question: translate(localization, {
			en: "How long does the pain last?",
			ar: "كم تستمر نوبة الألم؟",
		}),
	});

	// 8. Aggravating Factors - Exertion
	composer.slide({ pageProgress: "10/32" });
	composer.choiceInput("agg_exertion", {
		question: translate(localization, {
			en: "Does exertion (walking/stairs) make it worse?",
			ar: "هل المجهود (المشي/الدرج) يزيد الألم؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("agg_exertion_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 9. Aggravating Factors - Breathing/Position
	composer.slide({ pageProgress: "11/32" });
	composer.choiceInput("agg_breathing", {
		question: translate(localization, {
			en: "Does deep breathing or changing position make it worse?",
			ar: "هل التنفس العميق أو تغيير الوضعية يزيد الألم؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("agg_breathing_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 10. Relieving Factors
	composer.slide({ pageProgress: "12/32" });
	composer.textInput("relieving", {
		question: translate(localization, {
			en: "What makes it better? (Rest, Nitrates/GTN, Leaning forward, Antacids)",
			ar: "ما الذي يخفف الألم؟ (الراحة، النترات، الانحناء للأمام، مضادات الحموضة)",
		}),
	});

	// 11. Associated - Nausea/Sweating
	composer.slide({ pageProgress: "13/32" });
	composer.choiceInput("assoc_autonomic", {
		question: translate(localization, {
			en: "Did you have nausea, vomiting, or sweating (diaphoresis)?",
			ar: "هل شعرت بالغثيان، القيء، أو التعرق؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("assoc_autonomic_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 12. Associated - SOB
	composer.slide({ pageProgress: "14/32" });
	composer.choiceInput("assoc_sob", {
		question: translate(localization, {
			en: "Shortness of breath (Dyspnea)?",
			ar: "ضيق في التنفس؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("assoc_sob_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 13. Associated - Palpitations/Syncope
	composer.slide({ pageProgress: "15/32" });
	composer.choiceInput("assoc_palp", {
		question: translate(localization, {
			en: "Palpitations or Fainting (Syncope)?",
			ar: "خفقان أو إغماء؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("assoc_palp_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 14. Associated - Other
	composer.slide({ pageProgress: "16/32" });
	composer.textInput("assoc_other", {
		question: translate(localization, {
			en: "Other symptoms (Cough, Fever, Hemoptysis)?",
			ar: "أعراض أخرى (سعال، حمى، نفث الدم)؟",
		}),
	});

	// 15. Risk Factors - Cardiac (HTN/DM)
	composer.slide({ pageProgress: "17/32" });
	composer.choiceInput("rf_cardiac_major", {
		question: translate(localization, {
			en: "Do you have Hypertension (High BP) or Diabetes?",
			ar: "هل تعاني من ارتفاع ضغط الدم أو السكري؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("rf_cardiac_major_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 16. Risk Factors - Cardiac (Cholesterol/Smoking)
	composer.slide({ pageProgress: "18/32" });
	composer.choiceInput("rf_cardiac_lifestyle", {
		question: translate(localization, {
			en: "High Cholesterol or Smoker?",
			ar: "ارتفاع الكوليسترول أو مدخن؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("rf_cardiac_lifestyle_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 17. Risk Factors - Family History
	composer.slide({ pageProgress: "19/32" });
	composer.choiceInput("rf_family", {
		question: translate(localization, {
			en: "Family history of heart attacks (MI) under age 55?",
			ar: "تاريخ عائلي للنوبات القلبية قبل سن 55؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("rf_family_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 18. Risk Factors - PE (DVT/Leg Pain)
	composer.slide({ pageProgress: "20/32" });
	composer.choiceInput("rf_pe_dvt", {
		question: translate(localization, {
			en: "Any calf pain/swelling or history of DVT?",
			ar: "ألم/تورم في الساق أو تاريخ جلطة ساق (DVT)؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("rf_pe_dvt_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 19. Risk Factors - PE (Immobility/Surgery/Cancer)
	composer.slide({ pageProgress: "21/32" });
	composer.choiceInput("rf_pe_major", {
		question: translate(localization, {
			en: "Recent surgery, long travel (immobility), or active cancer?",
			ar: "جراحة حديثة، سفر طويل (عدم حركة)، أو سرطان نشط؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("rf_pe_major_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 20. History - Previous Episodes
	composer.slide({ pageProgress: "22/32" });
	composer.choiceInput("history_prev", {
		question: translate(localization, {
			en: "Have you had this pain before?",
			ar: "هل شعرت بهذا الألم من قبل؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("history_prev_details", {
		question: translate(localization, {
			en: "Details (Was it diagnosed? Any investigations?)",
			ar: "التفاصيل (هل تم تشخيصه؟ أي فحوصات؟)",
		}),
		required: false,
	});

	// 21. History - Cardiac interventions
	composer.slide({ pageProgress: "23/32" });
	composer.textInput("history_cardiac_interventions", {
		question: translate(localization, {
			en: "Prior Stents, CABG, or Angiography?",
			ar: "دعامات سابقة، قسطرة، أو عملية قلب مفتوح؟",
		}),
	});

	// 22. Medications
	composer.slide({ pageProgress: "24/32" });
	composer.textInput("medications", {
		question: translate(localization, {
			en: "Current medications (Aspirin, Blood thinners, Inhalers)?",
			ar: "الأدوية الحالية (أسبرين، مميعات، بخاخات)؟",
		}),
	});

	// 23. Allergies
	composer.slide({ pageProgress: "25/32" });
	composer.textInput("allergies", {
		question: translate(localization, {
			en: "Allergies?",
			ar: "هل لديك حساسية؟",
		}),
	});

	// 24. Social History
	composer.slide({ pageProgress: "26/32" });
	composer.textInput("social_history", {
		question: translate(localization, {
			en: "Smoking (packs/day), Alcohol, Illicit drugs (Cocaine)?",
			ar: "تدخين (علبة/يوم)، كحول، مخدرات (كوكايين)؟",
		}),
	});

	// Review of Systems - GI (GERD)
	composer.slide({ pageProgress: "27/32" });
	composer.h2(
		translate(localization, {
			en: "Review of Systems",
			ar: "مراجعة الأنظمة",
		}),
	);

	composer.choiceInput("ros_gi", {
		question: translate(localization, {
			en: "Heartburn, acid reflux, or indigestion?",
			ar: "حرقة معدة، ارتجاع، أو عسر هضم؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_gi_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// ROS - Musculoskeletal
	composer.slide({ pageProgress: "28/32" });
	composer.choiceInput("ros_msk", {
		question: translate(localization, {
			en: "Did you lift anything heavy recently or have trauma to chest?",
			ar: "هل حملت شيئاً ثقيلاً مؤخراً أو تعرضت لضربة على الصدر؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_msk_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// ROS - Respiratory (Infection)
	composer.slide({ pageProgress: "29/32" });
	composer.choiceInput("ros_resp_infection", {
		question: translate(localization, {
			en: "Recent flu, cold, or upper respiratory infection?",
			ar: "أنفلونزا حديثة، زكام، أو عدوى تنفسية علوية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_resp_infection_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 28. Panic/Anxiety
	composer.slide({ pageProgress: "30/32" });
	composer.choiceInput("ros_psych", {
		question: translate(localization, {
			en: "Any history of panic attacks or severe anxiety?",
			ar: "أي تاريخ لنوبات هلع أو قلق شديد؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("ros_psych_details", {
		question: translate(localization, {
			en: "Details?",
			ar: "تفاصيل؟",
		}),
		required: false,
	});

	// 29. Other
	composer.slide({ pageProgress: "31/32" });
	composer.textInput("ros_other", {
		question: translate(localization, {
			en: "Any other symptoms?",
			ar: "أي أعراض أخرى؟",
		}),
	});

	// Generate Story
	composer.slide({ pageProgress: "32/32" });
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