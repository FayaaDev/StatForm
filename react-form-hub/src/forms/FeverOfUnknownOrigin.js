import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

// Note: The diagnostic criteria for FUO is defined as a temperature greater than 38.3°C (101°F)
// on several occasions, lasting longer than 3 weeks, and where the diagnosis remains uncertain
// after 3 days of inpatient investigation or 3 outpatient visits.

export function createFeverOfUnknownOriginFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "fuo-history-form",
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
			en: "Fever of Unknown Origin (FUO) History Form",
			ar: "نموذج تاريخ حمى مجهولة المصدر (FUO)",
		}),
	);

	composer.p(
		translate(localization, {
			en: "History of fever > 38.3°C for > 3 weeks, undiagnosed after 3 visits.",
			ar: "نموذج FUO: تاريخ حمى > 38.3 درجة مئوية لأكثر من 3 أسابيع، ولم يتم تشخيصها بعد 3 زيارات.",
		}),
	);

	// --- General Data (Adapted from Acute Abdomen) ---

	// 1. Age
	composer.slide({ pageProgress: "1/20" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "ما هو عمرك؟",
		}),
		min: 1,
		max: 120
	});

	// 2. Gender
	composer.slide({ pageProgress: "2/20" });
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

	composer.textInput("gender_details", {
		question: translate(localization, {
			en: "Details (if any)",
			ar: "التفاصيل (إن وجدت)",
		}),
		required: false,
	});

	// --- Core FUO Criteria and Fever Characteristics (Adapted) ---

	// 3. Fever Maximum Temperature
	composer.slide({ pageProgress: "3/20" });
	composer.textInput("max_temp", {
		question: translate(localization, {
			en: "What is the maximum temperature recorded during this illness?",
			ar: "ما هي أقصى درجة حرارة سجلت أثناء هذا المرض؟",
		}),
		// Note: The definition requires > 38.3°C
	});

	// 4. Fever Duration
	composer.slide({ pageProgress: "4/20" });
	composer.textInput("fever_duration", {
		question: translate(localization, {
			en: "How long has the fever lasted (in weeks/days)?",
			ar: "كم مدة استمرار الحمى (بالأسابيع/الأيام)؟",
		}),
		// Note: The definition requires > 3 weeks
	});

	// 5. Fever Pattern (Helpful for different causes)
	composer.slide({ pageProgress: "5/20" });
	composer.choiceInput("fever_pattern", {
		question: translate(localization, {
			en: "What is the fever pattern?",
			ar: "ما هو نمط الحمى؟",
		}),
		choices: [
			translate(localization, { en: "Intermittent (Spiking/Remitting)", ar: "متقطع (ارتفاع/انخفاض)" }),
			translate(localization, { en: "Continuous", ar: "مستمر" }),
			translate(localization, { en: "Unknown/Variable", ar: "غير معروف/متغير" }),
		],
	});

	composer.textInput("fever_pattern_details", {
		question: translate(localization, {
			en: "Details (describe the pattern)",
			ar: "التفاصيل (صف النمط)",
		}),
		required: false,
	});

	// 6. Chills/Rigors
	composer.slide({ pageProgress: "6/20" });
	composer.choiceInput("chills_rigors", {
		question: translate(localization, {
			en: "Do you experience recurrent chills or rigors (severe, shaking chills)?",
			ar: "هل تعاني من قشعريرة متكررة أو رجفات (قشعريرة شديدة مع اهتزاز)؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("chills_rigors_details", {
		question: translate(localization, {
			en: "Details (frequency, severity)",
			ar: "التفاصيل (التكرار، الشدة)",
		}),
		required: false,
	});

	// --- Key Elements of FUO History (Systemic Symptoms) ---

	// 7. Unintentional Weight Loss/Anorexia
	composer.slide({ pageProgress: "7/20" });
	composer.choiceInput("weight_loss", {
		question: translate(localization, {
			en: "Have you had unintentional weight loss or loss of appetite?",
			ar: "هل عانيت من فقدان وزن غير مقصود أو فقدان شهية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("weight_loss_details", {
		question: translate(localization, {
			en: "Details (How much weight loss? Over what period?)",
			ar: "التفاصيل (كمية الوزن المفقود؟ على مدى أي فترة؟)",
		}),
		required: false,
	});

	// 8. Localizing Symptoms (Aches/Pain)
	composer.slide({ pageProgress: "8/20" });
	composer.choiceInput("localizing_symptoms", {
		question: translate(localization, {
			en: "Do you have any new aches, pains, or localized symptoms (e.g., headache, joint pain, abdominal pain)?",
			ar: "هل لديك أي آلام جديدة أو أعراض موضعية (مثل الصداع، ألم المفاصل، ألم البطن)؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("localizing_symptoms_details", {
		question: translate(localization, {
			en: "Details (Site and nature of pain)",
			ar: "التفاصيل (موقع وطبيعة الألم)",
		}),
		required: false,
	});


	// --- Exposure/Risk Factors (Crucial for FUO) ---
	// Source emphasizes detailed history, including exposures and travel.

	// 9. Travel History
	composer.slide({ pageProgress: "9/20" });
	composer.textInput("travel_history", {
		question: translate(localization, {
			en: "Recent travel (in the last 6 months)? Where and when?",
			ar: "سفر حديث (في الأشهر الستة الماضية)؟ أين ومتى؟",
		}),
	});

	// 10. Animal/Vector Exposure
	composer.slide({ pageProgress: "10/20" });
	composer.textInput("animal_exposure", {
		question: translate(localization, {
			en: "Exposure to animals (pets, livestock, wild animals) or insect/tick bites?",
			ar: "التعرض للحيوانات (أليفة، ماشية، برية) أو لدغات حشرات/قراد؟",
		}),
	});

	// 11. Occupation/Environmental Exposure
	composer.slide({ pageProgress: "11/20" });
	composer.textInput("occupational_exposure", {
		question: translate(localization, {
			en: "Occupation and environmental exposures (e.g., soil, water, dust, chemicals)?",
			ar: "المهنة والتعرض البيئي (مثل التربة، الماء، الغبار، المواد الكيميائية)؟",
		}),
	});

	// 12. Transfusion/Needle Exposure
	composer.slide({ pageProgress: "12/20" });
	composer.textInput("blood_exposure", {
		question: translate(localization, {
			en: "History of blood transfusions, needle stick injury, or intravenous drug use?",
			ar: "تاريخ عمليات نقل الدم، إصابات الوخز بالإبر، أو استخدام المخدرات عن طريق الوريد؟",
		}),
	});

	// --- Past Medical History (Focusing on Immunosuppression/Risk) ---

	// 13. Underlying Conditions
	composer.slide({ pageProgress: "13/20" });
	composer.textInput("pmh_fuo", {
		question: translate(localization, {
			en: "Past Medical History (e.g., Autoimmune diseases, HIV, Cancer, or any condition causing immunosuppression)?",
			ar: "التاريخ الطبي السابق (مثل أمراض المناعة الذاتية، فيروس نقص المناعة، السرطان، أو أي حالة تسبب تثبيط المناعة)؟",
		}),
		// Source mentions that fever duration of 3 weeks is part of the FUO criteria
	});

	// 14. Medications (Drug Fever)
	composer.slide({ pageProgress: "14/20" });
	composer.textInput("medications_fuo", {
		question: translate(localization, {
			en: "Current medications (especially antibiotics, recent drug changes, or immunosuppressants)?",
			ar: "الأدوية الحالية (خاصة المضادات الحيوية، التغييرات الأخيرة في الأدوية، أو مثبطات المناعة)؟",
		}),
		// Drug fever is an important cause in FUO.
	});

	// 15. Allergies
	composer.slide({ pageProgress: "15/20" });
	composer.textInput("allergies", {
		question: translate(localization, {
			en: "Allergies?",
			ar: "هل لديك حساسية؟",
		}),
	});

	// 16. Past Surgeries/Implants
	composer.slide({ pageProgress: "16/20" });
	composer.textInput("past_surgeries_implants", {
		question: translate(localization, {
			en: "Any previous surgeries or medical implants (e.g., prosthetic joints, valves, catheters)?",
			ar: "هل خضعت لعمليات جراحية سابقة أو لديك زرعات طبية (مثل المفاصل الاصطناعية، الصمامات، القسطرة)؟",
		}),
	});

	// 17. Family History
	composer.slide({ pageProgress: "17/20" });
	composer.textInput("family_history", {
		question: translate(localization, {
			en: "Family history of fever, autoimmune conditions, or unusual infections?",
			ar: "تاريخ عائلي للحمى، أمراض المناعة الذاتية، أو الالتهابات غير العادية؟",
		}),
	});

	// 18. Social History
	composer.slide({ pageProgress: "18/20" });
	composer.textInput("social_history", {
		question: translate(localization, {
			en: "Smoking, alcohol, or recreational drug use (especially IV)?",
			ar: "التدخين، الكحول، أو استخدام المخدرات الترفيهية (خاصة عن طريق الوريد)؟",
		}),
	});

	// 19. Gynecological (Females)
	composer.slide({ pageProgress: "19/20" });
	composer.textInput("gyne_history", {
		question: translate(localization, {
			en: "LMP? Chance of pregnancy? Vaginal discharge or pelvic pain?",
			ar: "تاريخ آخر دورة؟ احتمالية الحمل؟ إفرازات مهبلية أو ألم في الحوض؟",
		}),
		required: false,
		displayCondition: {
			dependencies: ["gender"],
			condition: "gender == 'Female' or gender == 'أنثى'",
		},
	});

	// --- Review of Systems - Other Potential Clues ---

	// 20. Other Symptoms (Review of Systems)
	composer.slide({ pageProgress: "20/20" });
	composer.textInput("ros_other", {
		question: translate(localization, {
			en: "Any other symptoms (e.g., night sweats, rash, swollen lymph nodes, cough, diarrhea, jaundice)?",
			ar: "أي أعراض أخرى (مثل التعرق الليلي، طفح جلدي، تورم الغدد الليمفاوية، سعال، إسهال، يرقان)؟",
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