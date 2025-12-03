import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createDepressionHistoryFormComposer(localization = "en", theme) {
  if (!window.Composer) {
    console.error("Composer not loaded yet");
    return null;
  }

  const composer = new window.Composer({
    id: "depression-history-form",
    ...getSharedFormConfig(localization, theme),
    postUrl: null,
    restartButton: "hide",
    pageProgress: "hide",
    thankYouScreenTitle: "",
    thankYouScreenDescription: "",
    paddingInlineTop: 120,
  });

  // Header
  // Source: Title "Depression"
  composer.h1(
    translate(localization, {
      en: "Depression History Form",
      ar: "نموذج تاريخ الاكتئاب",
    })
  );
  composer.p(
    translate(localization, {
      en: "Persistent feelings of sadness and loss of interest.",
      ar: "تقييم المشاعر المستمرة بالحزن، فقدان الاهتمام، والأعراض المصاحبة.",
    })
  );

  // 1. Age
  composer.slide({ pageProgress: "1/20" });
  composer.numberInput("age", {
    question: translate(localization, { en: "Age", ar: "العمر" }),
    min: 0,
    max: 120,
  });

  // 2. Gender / Sex
  composer.slide({ pageProgress: "2/20" });
  composer.choiceInput("sex", {
    question: translate(localization, { en: "Sex / Gender", ar: "الجنس / النوع" }),
    choices: [
      translate(localization, { en: "Female", ar: "أنثى" }),
      translate(localization, { en: "Male", ar: "ذكر" }),
      translate(localization, { en: "Other / prefer not to say", ar: "آخر / أفضل عدم التصريح" }),
    ],
  });

  // 3. Chief Complaint & Duration
  // Source: "History and Physical... investigation into depressive symptoms"
  composer.slide({ pageProgress: "3/20" });
  composer.textInput("duration", {
    question: translate(localization, {
      en: "How long have you been experiencing low mood or other symptoms?",
      ar: "منذ متى وأنت تعاني من انخفاض المزاج أو الأعراض الأخرى؟",
    }),
  });

  // 4. Core Mood Symptoms
  // Source: "Sadness, emptiness, or irritable mood"
  composer.slide({ pageProgress: "4/20" });
  composer.choiceInput("mood_description", {
    question: translate(localization, {
      en: "How would you describe your current mood?",
      ar: "كيف تصف مزاجك الحالي؟",
    }),
    choices: [
      translate(localization, { en: "Sadness", ar: "حزن" }),
      translate(localization, { en: "Emptiness", ar: "فراغ" }),
      translate(localization, { en: "Irritable", ar: "سريع الانفعال / غضب" }),
      translate(localization, { en: "No change", ar: "لا تغيير" }),
    ],
    multiple: true,
  });

  // 5. Interest (Anhedonia)
  // Source: "Interest/pleasure reduction"
  composer.slide({ pageProgress: "5/20" });
  composer.choiceInput("anhedonia", {
    question: translate(localization, {
      en: "Have you experienced a loss of interest or pleasure in activities you used to enjoy?",
      ar: "هل فقدت الاهتمام أو المتعة في الأنشطة التي كنت تستمتع بها؟",
    }),
    choices: [
      translate(localization, { en: "Yes", ar: "نعم" }),
      translate(localization, { en: "No", ar: "لا" }),
    ],
  });

  // 6. Sleep Disturbance
  // Source: "Sleep disturbance... changes in sleeping patterns"
  composer.slide({ pageProgress: "6/20" });
  composer.textInput("sleep_changes", {
    question: translate(localization, {
      en: "Describe any changes in your sleeping patterns (insomnia, oversleeping, etc.)",
      ar: "صف أي تغييرات في أنماط نومك (أرق، كثرة النوم، إلخ)",
    }),
  });

  // 7. Energy Levels
  // Source: "Energy changes/fatigue"
  composer.slide({ pageProgress: "7/20" });
  composer.choiceInput("energy_levels", {
    question: translate(localization, {
      en: "How are your energy levels?",
      ar: "كيف هي مستويات طاقتك؟",
    }),
    choices: [
      translate(localization, { en: "Normal", ar: "طبيعية" }),
      translate(localization, { en: "Fatigue / Low energy", ar: "تعب / طاقة منخفضة" }),
      translate(localization, { en: "Restless / High energy", ar: "قلق / طاقة عالية" }),
    ],
  });

  // 8. Appetite & Weight
  // Source: "Appetite/weight changes"
  composer.slide({ pageProgress: "8/20" });
  composer.textInput("appetite_weight", {
    question: translate(localization, {
      en: "Have you noticed changes in appetite or unexplained weight loss/gain?",
      ar: "هل لاحظت تغيرات في الشهية أو زيادة/نقصان في الوزن غير مبرر؟",
    }),
  });

  // 9. Concentration
  // Source: "Concentration/attention impairment"
  composer.slide({ pageProgress: "9/20" });
  composer.choiceInput("concentration", {
    question: translate(localization, {
      en: "Do you have difficulty concentrating or making decisions?",
      ar: "هل تجد صعوبة في التركيز أو اتخاذ القرارات؟",
    }),
    choices: [
      translate(localization, { en: "Yes", ar: "نعم" }),
      translate(localization, { en: "No", ar: "لا" }),
    ],
  });

  // 10. Psychomotor Changes
  // Source: "Psychomotor disturbances"
  composer.slide({ pageProgress: "10/20" });
  composer.textInput("psychomotor", {
    question: translate(localization, {
      en: "Do you feel physically slowed down, or conversely, agitated/unable to sit still?",
      ar: "هل تشعر ببطء في حركتك الجسدية، أو العكس، تشعر بالهيجان وعدم القدرة على الجلوس؟",
    }),
  });

  // 11. Guilt & Worthlessness
  // Source: "Guilt feelings or thoughts of worthlessness"
  composer.slide({ pageProgress: "11/20" });
  composer.choiceInput("guilt_worthlessness", {
    question: translate(localization, {
      en: "Do you struggle with feelings of excessive guilt or worthlessness?",
      ar: "هل تعاني من مشاعر مفرطة بالذنب أو انعدام القيمة؟",
    }),
    choices: [
      translate(localization, { en: "Yes", ar: "نعم" }),
      translate(localization, { en: "No", ar: "لا" }),
    ],
  });

  // 12. Suicidality
  // Source: "Suicidal thoughts"
  composer.slide({ pageProgress: "12/20" });
  composer.choiceInput("suicidal_thoughts", {
    question: translate(localization, {
      en: "Do you have recurrent thoughts of death or suicide?",
      ar: "هل تراودك أفكار متكررة حول الموت أو الانتحار؟",
    }),
    choices: [
      translate(localization, { en: "Yes", ar: "نعم" }),
      translate(localization, { en: "No", ar: "لا" }),
    ],
  });

  // 13. Functional Impairment
  // Source: "significantly affect the individual's capacity to function"
  composer.slide({ pageProgress: "13/20" });
  composer.textInput("functionality", {
    question: translate(localization, {
      en: "How do these symptoms affect your daily function (work, relationships, self-care)?",
      ar: "كيف تؤثر هذه الأعراض على وظائفك اليومية (العمل، العلاقات، العناية بالنفس)؟",
    }),
  });

  // 14. Stressors & Triggers
  // Source: "Life events... death or loss of a loved one... financial problems... conflicts"
  composer.slide({ pageProgress: "14/20" });
  composer.textInput("stressors", {
    question: translate(localization, {
      en: "Have there been recent stressors (e.g., loss of loved one, financial problems, relationship conflicts)?",
      ar: "هل مررت بضغوطات مؤخراً (مثلاً: فقدان عزيز، مشاكل مالية، خلافات في العلاقات)؟",
    }),
  });

  // 15. Social History & Substance Use
  // Source: "Social history with a focus on stressors and the use of drugs and alcohol"
  composer.slide({ pageProgress: "15/20" });
  composer.textInput("substance_use", {
    question: translate(localization, {
      en: "Do you use alcohol or drugs? If so, please describe frequency.",
      ar: "هل تتعاطى الكحول أو المخدرات؟ إذا كان نعم، يرجى وصف التكرار.",
    }),
  });

  // 16. Past Psychiatric History
  // Source: "History... Past medical history... History of a good response to ECT"
  composer.slide({ pageProgress: "16/20" });
  composer.textInput("past_psych_history", {
    question: translate(localization, {
      en: "Do you have a history of previous depressive episodes or other mental health conditions?",
      ar: "هل لديك تاريخ لنوبات اكتئاب سابقة أو حالات صحية نفسية أخرى؟",
    }),
  });

  // 17. Family History
  // Source: "family medical history"
  composer.slide({ pageProgress: "17/20" });
  composer.textInput("family_history", {
    question: translate(localization, {
      en: "Is there a family history of depression or other psychiatric disorders?",
      ar: "هل يوجد تاريخ عائلي للاكتئاب أو اضطرابات نفسية أخرى؟",
    }),
  });

  // 18. Medical Comorbidities
  // Source: "Neurodegenerative diseases... stroke, seizure disorders, cancer... chronic pain... thyroid"
  composer.slide({ pageProgress: "18/20" });
  composer.textInput("medical_comorbidities", {
    question: translate(localization, {
      en: "Do you have any medical conditions (e.g., chronic pain, thyroid issues, stroke, cancer, seizures)?",
      ar: "هل لديك أي حالات طبية (مثل: ألم مزمن، مشاكل الغدة الدرقية، جلطة، سرطان، نوبات صرع)؟",
    }),
  });

  // 19. Current Medications
  // Source: "current medications"
  composer.slide({ pageProgress: "19/20" });
  composer.textInput("medications", {
    question: translate(localization, {
      en: "Please list your current medications.",
      ar: "يرجى ذكر الأدوية التي تتناولها حالياً.",
    }),
  });

  // 20. Summary / Review
  composer.slide({ pageProgress: "20/20" });
  composer.h2(
    translate(localization, {
      en: "Summary & Review",
      ar: "ملخص ومراجعة",
    })
  );
  composer.p(
    translate(localization, {
      en: "Review your answers before generating the patient story.",
      ar: "راجع إجاباتك قبل توليد قصة المريض.",
    })
  );

  const buttonLabel = translate(localization, { en: "Generate Story", ar: "توليد القصة" });
  const loadingLabel = translate(localization, { en: "Generating…", ar: "جاري التوليد…" });
  const clearDataLabel = translate(localization, { en: "Clear Data", ar: "مسح البيانات" });
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
  <button type="button" id="btn-generate-story" class="fmd-btn fmd-btn-accent" data-loading-text="${loadingLabel}">
    ${buttonLabel}
  </button>
  <button type="button" id="btn-clear-data" class="fmd-btn" style="background-color:#dc3545;color:white;margin-inline-start:10px;">
    ${clearDataLabel}
  </button>
</div>

<div id="story-result" class="fmd-card fmd-p-4 fmd-mt-4" style="display:none;white-space:pre-wrap;text-align:start;"></div>
<div class="fmd-text-center fmd-mt-2">
  <button type="button" id="btn-copy-story" class="fmd-btn fmd-btn-sm fmd-btn-accent" style="display:none;">Copy</button>
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