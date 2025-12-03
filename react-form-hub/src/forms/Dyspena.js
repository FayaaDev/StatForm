import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createDyspneaFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "dyspnea-history-form",
		...getSharedFormConfig(localization, theme),
		postUrl: null, // No submission for this template generator
		restartButton: "hide",
		pageProgress: "hide",
		thankYouScreenTitle: "",
		thankYouScreenDescription: "",
		paddingInlineTop: 120,
	});

	// Header ----------------------------------------------------
	composer.h1(
		translate(localization, {
			en: "Dyspnea History Form",
			ar: "نموذج تاريخ ضيق التنفس",
		}),
	);

	composer.p(
		translate(localization, {
			en: "Shortness of Breath",
			ar: "نموذج منظم لأخذ التاريخ المرضي لشكوى ضيق التنفس.",
		}),
	);

	// 1. Age ----------------------------------------------------
	composer.slide({ pageProgress: "1/27" });
	composer.numberInput("age", {
		question: translate(localization, {
			en: "What is your age?",
			ar: "كم عمرك؟",
		}),
		min: 1,
		max: 120,
	});

	// 2. Gender -------------------------------------------------
	composer.slide({ pageProgress: "2/27" });
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

	// 3. Main complaint description -----------------------------
	composer.slide({ pageProgress: "3/27" });
	composer.textInput("dyspnea_description", {
		question: translate(localization, {
			en: "Describe your shortness of breath in your own words.",
			ar: "صف ضيق التنفس لديك بكلماتك.",
		}),
	});

	// 4. Duration - free text -----------------------------------
	composer.slide({ pageProgress: "4/27" });
	composer.textInput("dyspnea_duration", {
		question: translate(localization, {
			en: "How long have you been experiencing shortness of breath?",
			ar: "منذ متى تعاني من ضيق التنفس؟",
		}),
	});

	// 5. Acute vs chronic (per StatPearls definition) ----------
	composer.slide({ pageProgress: "5/27" });
	composer.choiceInput("dyspnea_time_course", {
		question: translate(localization, {
			en: "Is your dyspnea acute or chronic?",
			ar: "هل ضيق التنفس لديك حاد أم مزمن؟",
		}),
		choices: [
			translate(localization, {
				en: "Acute (developed over hours to days)",
				ar: "حاد (تطور خلال ساعات إلى أيام)",
			}),
			translate(localization, {
				en: "Chronic (present for more than 4–8 weeks)",
				ar: "مزمن (موجود منذ أكثر من 4–8 أسابيع)",
			}),
			translate(localization, {
				en: "Unsure / fluctuating",
				ar: "غير متأكد / متقلب",
			}),
		],
	});

	composer.textInput("dyspnea_time_course_details", {
		question: translate(localization, {
			en: "Any additional details?",
			ar: "أي تفاصيل إضافية؟",
		}),
		required: false,
	});

	// 6. Symptom progression ------------------------------------
	composer.slide({ pageProgress: "6/27" });
	composer.choiceInput("dyspnea_progression", {
		question: translate(localization, {
			en: "Is your shortness of breath getting worse, better, or staying the same?",
			ar: "هل ضيق التنفس يزداد، يتحسن، أم يبقى كما هو؟",
		}),
		choices: [
			translate(localization, { en: "Worsening", ar: "يَزداد سوءًا" }),
			translate(localization, { en: "Improving", ar: "يتحسن" }),
			translate(localization, { en: "Unchanged", ar: "بدون تغيير" }),
			translate(localization, { en: "Intermittent", ar: "متقطع" }),
		],
	});

	composer.textInput("dyspnea_progression_details", {
		question: translate(localization, {
			en: "Details (when did it change, any pattern?)",
			ar: "التفاصيل (متى تغيرت الشدة؟ أي نمط معين؟)",
		}),
		required: false,
	});

	// 7. Triggers / relieving factors ---------------------------
	composer.slide({ pageProgress: "7/27" });
	composer.textInput("dyspnea_triggers", {
		question: translate(localization, {
			en: "What makes your shortness of breath worse or better?",
			ar: "ما الذي يزيد أو يخفف ضيق التنفس لديك؟",
		}),
	});

	// 8. Respiratory causes checklist (from etiology) ----------
	composer.slide({ pageProgress: "8/27" });
	composer.h2(
		translate(localization, {
			en: "Possible Respiratory Causes",
			ar: "أسباب تنفسية محتملة",
		}),
	);

	composer.choiceInput("respiratory_causes", {
		question: translate(localization, {
			en: "Have you ever been told you have any of the following respiratory conditions?",
			ar: "هل قيل لك من قبل أنك تعاني من أي من الحالات التنفسية التالية؟",
		}),
		choices: [
			translate(localization, { en: "Asthma", ar: "ربو" }),
			translate(localization, {
				en: "Chronic Obstructive Pulmonary Disease (COPD) / Exacerbation",
				ar: "مرض الانسداد الرئوي المزمن (COPD) / تفاقم",
			}),
			translate(localization, { en: "Pneumonia", ar: "التهاب رئوي" }),
			translate(localization, { en: "Pulmonary embolism", ar: "انسداد رئوي" }),
			translate(localization, { en: "Lung malignancy (lung cancer)", ar: "ورم رئوي / سرطان رئة" }),
			translate(localization, { en: "Pneumothorax", ar: "استرواح صدري" }),
			translate(localization, { en: "Aspiration", ar: "شفط / استنشاق محتويات إلى الرئة" }),
			translate(localization, { en: "None of these / not diagnosed", ar: "لا شيء مما سبق / لم أُشخّص" }),
		],
		multiple: true,
	});

	composer.textInput("respiratory_causes_details", {
		question: translate(localization, {
			en: "Please provide more details about these conditions:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه الحالات:",
		}),
		required: false,
	});

	// 9. Cardiac causes checklist ------------------------------
	composer.slide({ pageProgress: "9/27" });
	composer.h2(
		translate(localization, {
			en: "Possible Cardiac Causes",
			ar: "أسباب قلبية محتملة",
		}),
	);

	composer.choiceInput("cardiac_causes", {
		question: translate(localization, {
			en: "Have you ever been told you have any of the following heart conditions?",
			ar: "هل قيل لك من قبل أنك تعاني من أي من أمراض القلب التالية؟",
		}),
		choices: [
			translate(localization, { en: "Congestive heart failure", ar: "فشل قلبي احتقاني" }),
			translate(localization, { en: "Pulmonary edema", ar: "وذمة رئوية" }),
			translate(localization, { en: "Acute coronary syndrome", ar: "متلازمة الشريان التاجي الحادة" }),
			translate(localization, { en: "Pericardial tamponade", ar: "اندحاس قلبي (انصباب تامبونادي)" }),
			translate(localization, { en: "Valvular heart defect", ar: "خلل في صمامات القلب" }),
			translate(localization, { en: "Pulmonary hypertension", ar: "ارتفاع ضغط الشريان الرئوي" }),
			translate(localization, { en: "Cardiac arrhythmia", ar: "اضطراب في نظم القلب" }),
			translate(localization, { en: "Intracardiac shunting", ar: "تحويلة داخل القلب" }),
			translate(localization, { en: "None of these / not diagnosed", ar: "لا شيء مما سبق / لم أُشخّص" }),
		],
		multiple: true,
	});

	composer.textInput("cardiac_causes_details", {
		question: translate(localization, {
			en: "Please provide more details about these conditions:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه الحالات:",
		}),
		required: false,
	});

	// 10. Neuromuscular / structural causes --------------------
	composer.slide({ pageProgress: "10/27" });
	composer.h2(
		translate(localization, {
			en: "Possible Neuromuscular / Structural Causes",
			ar: "أسباب عصبية عضلية / هيكلية محتملة",
		}),
	);

	composer.choiceInput("neuromuscular_causes", {
		question: translate(localization, {
			en: "Have you had any of the following?",
			ar: "هل عانيت من أي مما يلي؟",
		}),
		choices: [
			translate(localization, {
				en: "Chest trauma with fracture or flail chest",
				ar: "إصابة صدرية مع كسر أو صدر متأرجح",
			}),
			translate(localization, { en: "Marked / massive obesity", ar: "سمنة شديدة / مفرطة" }),
			translate(localization, { en: "Kyphoscoliosis", ar: "حداب جنف (تشوه العمود الفقري)" }),
			translate(localization, { en: "CNS or spinal cord dysfunction", ar: "خلل في الجهاز العصبي المركزي أو الحبل الشوكي" }),
			translate(localization, { en: "Phrenic nerve paralysis", ar: "شلل العصب الحجابي" }),
			translate(localization, { en: "Myopathy", ar: "اعتلال عضلي" }),
			translate(localization, { en: "Neuropathy", ar: "اعتلال عصبي" }),
			translate(localization, { en: "None of these", ar: "لا شيء مما سبق" }),
		],
		multiple: true,
	});

	composer.textInput("neuromuscular_causes_details", {
		question: translate(localization, {
			en: "Please provide more details about these conditions:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه الحالات:",
		}),
		required: false,
	});

	// 11. Psychogenic causes -----------------------------------
	composer.slide({ pageProgress: "11/27" });
	composer.h2(
		translate(localization, {
			en: "Possible Psychogenic Causes",
			ar: "أسباب نفسية محتملة",
		}),
	);

	composer.choiceInput("psychogenic_causes", {
		question: translate(localization, {
			en: "Have you ever been diagnosed with any of the following?",
			ar: "هل شُخّصت بأي مما يلي؟",
		}),
		choices: [
			translate(localization, { en: "Hyperventilation syndrome", ar: "متلازمة فرط التهوية" }),
			translate(localization, { en: "Psychogenic dyspnea", ar: "ضيق تنفس نفسي المنشأ" }),
			translate(localization, { en: "Vocal cord dysfunction syndrome", ar: "خلل في عمل الحبال الصوتية" }),
			translate(localization, { en: "History of foreign body aspiration", ar: "اشتباه أو تاريخ شفط جسم غريب" }),
			translate(localization, { en: "None of these", ar: "لا شيء مما سبق" }),
		],
		multiple: true,
	});

	composer.textInput("psychogenic_causes_details", {
		question: translate(localization, {
			en: "Please provide more details about these conditions:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه الحالات:",
		}),
		required: false,
	});

	// 12. Systemic illnesses list ------------------------------
	composer.slide({ pageProgress: "12/27" });
	composer.h2(
		translate(localization, {
			en: "Possible Systemic Causes",
			ar: "أسباب جهازية محتملة",
		}),
	);

	composer.choiceInput("systemic_causes", {
		question: translate(localization, {
			en: "Have you ever been told you have any of the following systemic conditions?",
			ar: "هل قيل لك من قبل أنك تعاني من أي من الحالات الجهازية التالية؟",
		}),
		choices: [
			translate(localization, { en: "Anemia", ar: "فقر دم" }),
			translate(localization, { en: "Acute renal failure", ar: "فشل كلوي حاد" }),
			translate(localization, { en: "Metabolic acidosis", ar: "حماض استقلابي" }),
			translate(localization, { en: "Thyrotoxicosis", ar: "فرط نشاط الغدة الدرقية (التسمم الدرقي)" }),
			translate(localization, { en: "Cirrhosis of the liver", ar: "تشمع الكبد" }),
			translate(localization, { en: "Anaphylaxis", ar: "تأق (صدمة تحسسية)" }),
			translate(localization, { en: "Sepsis", ar: "إنتان / تعفن الدم" }),
			translate(localization, { en: "Angioedema", ar: "وذمة وعائية" }),
			translate(localization, { en: "Epiglottitis", ar: "التهاب لسان المزمار" }),
			translate(localization, { en: "None of these", ar: "لا شيء مما سبق" }),
		],
		multiple: true,
	});

	composer.textInput("systemic_causes_details", {
		question: translate(localization, {
			en: "Please provide more details about these conditions:",
			ar: "يرجى تقديم المزيد من التفاصيل حول هذه الحالات:",
		}),
		required: false,
	});

	// 13. Cough / sputum ---------------------------------------
	composer.slide({ pageProgress: "13/27" });
	composer.choiceInput("cough", {
		question: translate(localization, {
			en: "Do you have a cough?",
			ar: "هل تعاني من سعال؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("cough_details", {
		question: translate(localization, {
			en: "Details (dry or productive, blood, time of day, etc.)",
			ar: "التفاصيل (جاف أو ببلغم، وجود دم، وقت حدوثه، إلخ)",
		}),
		required: false,
	});

	// 14. Chest pain -------------------------------------------
	composer.slide({ pageProgress: "14/27" });
	composer.choiceInput("chest_pain", {
		question: translate(localization, {
			en: "Do you have chest pain with your shortness of breath?",
			ar: "هل تشعر بألم في الصدر مع ضيق التنفس؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("chest_pain_details", {
		question: translate(localization, {
			en: "Describe the chest pain (location, nature, relation to breathing or exertion).",
			ar: "صف ألم الصدر (المكان، طبيعة الألم، علاقته بالتنفس أو الجهد).",
		}),
		required: false,
	});

	// 15. Orthopnea / positional component (generic but useful)-
	composer.slide({ pageProgress: "15/27" });
	composer.choiceInput("orthopnea", {
		question: translate(localization, {
			en: "Does your shortness of breath worsen when lying flat?",
			ar: "هل يزداد ضيق التنفس عند الاستلقاء بشكل مسطح؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
			translate(localization, { en: "Not sure", ar: "لست متأكدًا" }),
		],
	});

	composer.textInput("orthopnea_details", {
		question: translate(localization, {
			en: "Any additional details?",
			ar: "أي تفاصيل إضافية؟",
		}),
		required: false,
	});

	// 16. Night symptoms ---------------------------------------
	composer.slide({ pageProgress: "16/27" });
	composer.choiceInput("night_symptoms", {
		question: translate(localization, {
			en: "Do you wake up at night because of shortness of breath?",
			ar: "هل تستيقظ ليلًا بسبب ضيق التنفس؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	composer.textInput("night_symptoms_details", {
		question: translate(localization, {
			en: "Any additional details?",
			ar: "أي تفاصيل إضافية؟",
		}),
		required: false,
	});

	// 17. Systemic symptoms ------------------------------------
	composer.slide({ pageProgress: "17/27" });
	composer.textInput("systemic_symptoms", {
		question: translate(localization, {
			en: "Any fever, chills, night sweats, or unintentional weight loss?",
			ar: "هل لديك حمى، قشعريرة، تعرق ليلي، أو فقدان وزن غير مقصود؟",
		}),
	});

	// 18. Past medical history ---------------------------------
	composer.slide({ pageProgress: "18/27" });
	composer.textInput("pmh_general", {
		question: translate(localization, {
			en: "Other important medical conditions not already mentioned?",
			ar: "هل توجد أمراض أو حالات طبية أخرى لم تُذكر أعلاه؟",
		}),
	});

	// 19. Medications & inhalers -------------------------------
	composer.slide({ pageProgress: "19/27" });
	composer.textInput("medications", {
		question: translate(localization, {
			en: "List your current medications (including inhalers, heart or thyroid medicines).",
			ar: "اذكر أدويتك الحالية (بما في ذلك البخاخات، أدوية القلب أو الغدة الدرقية).",
		}),
	});

	// 20. Allergies --------------------------------------------
	composer.slide({ pageProgress: "20/27" });
	composer.textInput("allergies", {
		question: translate(localization, {
			en: "Any drug or food allergies, or history of anaphylaxis/angioedema?",
			ar: "هل لديك حساسية لأدوية أو أطعمة، أو تاريخ لصدمة تحسسية (تأق) أو وذمة وعائية؟",
		}),
	});

	// 21. Smoking history --------------------------------------
	composer.slide({ pageProgress: "21/27" });
	composer.choiceInput("smoking_status", {
		question: translate(localization, {
			en: "Do you smoke or have you smoked in the past?",
			ar: "هل تدخن حاليًا أو كنت تدخن في الماضي؟",
		}),
		choices: [
			translate(localization, { en: "Never smoked", ar: "لم أدخن أبدًا" }),
			translate(localization, { en: "Current smoker", ar: "مدخن حاليًا" }),
			translate(localization, { en: "Ex-smoker", ar: "مدخن سابقًا" }),
		],
	});

	composer.textInput("smoking_details", {
		question: translate(localization, {
			en: "If you smoke or smoked: how much and for how long?",
			ar: "إذا كنت تدخن أو كنت تدخن: ما الكمية ومدة التدخين؟",
		}),
		required: false,
	});

	// 22. Occupational / environmental exposure ----------------
	composer.slide({ pageProgress: "22/27" });
	composer.textInput("occupation", {
		question: translate(localization, {
			en: "What is your occupation? Any exposure to dust, chemicals, fumes, or smoke?",
			ar: "ما مهنتك؟ وهل تتعرض لغبار أو مواد كيميائية أو أبخرة أو دخان؟",
		}),
	});

	// 23. Social history ---------------------------------------
	composer.slide({ pageProgress: "23/27" });
	composer.textInput("social_history", {
		question: translate(localization, {
			en: "Anything in your living situation or lifestyle that might affect your breathing?",
			ar: "هل هناك ما في نمط حياتك أو سكنك قد يؤثر على التنفس؟",
		}),
	});

	// 24. Gynecologic (Females) -------------------------------
	composer.slide({ pageProgress: "24/27" });
	composer.textInput("gyne_history", {
		question: translate(localization, {
			en: "For females: last menstrual period, pregnancy possibility, or other gynecological issues?",
			ar: "للإناث: آخر دورة شهرية، احتمال الحمل، أو أي مشكلات نسائية أخرى؟",
		}),
		required: false,
		displayCondition: {
			dependencies: ["gender"],
			condition: "gender == 'Female' or gender == 'أنثى'",
		},
	});

	// 25. Other symptoms ---------------------------------------
	composer.slide({ pageProgress: "25/27" });
	composer.textInput("other_symptoms", {
		question: translate(localization, {
			en: "Any other symptoms you feel are important to mention?",
			ar: "هل توجد أي أعراض أخرى تشعر أنها مهمة؟",
		}),
	});

	// 26. Review of Systems label ------------------------------
	composer.slide({ pageProgress: "26/27" });
	composer.h2(
		translate(localization, {
			en: "Summary and Review",
			ar: "الملخص ومراجعة الأعراض",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Review your answers before generating the patient story.",
			ar: "راجع إجاباتك قبل توليد قصة المريض.",
		}),
	);

	// 27. Patient Story + buttons ------------------------------
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="fmd-icon fmd-ms-2 fmd-hide-ltr" aria-hidden="true" focusable="false"><path d="M47 239c-9.4 9.4-9.4 24.6 0 33.9L207 433c9.4 9.4 24.6 9.4 33.9 0s-9.4-24.6 0-33.9L97.9 256 241 113c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L47 239z"/></svg>
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