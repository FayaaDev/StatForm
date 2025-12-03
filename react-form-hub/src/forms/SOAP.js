import { translate } from "../utils/translate.js";
import { getSharedFormConfig } from "./formUtils.js";

/**
 * Creates a SOAP Note Form based on NCBI/StatPearls guidelines.
 * Reference: https://www.ncbi.nlm.nih.gov/books/NBK482263/
 */
export function createSOAPNoteFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "soap-note-form",
		...getSharedFormConfig(localization, theme),
		postUrl: null,
		restartButton: "hide",
		pageProgress: "hide",
		thankYouScreenTitle: "",
		thankYouScreenDescription: "",
		paddingInlineTop: 120,
	});

	// Header
	composer.h1(
		translate(localization, {
			en: "SOAP Note Form",
			ar: "نموذج ملاحظات SOAP",
		}),
	);

	composer.p(
		translate(localization, {
			en: "Subjective, Objective, Assessment, Plan.",
			ar: "SOAP",
		}),
	);

	// 1. Patient Details (Context for HPI)
	composer.slide({ pageProgress: "1/15" });
	composer.h2(
		translate(localization, {
			en: "Patient Details",
			ar: "بيانات المريض",
		}),
	);
	
	composer.textInput("patient_name", {
		question: translate(localization, {
			en: "Patient Full Name (Use Fake name and edit later)",
			ar: "اسم المريض الكامل",
		}),
	});

	composer.textInput("mrn", {
		question: translate(localization, {
			en: "MRN / Patient ID",
			ar: "رقم الملف الطبي",
		}),
	});

	// 2. Demographics
	composer.slide({ pageProgress: "2/15" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "Age",
			ar: "العمر",
		}),
		min: 0,
		max: 120
	});

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

	// ==========================================
	// SUBJECTIVE (S)
	// ==========================================
	
	// 3. Chief Complaint (CC)
	composer.slide({ pageProgress: "3/15" });
	composer.h2(
		translate(localization, {
			en: "Subjective (S)",
			ar: "شخصي (S)",
		}),
	);

	composer.textInput("chief_complaint", {
		question: translate(localization, {
			en: "Chief Complaint (CC)",
			ar: "الشكوى الرئيسية",
		}),
		description: translate(localization, {
			en: "The presenting problem reported by the patient (e.g., 'chest pain').",
			ar: "المشكلة الحالية كما يرويها المريض (مثلاً: 'ألم في الصدر').",
		}),
	});

	// 4. History of Present Illness (HPI)
	composer.slide({ pageProgress: "4/15" });
	composer.textInput("hpi", {
		question: translate(localization, {
			en: "History of Present Illness (HPI)",
			ar: "تاريخ المرض الحالي",
		}),
		description: translate(localization, {
			en: "Elaborate on CC using OLDCARTS (Onset, Location, Duration, Characterization, Aggravating, Radiation, Time, Severity).",
			ar: "تفاصيل الشكوى باستخدام OLDCARTS (البداية، الموقع، المدة، الوصف، العوامل المحفزة، الانتشار، الوقت، الشدة).",
		}),
		textarea: true,
	});

	// 5. History (Medical, Surgical, Family, Social)
	composer.slide({ pageProgress: "5/15" });
	composer.textInput("medical_history", {
		question: translate(localization, {
			en: "Medical & Surgical History",
			ar: "التاريخ الطبي والجراحي",
		}),
		description: translate(localization, {
			en: "Pertinent past conditions and surgeries (include year/surgeon if possible).",
			ar: "الحالات السابقة والعمليات الجراحية ذات الصلة (ذكر السنة/الجراح إن أمكن).",
		}),
		textarea: true,
	});

	composer.textInput("social_family_history", {
		question: translate(localization, {
			en: "Social & Family History",
			ar: "التاريخ الاجتماعي والعائلي",
		}),
		description: translate(localization, {
			en: "Family history and Social factors (HEADSS: Home, Education, Activities, Drugs, Sexuality, Suicide).",
			ar: "التاريخ العائلي والعوامل الاجتماعية (HEADSS: المنزل، التعليم، الأنشطة، المخدرات، الجنس، الاكتئاب).",
		}),
		required: false,
		textarea: true,
	});

	// 6. Review of Systems (ROS)
	composer.slide({ pageProgress: "6/15" });
	composer.textInput("ros", {
		question: translate(localization, {
			en: "Review of Systems (ROS)",
			ar: "مراجعة الأنظمة",
		}),
		description: translate(localization, {
			en: "System based list of questions to uncover symptoms not mentioned in HPI.",
			ar: "قائمة أسئلة حسب أجهزة الجسم للكشف عن أعراض لم تُذكر في تاريخ المرض الحالي.",
		}),
		required: false,
		textarea: true,
	});

	// 7. Medications & Allergies
	composer.slide({ pageProgress: "7/15" });
	composer.textInput("medications_allergies", {
		question: translate(localization, {
			en: "Current Medications & Allergies",
			ar: "الأدوية الحالية والحساسية",
		}),
		description: translate(localization, {
			en: "List name, dose, route, frequency. Include reaction for allergies.",
			ar: "اذكر الاسم، الجرعة، الطريقة، التكرار. اذكر رد الفعل التحسسي إن وجد.",
		}),
		textarea: true,
	});

	// ==========================================
	// OBJECTIVE (O)
	// ==========================================

	// 8. Vital Signs
	composer.slide({ pageProgress: "8/15" });
	composer.h2(
		translate(localization, {
			en: "Objective (O)",
			ar: "موضوعي (O)",
		}),
	);

	composer.textInput("vital_signs", {
		question: translate(localization, {
			en: "Vital Signs",
			ar: "العلامات الحيوية",
		}),
		placeholder: translate(localization, {
			en: "BP, HR, RR, Temp, O2 Sat, Weight",
			ar: "الضغط، النبض، التنفس، الحرارة، الأكسجين، الوزن",
		}),
		textarea: true,
	});

	// 9. Physical Exam
	composer.slide({ pageProgress: "9/15" });
	composer.textInput("physical_exam", {
		question: translate(localization, {
			en: "Physical Exam Findings",
			ar: "نتائج الفحص السريري",
		}),
		description: translate(localization, {
			en: "Document objective signs (e.g., 'tenderness') distinct from symptoms.",
			ar: "توثيق العلامات الموضوعية (مثل 'الإيلام عند اللمس') بشكل منفصل عن الأعراض.",
		}),
		textarea: true,
	});

	// 10. Diagnostic Data
	composer.slide({ pageProgress: "10/15" });
	composer.textInput("diagnostic_data", {
		question: translate(localization, {
			en: "Diagnostic Data",
			ar: "البيانات التشخيصية",
		}),
		description: translate(localization, {
			en: "Labs, Imaging results, and other diagnostic tests.",
			ar: "المختبر، نتائج الأشعة، والفحوصات التشخيصية الأخرى.",
		}),
		required: false,
		textarea: true,
	});

	// ==========================================
	// ASSESSMENT (A)
	// ==========================================

	// 11. Problem List
	composer.slide({ pageProgress: "11/15" });
	composer.h2(
		translate(localization, {
			en: "Assessment (A)",
			ar: "التقييم (A)",
		}),
	);

	composer.textInput("problem_list", {
		question: translate(localization, {
			en: "Problem List / Diagnosis",
			ar: "قائمة المشاكل / التشخيص",
		}),
		description: translate(localization, {
			en: "Synthesis of S & O. List problems in order of importance.",
			ar: "توليفة من المعلومات الشخصية والموضوعية. اذكر المشاكل حسب الأهمية.",
		}),
		textarea: true,
	});

	// 12. Differential Diagnosis
	composer.slide({ pageProgress: "12/15" });
	composer.textInput("differential_diagnosis", {
		question: translate(localization, {
			en: "Differential Diagnosis & Reasoning",
			ar: "التشخيص التفريقي والتعليل",
		}),
		description: translate(localization, {
			en: "List possible diagnoses (most to least likely) and thought process.",
			ar: "قائمة التشخيصات المحتملة (من الأكثر إلى الأقل احتمالاً) وعملية التفكير.",
		}),
		required: false,
		textarea: true,
	});

	// ==========================================
	// PLAN (P)
	// ==========================================

	// 13. Plan Details
	composer.slide({ pageProgress: "13/15" });
	composer.h2(
		translate(localization, {
			en: "Plan (P)",
			ar: "الخطة (P)",
		}),
	);

	composer.textInput("treatment_plan", {
		question: translate(localization, {
			en: "Treatment Plan",
			ar: "خطة العلاج",
		}),
		description: translate(localization, {
			en: "Testing needed, Therapy (meds), Specialist referrals.",
			ar: "الفحوصات المطلوبة، العلاج (الأدوية)، تحويلات المتخصصين.",
		}),
		textarea: true,
	});

	// 14. Education & Follow-up
	composer.slide({ pageProgress: "14/15" });
	composer.textInput("education_followup", {
		question: translate(localization, {
			en: "Patient Education & Follow-up",
			ar: "تثقيف المريض والمتابعة",
		}),
		placeholder: translate(localization, {
			en: "Counseling provided, next appointment, etc.",
			ar: "التوجيهات المقدمة، الموعد القادم، إلخ.",
		}),
		textarea: true,
	});

	// 15. Generate
	composer.slide({ pageProgress: "15/15" });
	composer.h2(
		translate(localization, {
			en: "Generate SOAP Note",
			ar: "إنشاء ملاحظة SOAP",
		}),
	);

	const buttonLabel = translate(localization, {
		en: "Generate SOAP Note",
		ar: "توليد ملاحظة SOAP",
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