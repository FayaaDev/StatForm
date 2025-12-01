import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

/**
 * Creates the Burnout Survey composer
 * @param {string} localization - Language code ('en' or 'ar')
 * @param {Object} theme - Theme object from ThemeContext
 * @returns {Composer} Configured composer instance
 */
export function createBurnoutSurveyComposer(localization = "en", theme) {
    if (!window.Composer) {
        console.error("Composer not loaded yet");
        return null;
    }

    const composer = new window.Composer({
        id: "burnout-survey",
        ...getSharedFormConfig(localization, theme),
        postUrl: GOOGLE_SCRIPT_URL,
    });

    // Welcome slide
    composer.h1(
        translate(localization, {
            en: "Burnout Syndrome Survey",
            ar: "استبيان متلازمة الاحتراق النفسي",
        })
    );
    composer.p(
        translate(localization, {
            en: "Please answer the following questions about your feelings toward your work.",
            ar: "يرجى الإجابة على الأسئلة التالية حول مشاعرك تجاه عملك.",
        })
    );


    const choices = localization === "ar"
        ? ["أبداً", "نادراً", "أحياناً", "غالباً", "دائماً"]
        : ["Never", "Rarely", "Sometimes", "Often", "Always"];

    const questions = [
        {
            en: "I feel emotionally drained from my work.",
            ar: "أشعر بالاستنزاف العاطفي من عملي.",
        },
        {
            en: "I feel used up at the end of the workday.",
            ar: "أشعر بالإنهاك في نهاية يوم العمل.",
        },
        {
            en: "I feel tired when I get up in the morning and have to face another day on the job.",
            ar: "أشعر بالتعب عندما أستيقظ في الصباح وأواجه يوماً آخر في العمل.",
        },
        {
            en: "Working with people all day is really a strain for me.",
            ar: "العمل مع الناس طوال اليوم يمثل ضغطاً حقيقياً علي.",
        },
        {
            en: "I feel burned out from my work.",
            ar: "أشعر بالاحتراق النفسي من عملي.",
        },
        {
            en: "I feel I'm working too hard on my job.",
            ar: "أشعر أنني أعمل بجد أكثر من اللازم في وظيفتي.",
        },
        {
            en: "I feel working with people directly puts too much stress on me.",
            ar: "أشعر أن العمل مع الناس مباشرة يضع الكثير من الضغط علي.",
        },
        {
            en: "I feel like I'm at the end of my rope.",
            ar: "أشعر أنني وصلت إلى حافة الانهيار.",
        },
        {
            en: "I feel frustrated by my job.",
            ar: "أشعر بالإحباط بسبب وظيفتي.",
        },
        {
            en: "I feel I cannot cope with the pressure of my job.",
            ar: "أشعر أنني لا أستطيع التعامل مع ضغط وظيفتي.",
        },
    ];

    questions.forEach((q, index) => {
        composer.slide({ pageProgress: `${index + 1}/${questions.length}` });
        composer.choiceInput(`q${index + 1}`, {
            question: translate(localization, {
                en: q.en,
                ar: q.ar,
            }),
            choices: choices,
            required: true,
        });
    });

    return composer;
}
