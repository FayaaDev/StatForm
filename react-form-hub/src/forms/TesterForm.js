import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createTesterFormComposer(localization = "en", theme) {
	if (!window.Composer) return null;

	const composer = new window.Composer({
		id: "tester-form",
		...getSharedFormConfig(localization, theme),
		postUrl: GOOGLE_SCRIPT_URL,
	});

	composer.h1("تسليم أصول الوزارة");
	composer.p(
		localization === "ar"
			? "يرجى تعبئة النموذج التالي لتسليم أصول الوزارة. ستحتاج إلى إدخال رقم الهوية والاسم ونوع الجهاز."
			: "Please complete the following form to submit ministry assets. You will need to enter your ID number, name, and device type.",
	);

	// 1. Text Input - ID Selection with validation
	composer.slide({ pageProgress: "1/3" });
	composer.textInput("question1", {
		question:
			localization === "ar"
				? "أدخل رقم الهوية الخاص بك"
				: "Enter your ID number",
		placeholder: localization === "ar" ? "أدخل رقم الهوية" : "Enter ID number",
		pattern: "^(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20)$",
		value: "",
		required: true,
	});

	// 2. Name field - auto-fills based on selected ID (editable)
	composer.slide({ pageProgress: "2/3" });

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "جون كارتر" : "John Carter",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '1'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "سارة مالك" : "Sara Malik",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '2'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "سارة مالك" : "Sara Malik",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '3'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "عائشة نور" : "Aisha Noor",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '4'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Michael Trent",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '5'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "لينا عمر" : "Lina Omar",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '6'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Henry Brooks",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '7'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "نادية سالم" : "Nadia Salem",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '8'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Chris Jordan",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '9'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "فاطمة حليم" : "Fatima Haleem",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '10'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Robert Miles",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '11'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "دانا فارس" : "Dana Faris",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '12'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "عمر خالد" : "Omar Khalid",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '13'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Emily Rhodes",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '14'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "سمير قاسم" : "Samir Qassem",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '15'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Julia Tate",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '16'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "يوسف كريم" : "Yusuf Karim",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '17'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Nora Blake",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '18'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: "Thomas Reed",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '19'",
		},
	});

	composer.textInput("userName", {
		question: localization === "ar" ? "الاسم" : "Name",
		value: localization === "ar" ? "ليلى حسن" : "Layla Hassan",
		required: true,
		displayCondition: {
			dependencies: ["question1"],
			condition: "question1 == '20'",
		},
	});

	// 3. Select Box (ChoiceInput)
	composer.slide({ pageProgress: "3/4" });
	composer.choiceInput("question2", {
		question: localization === "ar" ? "ماهو ملاكك؟" : "What's your sponsor?",
		choices: localization === "ar" ? ["الوزارة", "وقاية"] : ["MoH", "PHA"],
		required: true,
	});

	// 4. PC Type Text Input
	composer.slide({ pageProgress: "4/4" });
	composer.textInput("pcType", {
		question:
			localization === "ar" ? "ما هو نوع الكمبيوتر؟" : "What is the PC type?",
		placeholder: localization === "ar" ? "أدخل نوع الكمبيوتر" : "Enter PC type",
		required: true,
	});

	return composer;
}
