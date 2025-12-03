import { translate } from "../utils/translate.js";
import { getSharedFormConfig, GOOGLE_SCRIPT_URL } from "./formUtils.js";

export function createCPPHistoryFormComposer(localization = "en", theme) {
  if (!window.Composer) {
    console.error("Composer not loaded yet");
    return null;
  }

  const composer = new window.Composer({
    id: "cpp-history-form",
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
      en: "Chronic Pelvic Pain History Form",
      ar: "نموذج تاريخ ألم الحوض المزمن",
    })
  );
  composer.p(
    translate(localization, {
      en: "Persistent or recurrent pain in the lower abdomen or pelvis lasting at least 3 to 6 months",
      ar: "نموذج منظم لأخذ التاريخ المرضي لتقييم ألم الحوض المزمن.",
    })
  );

  // 1. Age
  composer.slide({ pageProgress: "1/25" });
  composer.numberInput("age", {
    question: translate(localization, { en: "Age", ar: "العمر" }),
    min: 0,
    max: 120,
  });

  // 2. Gender / Sex
  composer.slide({ pageProgress: "2/25" });
  composer.choiceInput("sex", {
    question: translate(localization, { en: "Sex / Gender", ar: "الجنس / النوع" }),
    choices: [
      translate(localization, { en: "Female", ar: "أنثى" }),
      translate(localization, { en: "Male", ar: "ذكر" }),
      translate(localization, { en: "Other / prefer not to say", ar: "آخر / أفضل عدم التصريح" }),
    ],
  });

  // 3. Duration of pain
  composer.slide({ pageProgress: "3/25" });
  composer.textInput("pain_duration", {
    question: translate(localization, {
      en: "How long have you had pelvic or lower abdominal pain?",
      ar: "منذ متى وأنت تعاني من ألم في الحوض أو أسفل البطن؟",
    }),
  });

  // 4. Pain location
  composer.slide({ pageProgress: "4/25" });
  composer.textInput("pain_location", {
    question: translate(localization, {
      en: "Where is the pain located (pelvis, lower abdomen, one side / both)?",
      ar: "أين يقع الألم؟ (الحوض، أسفل البطن، جهة واحدة أم الجهتان؟)",
    }),
  });

  // 5. Pain pattern (constant, intermittent, cyclic, etc.)
  composer.slide({ pageProgress: "5/25" });
  composer.choiceInput("pain_pattern", {
    question: translate(localization, {
      en: "How would you describe the pain pattern?",
      ar: "كيف تصف نمط الألم؟",
    }),
    choices: [
      translate(localization, { en: "Constant", ar: "مستمر" }),
      translate(localization, { en: "Intermittent / comes and goes", ar: "متقطع / يجي ويذهب" }),
      translate(localization, { en: "Cyclic (with menstrual cycle)", ar: "دوري (مرتبط بالدورة الشهرية)" }),
      translate(localization, { en: "Not sure", ar: "لست متأكد" }),
    ],
  });

  // 6. Pain character / quality
  composer.slide({ pageProgress: "6/25" });
  composer.textInput("pain_character", {
    question: translate(localization, {
      en: "Describe the character of the pain (cramp, burning, aching, sharp, etc.)",
      ar: "صف طبيعة الألم (مغص، حارق، ممل، حاد، الخ…) )",
    }),
  });

  // 7. Relation to menstruation (if female)
  composer.slide({ pageProgress: "7/25" });
  composer.textInput("menses_relation", {
    question: translate(localization, {
      en: "For females: does pain relate to menstrual cycle (worsen, improve, no change)?",
      ar: "للنِساء: هل يرتبط الألم بالدورة الشهرية (يزداد، يتحسن، لا يتغير)؟",
    }),
    displayCondition: {
      dependencies: ["sex"],
      condition: "sex == 'Female' or sex == 'أنثى'",
    },
    required: false,
  });

  // 8. Relation to urination / bladder symptoms
  composer.slide({ pageProgress: "8/25" });
  composer.textInput("urinary_symptoms", {
    question: translate(localization, {
      en: "Any urinary symptoms? (pain, urgency, frequency, dysuria, etc.)",
      ar: "هل توجد أعراض بولية؟ (ألم، إلحاح، تكرار، صعوبة أو حرقة توال، إلخ)",
    }),
  });

  // 9. Relation to bowel symptoms / GI
  composer.slide({ pageProgress: "9/25" });
  composer.textInput("gi_symptoms", {
    question: translate(localization, {
      en: "Any gastrointestinal symptoms? (bloating, bowel habit changes, pain with bowel movements, IBS, etc.)",
      ar: "هل توجد أعراض هضمية؟ (انتفاخ، تغيّر عادات الأمعاء، ألم مع التبرز، أعراض متلازمة القولون العصبي، إلخ)",
    }),
  });

  // 10. Relation to sexual activity / function
  composer.slide({ pageProgress: "10/25" });
  composer.textInput("sexual_symptoms", {
    question: translate(localization, {
      en: "Any sexual / reproductive symptoms? (pain with intercourse, dysfunction, changes in libido, etc.)",
      ar: "هل توجد أعراض جنسية / تناسلية؟ (ألم مع الجماع، اضطراب، تغير رغبة، الخ…) )",
    }),
  });

  // 11. History of gynecologic / urologic / bowel conditions
  composer.slide({ pageProgress: "11/25" });
  composer.textInput("past_conditions", {
    question: translate(localization, {
      en: "Any past gynecologic, urologic or bowel diagnoses? (e.g. endometriosis, interstitial cystitis, IBS, PID, adhesions, etc.)",
      ar: "هل لديك تشخيصات سابقة في أمراض النساء، المسالك البولية أو الجهاز الهضمي؟ (مثل: بطانة الرحم المهاجرة، التهاب المثانة بين اللاحق، القولون العصبي، مرض التهابي حوضي، التصاقات، إلخ)",
    }),
  });

  // 12. History of pelvic surgery or trauma
  composer.slide({ pageProgress: "12/25" });
  composer.textInput("surgery_trauma_history", {
    question: translate(localization, {
      en: "Any history of pelvic/abdominal surgery, trauma, or interventions?",
      ar: "هل لديك تاريخ عمليات أو إصابات في الحوض أو البطن أو تدخلات؟",
    }),
  });

  // 13. Previous treatments and response
  composer.slide({ pageProgress: "13/25" });
  composer.textInput("prior_treatments", {
    question: translate(localization, {
      en: "What treatments have you tried? (medications, physical therapy, pelvic floor therapy, behavioral therapy, surgeries, etc.)",
      ar: "ما العلاجات التي جربتها؟ (أدوية، علاج طبيعي، علاج أرضية الحوض، علاج سلوكي، جراحات، الخ…) )",
    }),
  });

  composer.textInput("treatment_response", {
    question: translate(localization, {
      en: "Did any of them help? Please describe.",
      ar: "هل ساعدك أي منها؟ وصف ذلك، إن كان.",
    }),
    required: false,
  });

  // 14. Pain impact on quality of life
  composer.slide({ pageProgress: "14/25" });
  composer.textInput("qol_impact", {
    question: translate(localization, {
      en: "How does this pain affect your daily life (work, sleep, relationships, mental health)?",
      ar: "كيف يؤثر هذا الألم على حياتك اليومية (العمل، النوم، العلاقات، الصحة النفسية)؟",
    }),
  });

  // 15. Psychological / mental health history
  composer.slide({ pageProgress: "15/25" });
  composer.textInput("psych_history", {
    question: translate(localization, {
      en: "Do you have history of mood disorders, anxiety, stress, trauma, or sleep problems?",
      ar: "هل لديك تاريخ اضطرابات مزاجية، قلق، توتر، صدمة نفسية، أو مشاكل في النوم؟",
    }),
  });

  // 16. Other chronic pain conditions / comorbidities
  composer.slide({ pageProgress: "16/25" });
  composer.textInput("comorbidities", {
    question: translate(localization, {
      en: "Do you have other chronic pain or systemic conditions (e.g. fibromyalgia, chronic fatigue, chronic pain syndromes)?",
      ar: "هل لديك أمراض ألمية مزمنة أخرى أو حالات جهازية (مثل فيبروميالغيا، تعب مزمن، متلازمات ألم مزمن)؟",
    }),
  });

  // 17. Red flag features (mass, bleeding, hematuria, systemic symptoms) 
  composer.slide({ pageProgress: "17/25" });
  composer.textInput("red_flags", {
    question: translate(localization, {
      en: "Have you noted any of the following: pelvic mass/fullness, abnormal bleeding (post-coital, post-menopause), blood in urine, unexplained weight loss, fever, or rapidly worsening pain?",
      ar: "هل لاحظت أي مما يلي: كتلة أو امتلاء بالحوض، نزيف غير طبيعي (بعد الجماع، بعد سن اليأس)، دم في البول، فقدان وزن غير مفسَّر، حمى، أو ألم يزداد بسرعة؟",
    }),
  });

  // 18. Social history & lifestyle
  composer.slide({ pageProgress: "18/25" });
  composer.textInput("social_history", {
    question: translate(localization, {
      en: "Social / lifestyle factors (smoking, stress, occupation, support, etc.)",
      ar: "عوامل اجتماعية / نمط حياة (تدخين، ضغط، عمل، دعم اجتماعي، الخ…) )",
    }),
  });

  // 19. Other symptoms
  composer.slide({ pageProgress: "19/25" });
  composer.textInput("other_symptoms", {
    question: translate(localization, {
      en: "Any other symptoms or complaints not covered above?",
      ar: "هل لديك أعراض أو شكاوى أخرى لم تُذكر أعلاه؟",
    }),
  });

  // 20. Summary / Review & Patient Story generation
  composer.slide({ pageProgress: "20/25" });
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
`);

  return composer;
}