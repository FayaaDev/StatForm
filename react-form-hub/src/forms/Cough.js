import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createCoughHistoryFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "cough-history-form",
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
			en: "Cough History and Assessment Form",
			ar: "نموذج تاريخ وتقييم السعال",
		}),
	);

	composer.p(
		translate(localization, {
			en: "Evaluation of Acute (<3 weeks), Subacute (3-8 weeks), or Chronic (>8 weeks) Cough.",
			ar: "تقييم السعال الحاد (أقل من 3 أسابيع)، شبه الحاد (3-8 أسابيع)، أو المزمن (أكثر من 8 أسابيع).",
		}),
	);

	// --- General Data ---

	// 1. Age
	composer.slide({ pageProgress: "1/20" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "العمر",
		}),
		min: 1,
		max: 120
	});

	// 2. Gender
	composer.slide({ pageProgress: "2/20" });
	composer.choiceInput("gender", {
		question: translate(localization, {
			en: "Gender",
			ar: "الجنس",
		}),
		choices: [
			translate(localization, { en: "Male", ar: "ذكر" }),
			translate(localization, { en: "Female", ar: "أنثى" }),
		],
	});

	// --- Cough Characteristics ---

	// 3. Duration (Key diagnostic factor)
	composer.slide({ pageProgress: "3/20" });
	composer.choiceInput("cough_duration", {
		question: translate(localization, {
			en: "How long have you had the cough?",
			ar: "كم مدة معاناتك من السعال؟",
		}),
		choices: [
			translate(localization, { en: "Less than 3 weeks (Acute)", ar: "أقل من 3 أسابيع (حاد)" }),
			translate(localization, { en: "3 to 8 weeks (Subacute)", ar: "3 إلى 8 أسابيع (شبه حاد)" }),
			translate(localization, { en: "More than 8 weeks (Chronic)", ar: "أكثر من 8 أسابيع (مزمن)" }),
		],
	});

	composer.textInput("cough_duration_details", {
		question: translate(localization, {
			en: "Please specify the exact duration if known:",
			ar: "يرجى تحديد المدة الدقيقة إن كانت معروفة:",
		}),
		required: false,
	});

	// 4. Type (Productive or Dry)
	composer.slide({ pageProgress: "4/20" });
	composer.choiceInput("cough_type", {
		question: translate(localization, {
			en: "Is the cough dry or productive (bringing up phlegm/mucus)?",
			ar: "هل السعال جاف أم مصحوب ببلغم/مخاط؟",
		}),
		choices: [
			translate(localization, { en: "Dry", ar: "جاف" }),
			translate(localization, { en: "Productive", ar: "مصحوب ببلغم" }),
		],
	});

	composer.textInput("cough_type_details", {
		question: translate(localization, {
			en: "Any additional details about the cough type?",
			ar: "أي تفاصيل إضافية عن نوع السعال؟",
		}),
		required: false,
	});

	// 5. Sputum Details (If productive)
	composer.slide({ pageProgress: "5/20" });
	composer.textInput("sputum_details", {
		question: translate(localization, {
			en: "If productive, describe the sputum (color, thickness, quantity, blood)?",
			ar: "إذا كان مصحوباً ببلغم، صفه (اللون، السماكة، الكمية، دم)؟",
		}),
		required: false,
	});

	// 6. Pattern/Timing (Paroxysmal, nocturnal)
	composer.slide({ pageProgress: "6/20" });
	composer.choiceInput("cough_pattern", {
		question: translate(localization, {
			en: "How would you describe the cough pattern?",
			ar: "كيف تصف نمط السعال؟",
		}),
		choices: [
			translate(localization, { en: "Constant/Daytime", ar: "ثابت/نهاري" }),
			translate(localization, { en: "Worse at night/lying flat", ar: "يزداد سوءاً ليلاً/أثناء الاستلقاء" }),
			translate(localization, { en: "Paroxysmal (Intense bouts/Whooping)", ar: "نوبات شديدة (سعال ديكي/متواصل)" }),
			translate(localization, { en: "Only with exertion/cold air", ar: "فقط مع الجهد/الهواء البارد" }),
		],
	});

	composer.textInput("cough_pattern_details", {
		question: translate(localization, {
			en: "Any additional details about the cough pattern?",
			ar: "أي تفاصيل إضافية عن نمط السعال؟",
		}),
		required: false,
	});

	// --- Associated Symptoms (Localizing the Cause) ---

	// 7. Upper Airway Symptoms (UACS/Rhinosinusitis)
	composer.slide({ pageProgress: "7/20" });
	composer.choiceInput("upper_airway_symptoms", {
		question: translate(localization, {
			en: "Do you have a runny nose, sneezing, or a sensation of mucus dripping down the throat (post-nasal drip)?",
			ar: "هل لديك سيلان في الأنف، عطاس، أو شعور بالبلغم يسيل في الحلق؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("upper_airway_symptoms_details", {
		question: translate(localization, {
			en: "Please describe these symptoms in detail:",
			ar: "يرجى وصف هذه الأعراض بالتفصيل:",
		}),
		required: false,
	});

	// 8. Gastrointestinal Symptoms (GERD)
	composer.slide({ pageProgress: "8/20" });
	composer.choiceInput("gi_symptoms", {
		question: translate(localization, {
			en: "Do you experience heartburn, acid reflux, or a sour taste in your mouth?",
			ar: "هل تعاني من حرقة في المعدة، ارتجاع حمضي، أو طعم حامض في فمك؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("gi_symptoms_details", {
		question: translate(localization, {
			en: "Please describe these symptoms in detail:",
			ar: "يرجى وصف هذه الأعراض بالتفصيل:",
		}),
		required: false,
	});

	// 9. Lower Respiratory Symptoms (Asthma/COPD/Pneumonia)
	composer.slide({ pageProgress: "9/20" });
	composer.choiceInput("resp_symptoms", {
		question: translate(localization, {
			en: "Do you have shortness of breath or wheezing (a whistling sound when breathing)?",
			ar: "هل لديك ضيق في التنفس أو أزيز (صوت صفير عند التنفس)؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("resp_symptoms_details", {
		question: translate(localization, {
			en: "Please describe these symptoms in detail:",
			ar: "يرجى وصف هذه الأعراض بالتفصيل:",
		}),
		required: false,
	});

	// 10. Cardiac Symptoms (CHF/Pulmonary Edema)
	composer.slide({ pageProgress: "10/20" });
	composer.choiceInput("cardiac_symptoms", {
		question: translate(localization, {
			en: "Do you have chest pain, swelling in your legs/feet, or palpitations?",
			ar: "هل لديك ألم في الصدر، تورم في الساقين/القدمين، أو خفقان؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("cardiac_symptoms_details", {
		question: translate(localization, {
			en: "Please describe these symptoms in detail:",
			ar: "يرجى وصف هذه الأعراض بالتفصيل:",
		}),
		required: false,
	});

	// 11. Systemic Symptoms (Infection/Malignancy)
	composer.slide({ pageProgress: "11/20" });
	composer.choiceInput("systemic_symptoms", {
		question: translate(localization, {
			en: "Do you have fever, night sweats, or unintentional weight loss?",
			ar: "هل لديك حمى، تعرق ليلي، أو فقدان وزن غير مقصود؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("systemic_symptoms_details", {
		question: translate(localization, {
			en: "Please describe these symptoms in detail:",
			ar: "يرجى وصف هذه الأعراض بالتفصيل:",
		}),
		required: false,
	});

	// --- Aggravating/Alleviating Factors and Complications ---

	// 12. Aggravating Factors
	composer.slide({ pageProgress: "12/20" });
	composer.textInput("aggravating_factors", {
		question: translate(localization, {
			en: "What makes the cough worse? (e.g., exercise, cold air, talking, specific posture)",
			ar: "ما الذي يزيد السعال سوءاً؟ (مثل الجهد، الهواء البارد، التحدث، وضعية معينة)",
		}),
	});

	// 13. Alleviating Factors
	composer.slide({ pageProgress: "13/20" });
	composer.textInput("alleviating_factors", {
		question: translate(localization, {
			en: "What makes the cough better? (e.g., cough drops, medication, specific posture)",
			ar: "ما الذي يخفف السعال؟ (مثل قطرات السعال، الأدوية، وضعية معينة)",
		}),
	});

	// 14. Complications (Severe/Persistent Cough)
	composer.slide({ pageProgress: "14/20" });
	composer.choiceInput("cough_complications", {
		question: translate(localization, {
			en: "Has the cough caused any of the following? (Select all that apply)",
			ar: "هل تسبب السعال في أي مما يلي؟ (اختر كل ما ينطبق)",
		}),
		choices: [
			translate(localization, { en: "Vomiting (Post-tussive vomiting)", ar: "قيء (قيء ما بعد السعال)" }),
			translate(localization, { en: "Syncope (Fainting)", ar: "إغماء" }),
			translate(localization, { en: "Urinary incontinence", ar: "سلس البول" }),
			translate(localization, { en: "Rib pain/fracture", ar: "ألم/كسر في الضلوع" }),
			translate(localization, { en: "Sleep disruption", ar: "اضطراب النوم" }),
		],
		multiple: true,
	});

	composer.textInput("cough_complications_details", {
		question: translate(localization, {
			en: "Please provide more details about these complications:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه المضاعفات:",
		}),
		required: false,
	});

	// --- Past and Social History ---

	// 15. Respiratory Past Medical History
	composer.slide({ pageProgress: "15/20" });
	composer.textInput("pmh_resp", {
		question: translate(localization, {
			en: "Past history of Asthma, COPD, Chronic Bronchitis, or Allergies?",
			ar: "تاريخ سابق للربو، مرض الانسداد الرئوي المزمن، التهاب الشعب الهوائية المزمن، أو الحساسية؟",
		}),
	});

	// 16. Medications (ACE Inhibitors)
	composer.slide({ pageProgress: "16/20" });
	composer.textInput("medications", {
		question: translate(localization, {
			en: "Current medications (especially any for blood pressure/heart, such as ACE inhibitors like Lisinopril)?",
			ar: "الأدوية الحالية (وخاصة أدوية ضغط الدم/القلب، مثل مثبطات الإنزيم المحول للأنجيوتنسين (ACE) مثل ليزينوبريل)؟",
		}),
	});

	// 17. Social History (Smoking)
	composer.slide({ pageProgress: "17/20" });
	composer.textInput("social_history", {
		question: translate(localization, {
			en: "Do you currently or previously smoke tobacco? (Packs per day, years smoked)",
			ar: "هل تدخن التبغ حالياً أو كنت تدخنه سابقاً؟ (عدد العلب يومياً، سنوات التدخين)",
		}),
	});

	// 18. Occupational/Environmental Exposure
	composer.slide({ pageProgress: "18/20" });
	composer.textInput("occupational_exposure", {
		question: translate(localization, {
			en: "Do you have any exposure to dust, chemicals, smoke, or irritants at home or work?",
			ar: "هل تتعرض لأي غبار، مواد كيميائية، دخان، أو مهيجات في المنزل أو العمل؟",
		}),
	});

	// 19. Other Relevant History
	composer.slide({ pageProgress: "19/20" });
	composer.textInput("other_history", {
		question: translate(localization, {
			en: "Any other significant medical history or recent infections?",
			ar: "أي تاريخ طبي مهم آخر أو التهابات حديثة؟",
		}),
	});

	// 20. Review of Systems - Other
	composer.slide({ pageProgress: "20/20" });
	composer.textInput("ros_other", {
		question: translate(localization, {
			en: "Any other symptoms not mentioned?",
			ar: "أي أعراض أخرى لم تُذكر؟",
		}),
	});

	// Generate Story (Kept as is for functionality)
	composer.slide({ pageProgress: "21/21" });
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