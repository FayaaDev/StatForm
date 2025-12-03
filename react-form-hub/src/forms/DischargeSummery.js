import { translate } from "../utils/translate.js";
import { getSharedFormConfig } from "./formUtils.js";

export function createDischargeSummaryFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "discharge-summary-form",
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
			en: "Discharge Summary Form",
			ar: "نموذج ملخص الخروج",
		}),
	);

	composer.p(
		translate(localization, {
			en: "National Guidelines & UHN Standard Template",
			ar: "نموذج المعايير الوطنية و UHN",
		}),
	);

	// 1. Age
	composer.slide({ pageProgress: "1/21" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "ما هو عمرك؟",
		}),
		min: 1,
		max: 120,
		required: true,
	});

	// 2. Gender
	composer.slide({ pageProgress: "2/21" });
	composer.choiceInput("gender", {
		question: translate(localization, {
			en: "What is your gender?",
			ar: "ما هو جنسك؟",
		}),
		choices: [
			translate(localization, { en: "Male", ar: "ذكر" }),
			translate(localization, { en: "Female", ar: "أنثى" }),
		],
		required: true,
	});

	// 3. Patient Details Header
	composer.slide({ pageProgress: "3/27" });
	composer.h2(
		translate(localization, {
			en: "Patient Details",
			ar: "بيانات المريض",
		}),
	);

	// 4. Patient Name
	composer.slide({ pageProgress: "4/27" });
	composer.textInput("patient_name", {
		question: translate(localization, {
			en: "Patient Full Name (Use Fake name and edit later)",
			ar: "اسم المريض الكامل",
		}),
	});

	// 5. MRN
	composer.slide({ pageProgress: "5/27" });
	composer.textInput("mrn", {
		question: translate(localization, {
			en: "MRN / Patient ID",
			ar: "رقم الملف الطبي",
		}),
	});

	// 6. Admission Date
	composer.slide({ pageProgress: "6/27" });
	composer.textInput("admission_date", {
		question: translate(localization, {
			en: "Admission Date",
			ar: "تاريخ الدخول",
		}),
		placeholder: "YYYY-MM-DD"
	});

	// 7. Discharge Date
	composer.slide({ pageProgress: "7/27" });
	composer.textInput("discharge_date", {
		question: translate(localization, {
			en: "Discharge Date",
			ar: "تاريخ الخروج",
		}),
		placeholder: "YYYY-MM-DD"
	});

	// 8. Consultant Name
	composer.slide({ pageProgress: "8/27" });
	composer.textInput("consultant_name", {
		question: translate(localization, {
			en: "Most Responsible Physician / Consultant",
			ar: "الطبيب المسؤول / الاستشاري",
		}),
	});

	// 9. Ward/Unit
	composer.slide({ pageProgress: "9/27" });
	composer.textInput("ward_unit", {
		question: translate(localization, {
			en: "Ward / Clinical Unit",
			ar: "الجناح / الوحدة السريرية",
		}),
	});

	// 10. Diagnoses Header
	composer.slide({ pageProgress: "10/27" });
	composer.h2(
		translate(localization, {
			en: "Diagnoses",
			ar: "التشخيصات",
		}),
	);

	// 11. Principal Diagnosis
	composer.slide({ pageProgress: "11/27" });
	composer.textInput("principal_diagnosis", {
		question: translate(localization, {
			en: "Principal Diagnosis (Most Responsible)",
			ar: "التشخيص الرئيسي (السبب الرئيسي للتنويم)",
		}),
		description: translate(localization, {
			en: "The condition responsible for the greatest portion of the length of stay.",
			ar: "الحالة المسؤولة عن الجزء الأكبر من مدة البقاء في المستشفى.",
		}),
	});

	// 12. Secondary Diagnoses
	composer.slide({ pageProgress: "12/27" });
	composer.textInput("secondary_diagnoses", {
		question: translate(localization, {
			en: "Secondary Diagnoses / Comorbidities",
			ar: "التشخيصات الثانوية / الأمراض المصاحبة",
		}),
		required: false,
	});

	// 13. Clinical Course Header
	composer.slide({ pageProgress: "13/27" });
	composer.h2(
		translate(localization, {
			en: "Clinical Course",
			ar: "المسار السريري",
		}),
	);

	// 14. Presenting Complaint
	composer.slide({ pageProgress: "14/27" });
	composer.textInput("presenting_complaint", {
		question: translate(localization, {
			en: "Reason for Presentation / Chief Complaint",
			ar: "سبب المراجعة / الشكوى الرئيسية",
		}),
	});

	// 15. Clinical Summary
	composer.slide({ pageProgress: "15/27" });
	composer.textInput("clinical_summary", {
		question: translate(localization, {
			en: "Summary of Course in Hospital",
			ar: "ملخص المسار العلاجي في المستشفى",
		}),
		description: translate(localization, {
			en: "Succinct summary of diagnosis, management, and progress.",
			ar: "ملخص موجز للتشخيص، والعلاج، والتقدم.",
		}),
		textarea: true, 
	});

	// 16. Procedures Performed
	composer.slide({ pageProgress: "16/26" });
	composer.choiceInput("procedures_performed", {
		question: translate(localization, {
			en: "Were any procedures/surgeries performed?",
			ar: "هل تم إجراء أي عمليات/إجراءات؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("procedures_list", {
		question: translate(localization, {
			en: "List of Procedures (Date & Name)",
			ar: "قائمة الإجراءات (التاريخ والاسم)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["procedures_performed"],
			condition: "procedures_performed == 'Yes' or procedures_performed == 'نعم'",
		},
	});

	// 17. Investigations
	composer.slide({ pageProgress: "17/26" });
	composer.textInput("investigations_summary", {
		question: translate(localization, {
			en: "Key Investigations / Abnormal Results",
			ar: "أهم الفحوصات / النتائج غير الطبيعية",
		}),
		required: false,
	});

	// 18. Allergies Header
	composer.slide({ pageProgress: "18/26" });
	composer.h2(
		translate(localization, {
			en: "Alerts & Allergies",
			ar: "التنبيهات والحساسية",
		}),
	);

	// 19. Allergies Exist
	composer.slide({ pageProgress: "19/26" });
	composer.choiceInput("allergies_exist", {
		question: translate(localization, {
			en: "Does the patient have allergies?",
			ar: "هل لدى المريض حساسية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "Nil Known", ar: "لا يوجد (غير معروف)" }),
		],
	});

	// 20. Allergy Details
	composer.slide({ pageProgress: "20/26" });
	composer.textInput("allergies_details", {
		question: translate(localization, {
			en: "Allergy Details (Agent & Reaction)",
			ar: "تفاصيل الحساسية (المسبب ورد الفعل)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["allergies_exist"],
			condition: "allergies_exist == 'Yes' or allergies_exist == 'نعم'",
		},
	});

	// 21. Medications Header
	composer.slide({ pageProgress: "21/26" });
	composer.h2(
		translate(localization, {
			en: "Medications on Discharge",
			ar: "أدوية الخروج",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please group medications as per guidelines.",
			ar: "يرجى تصنيف الأدوية حسب الإرشادات.",
		}),
	);

	// 22. New Medications
	composer.slide({ pageProgress: "22/26" });
	composer.textInput("meds_new", {
		question: translate(localization, {
			en: "New Medications (Started this admission)",
			ar: "أدوية جديدة (بدأت خلال هذا التنويم)",
		}),
		placeholder: translate(localization, {
			en: "Name, Dose, Frequency, Duration",
			ar: "الاسم، الجرعة، التكرار، المدة",
		}),
		required: false,
		textarea: true,
	});

	// 23. Changed Medications
	composer.slide({ pageProgress: "23/26" });
	composer.textInput("meds_changed", {
		question: translate(localization, {
			en: "Changed Medications (Dose/Freq modified)",
			ar: "أدوية تم تغييرها (تعديل الجرعة/التكرار)",
		}),
		required: false,
		textarea: true,
	});

	// 24. Unchanged Medications
	composer.slide({ pageProgress: "24/26" });
	composer.textInput("meds_unchanged", {
		question: translate(localization, {
			en: "Unchanged Medications (Continued from home)",
			ar: "أدوية مستمرة (بدون تغيير من المنزل)",
		}),
		required: false,
		textarea: true,
	});

	// 25. Ceased Medications
	composer.slide({ pageProgress: "25/26" });
	composer.textInput("meds_ceased", {
		question: translate(localization, {
			en: "Ceased Medications (Stopped during admission)",
			ar: "أدوية متوقفة (تم إيقافها خلال التنويم)",
		}),
		description: translate(localization, {
			en: "Include reason for cessation.",
			ar: "اذكر سبب الإيقاف.",
		}),
		required: false,
		textarea: true,
	});

	// 26. Discharge Plan
	composer.slide({ pageProgress: "26/29" });
	composer.h2(
		translate(localization, {
			en: "Discharge Plan",
			ar: "خطة الخروج",
		}),
	);

	composer.choiceInput("discharge_destination", {
		question: translate(localization, {
			en: "Discharge Destination",
			ar: "وجهة الخروج",
		}),
		choices: [
			translate(localization, { en: "Home", ar: "المنزل" }),
			translate(localization, { en: "Home with Support Services", ar: "المنزل مع خدمات مساندة" }),
			translate(localization, { en: "Rehabilitation Facility", ar: "مركز تأهيل" }),
			translate(localization, { en: "Nursing Home/LTC", ar: "دار رعاية/رعاية طويلة الأمد" }),
			translate(localization, { en: "Transfer to Other Hospital", ar: "تحويل لمستشفى آخر" }),
			translate(localization, { en: "Deceased", ar: "وفاة" }),
		],
	});

	// 27. Recommendations
	composer.slide({ pageProgress: "27/29" });
	composer.textInput("recommendations", {
		question: translate(localization, {
			en: "Recommendations / Actions Required",
			ar: "التوصيات / الإجراءات المطلوبة",
		}),
		description: translate(localization, {
			en: "Action and Person Responsible (e.g., GP to check BP)",
			ar: "الإجراء والشخص المسؤول (مثلاً: طبيب الأسرة لفحص الضغط)",
		}),
		textarea: true,
	});

	// 28. Follow-up Appointments
	composer.slide({ pageProgress: "28/29" });
	composer.textInput("follow_up_appointments", {
		question: translate(localization, {
			en: "Follow-up Appointments",
			ar: "مواعيد المتابعة",
		}),
		placeholder: translate(localization, {
			en: "Clinic, Date, Time, Location",
			ar: "العيادة، التاريخ، الوقت، الموقع",
		}),
		required: false,
		textarea: true,
	});

	// 29. Generate Summary
	composer.slide({ pageProgress: "29/29" });
	composer.h2(
		translate(localization, {
			en: "Generate Summary",
			ar: "إنشاء الملخص",
		}),
	);

	const buttonLabel = translate(localization, {
		en: "Generate Discharge Summary",
		ar: "توليد ملخص الخروج",
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