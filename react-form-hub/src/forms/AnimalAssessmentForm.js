import { translate } from "../utils/translate.js";
import { GOOGLE_SCRIPT_URL, getSharedFormConfig } from "./formUtils.js";

export function createAnimalAssessmentFormComposer(localization = "en", theme) {
	if (!window.Composer) {
		console.error("Composer not loaded yet");
		return null;
	}

	const composer = new window.Composer({
		id: "animal-assessment-form",
		...getSharedFormConfig(localization, theme),
		postUrl: "https://script.google.com/macros/s/AKfycbzweSCIAqKiXJyhw46Swt3bSyB3Fe0-xWMwTDklGAjlvkMSHOsNSr1HWZiWOJ1ZzV4fMw/exec",
		_sheetName: "تقييم الحيوانات",
	});

	// Welcome slide
	composer.h1(
		translate(localization, {
			en: "Animal Assessment Form",
			ar: "التقصي الحيواني",
		}),
	);
	composer.p(
		translate(localization, {
			en: "Please complete this animal health assessment form.",
			ar: "يرجى إكمال نموذج تقييم صحة الحيوانات.",
		}),
	);

	// Question 1: Date
	composer.slide({ pageProgress: "1/50" });
	composer.textInput("date", {
		question: translate(localization, {
			en: "Date",
			ar: "التاريخ",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: true,
	});

	// Question 2: Coordinates
	composer.slide({ pageProgress: "2/50" });
	composer.textInput("coordinates", {
		question: translate(localization, {
			en: "Coordinates",
			ar: "الاحداثيات",
		}),
		placeholder: translate(localization, {
			en: "Enter coordinates",
			ar: "أدخل الإحداثيات",
		}),
		required: true,
	});

	// Question 3: City
	composer.slide({ pageProgress: "3/50" });
	composer.textInput("city", {
		question: translate(localization, {
			en: "City",
			ar: "المدينة",
		}),
		placeholder: translate(localization, {
			en: "Enter city name",
			ar: "أدخل اسم المدينة",
		}),
		required: true,
	});

	// Question 4: District
	composer.slide({ pageProgress: "4/50" });
	composer.textInput("district", {
		question: translate(localization, {
			en: "District",
			ar: "الحي",
		}),
		placeholder: translate(localization, {
			en: "Enter district name",
			ar: "أدخل اسم الحي",
		}),
		required: true,
	});

	// Question 5: Site Type
	composer.slide({ pageProgress: "5/50" });
	composer.selectBox("site_type", {
		question: translate(localization, {
			en: "Site Type",
			ar: "نوع الموقع",
		}),
		options:
			localization === "ar"
				? ["مزرعة", "حظيرة", "سوق", "مسلخ", "أخرى"]
				: ["Farm", "Barn", "Market", "Slaughterhouse", "Other"],
		required: true,
	});

	// Question 6: Site Description
	composer.slide({ pageProgress: "6/50" });
	composer.textInput("site_description", {
		question: translate(localization, {
			en: "Site Description",
			ar: "وصف الموقع",
		}),
		placeholder: translate(localization, {
			en: "Describe the site",
			ar: "صف الموقع",
		}),
		required: false,
	});

	// Question 7: Site Name
	composer.slide({ pageProgress: "7/50" });
	composer.textInput("site_name", {
		question: translate(localization, {
			en: "Site Name",
			ar: "اسم الموقع",
		}),
		placeholder: translate(localization, {
			en: "Enter site name",
			ar: "أدخل اسم الموقع",
		}),
		required: false,
	});

	// Question 8: Owner Name
	composer.slide({ pageProgress: "8/50" });
	composer.textInput("owner_name", {
		question: translate(localization, {
			en: "Owner Name",
			ar: "اسم مالك الموقع",
		}),
		placeholder: translate(localization, {
			en: "Enter owner name",
			ar: "أدخل اسم المالك",
		}),
		required: false,
	});

	// Question 9: Owner Mobile Number
	composer.slide({ pageProgress: "9/50" });
	composer.textInput("owner_mobile", {
		question: translate(localization, {
			en: "Owner Mobile Number",
			ar: "رقم جوال المالك",
		}),
		placeholder: translate(localization, {
			en: "Enter mobile number",
			ar: "أدخل رقم الجوال",
		}),
		required: false,
	});

	// Health Assessment Section
	composer.slide({ pageProgress: "10/50" });
	composer.h2(
		translate(localization, {
			en: "Site Health Assessment",
			ar: "التقييم الصحي للموقع",
		}),
	);

	// Question 10: Residence Present
	composer.choiceInput("residence_present", {
		question: translate(localization, {
			en: "Is there a residence?",
			ar: "هل يوجد مسكن؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 11: Standing Water
	composer.slide({ pageProgress: "11/50" });
	composer.choiceInput("standing_water", {
		question: translate(localization, {
			en: "Is there standing water?",
			ar: "هل يوجد تجمع مياه راكدة؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 12: Waste Management
	composer.slide({ pageProgress: "12/50" });
	composer.selectBox("waste_management", {
		question: translate(localization, {
			en: "Waste Management",
			ar: "إدارة نفايات",
		}),
		options:
			localization === "ar"
				? ["جيدة", "مقبولة", "سيئة", "غير موجودة"]
				: ["Good", "Acceptable", "Poor", "None"],
		required: false,
	});

	// Question 13: Milk Collection/Consumption
	composer.slide({ pageProgress: "13/50" });
	composer.choiceInput("milk_collection", {
		question: translate(localization, {
			en: "Milk consumption/collection present?",
			ar: "هل يوجد استهلاك أو جمع للحليب؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 14: Animal Slaughter
	composer.slide({ pageProgress: "14/50" });
	composer.choiceInput("animal_slaughter", {
		question: translate(localization, {
			en: "Is there animal slaughter?",
			ar: "هل يوجد ذبح للحيوانات؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 15: Suspected Disease Presence
	composer.slide({ pageProgress: "15/50" });
	composer.choiceInput("suspected_disease", {
		question: translate(localization, {
			en: "Suspected disease presence?",
			ar: "هل يوجد اشتباه بوجود مرض؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 16: Ticks Present
	composer.slide({ pageProgress: "16/50" });
	composer.choiceInput("ticks_present", {
		question: translate(localization, {
			en: "Are there ticks present?",
			ar: "هل يوجد قراد بالموقع؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 17: Breeding Sites
	composer.slide({ pageProgress: "17/50" });
	composer.choiceInput("breeding_sites", {
		question: translate(localization, {
			en: "Are there breeding sites?",
			ar: "هل يوجد بؤر توالد للحشرات؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 18: High Density
	composer.slide({ pageProgress: "18/50" });
	composer.choiceInput("high_density", {
		question: translate(localization, {
			en: "Is there high density?",
			ar: "هل يوجد كثافة عالية؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Animal Information Section
	composer.slide({ pageProgress: "19/50" });
	composer.h2(
		translate(localization, {
			en: "Animal Information",
			ar: "معلومات الحيوان",
		}),
	);

	// Question 19: Animal Type
	composer.selectBox("animal_type", {
		question: translate(localization, {
			en: "Animal Type",
			ar: "نوع الحيوان",
		}),
		options:
			localization === "ar"
				? ["أبقار", "أغنام", "ماعز", "إبل", "خيول", "دواجن", "أخرى"]
				: ["Cattle", "Sheep", "Goats", "Camels", "Horses", "Poultry", "Other"],
		required: true,
	});

	// Question 20: Animal Classification
	composer.slide({ pageProgress: "20/50" });
	composer.textInput("animal_classification", {
		question: translate(localization, {
			en: "Animal Classification",
			ar: "تصنيف الحيوان",
		}),
		placeholder: translate(localization, {
			en: "Enter classification",
			ar: "أدخل التصنيف",
		}),
		required: false,
	});

	// Question 21: Animal ID Number
	composer.slide({ pageProgress: "21/50" });
	composer.textInput("animal_id", {
		question: translate(localization, {
			en: "Animal ID Number",
			ar: "الرقم التعريفي للحيوان",
		}),
		placeholder: translate(localization, {
			en: "Enter ID number",
			ar: "أدخل الرقم التعريفي",
		}),
		required: false,
	});

	// Question 22: Animal Age
	composer.slide({ pageProgress: "22/50" });
	composer.numberInput("animal_age", {
		question: translate(localization, {
			en: "Animal Age (years)",
			ar: "عمر الحيوان (سنوات)",
		}),
		min: 0,
		max: 50,
	});

	// Question 23: Animal Gender
	composer.slide({ pageProgress: "23/50" });
	composer.choiceInput("animal_gender", {
		question: translate(localization, {
			en: "Animal Gender",
			ar: "جنس الحيوان",
		}),
		choices: [
			translate(localization, { en: "Male", ar: "ذكر" }),
			translate(localization, { en: "Female", ar: "أنثى" }),
		],
	});

	// Question 24: Herd Size
	composer.slide({ pageProgress: "24/50" });
	composer.numberInput("herd_size", {
		question: translate(localization, {
			en: "Number of Animals in Herd",
			ar: "عدد أفراد القطيع",
		}),
		min: 1,
		max: 10000,
	});

	// Question 25: Number Affected
	composer.slide({ pageProgress: "25/50" });
	composer.numberInput("number_affected", {
		question: translate(localization, {
			en: "Number Affected from Herd",
			ar: "عدد المصاب من القطيع",
		}),
		min: 0,
		max: 10000,
	});

	// Question 26: Number Deceased
	composer.slide({ pageProgress: "26/50" });
	composer.numberInput("number_deceased", {
		question: translate(localization, {
			en: "Number Deceased from Herd",
			ar: "عدد المتوفي من القطيع",
		}),
		min: 0,
		max: 10000,
	});

	// Question 27: Imported Animal
	composer.slide({ pageProgress: "27/50" });
	composer.choiceInput("is_imported", {
		question: translate(localization, {
			en: "Is the animal imported?",
			ar: "هل الحيوان مستورد؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 28: Import Country
	composer.textInput("import_country", {
		question: translate(localization, {
			en: "Import Country",
			ar: "دولة الاستيراد",
		}),
		placeholder: translate(localization, {
			en: "Enter country name",
			ar: "أدخل اسم الدولة",
		}),
		required: false,
		displayCondition: {
			dependencies: ["is_imported"],
			condition: "is_imported == 'Yes' or is_imported == 'نعم'",
		},
	});

	// Question 29: Import Date
	composer.textInput("import_date", {
		question: translate(localization, {
			en: "Import Date",
			ar: "تاريخ الاستيراد",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["is_imported"],
			condition: "is_imported == 'Yes' or is_imported == 'نعم'",
		},
	});

	// Question 30: Animal Moved in 30 Days
	composer.slide({ pageProgress: "28/50" });
	composer.choiceInput("moved_30_days", {
		question: translate(localization, {
			en: "Was the animal moved within 30 days?",
			ar: "هل تم نقل الحيوان خلال فترة 30 يوما؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 31: Locations in 30 Days
	composer.textInput("locations_30_days", {
		question: translate(localization, {
			en: "Locations where animal was present within 30 days",
			ar: "مواقع تواجد الحيوان خلال 30 يوما",
		}),
		placeholder: translate(localization, {
			en: "List locations",
			ar: "اذكر المواقع",
		}),
		required: false,
		displayCondition: {
			dependencies: ["moved_30_days"],
			condition: "moved_30_days == 'Yes' or moved_30_days == 'نعم'",
		},
	});

	// Question 32: Vaccinated
	composer.slide({ pageProgress: "29/50" });
	composer.choiceInput("is_vaccinated", {
		question: translate(localization, {
			en: "Is the animal vaccinated?",
			ar: "هل الحيوان محصن؟",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 33: Vaccination Company Details
	composer.textInput("vaccination_company", {
		question: translate(localization, {
			en: "Operational Number and Company Name for Vaccination",
			ar: "الرقم التشغيلي واسم الشركة للتحصين",
		}),
		placeholder: translate(localization, {
			en: "Enter details",
			ar: "أدخل التفاصيل",
		}),
		required: false,
		displayCondition: {
			dependencies: ["is_vaccinated"],
			condition: "is_vaccinated == 'Yes' or is_vaccinated == 'نعم'",
		},
	});

	// Question 34: Vaccination Date
	composer.textInput("vaccination_date", {
		question: translate(localization, {
			en: "Vaccination Date",
			ar: "تاريخ التحصين",
		}),
		placeholder: translate(localization, {
			en: "Enter date (YYYY-MM-DD)",
			ar: "أدخل التاريخ (YYYY-MM-DD)",
		}),
		required: false,
		displayCondition: {
			dependencies: ["is_vaccinated"],
			condition: "is_vaccinated == 'Yes' or is_vaccinated == 'نعم'",
		},
	});

	// Clinical Signs Section
	composer.slide({ pageProgress: "30/50" });
	composer.h2(
		translate(localization, {
			en: "Health Status and Clinical Signs",
			ar: "الحالة الصحية والعلامات السريرية",
		}),
	);

	// Question 35: General Health Status
	composer.selectBox("health_status", {
		question: translate(localization, {
			en: "General Health Status",
			ar: "الحالة الصحية",
		}),
		options:
			localization === "ar"
				? ["جيدة", "متوسطة", "سيئة", "حرجة"]
				: ["Good", "Fair", "Poor", "Critical"],
		required: true,
	});

	// Question 36: Fever
	composer.slide({ pageProgress: "31/50" });
	composer.choiceInput("fever", {
		question: translate(localization, {
			en: "Fever",
			ar: "حرارة",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 37: Physical Weakness/Depression
	composer.slide({ pageProgress: "32/50" });
	composer.choiceInput("weakness_depression", {
		question: translate(localization, {
			en: "Physical Weakness / Depression",
			ar: "ضعف جسدي / اكتئاب",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 38: Bloody Diarrhea
	composer.slide({ pageProgress: "33/50" });
	composer.choiceInput("bloody_diarrhea", {
		question: translate(localization, {
			en: "Bloody Diarrhea",
			ar: "إسهال دموي",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 39: Dehydration
	composer.slide({ pageProgress: "34/50" });
	composer.choiceInput("dehydration", {
		question: translate(localization, {
			en: "Dehydration",
			ar: "جفاف",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 40: Excessive Nasal Discharge
	composer.slide({ pageProgress: "35/50" });
	composer.choiceInput("nasal_discharge", {
		question: translate(localization, {
			en: "Excessive Nasal Mucous Discharge",
			ar: "إفراط بالافرازات المخاطية من الأنف",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 41: Excessive Salivation
	composer.slide({ pageProgress: "36/50" });
	composer.choiceInput("salivation", {
		question: translate(localization, {
			en: "Excessive Salivation from Mouth",
			ar: "إفراط بالافرازات اللعابية من الفم",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 42: Excessive Tearing
	composer.slide({ pageProgress: "37/50" });
	composer.choiceInput("excessive_tearing", {
		question: translate(localization, {
			en: "Excessive Tearing",
			ar: "إفراط بالدموع",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 43: Loss of Appetite
	composer.slide({ pageProgress: "38/50" });
	composer.choiceInput("loss_of_appetite", {
		question: translate(localization, {
			en: "Loss of Appetite",
			ar: "فقدان الشهية",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 44: Decreased Milk Production
	composer.slide({ pageProgress: "39/50" });
	composer.choiceInput("decreased_milk_production", {
		question: translate(localization, {
			en: "Decreased Milk Production",
			ar: "انخفاض محصول الحليب",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 45: Abortion
	composer.slide({ pageProgress: "40/50" });
	composer.choiceInput("abortion", {
		question: translate(localization, {
			en: "Abortion",
			ar: "إجهاض",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 46: Newborn Death/Fetal Deformities
	composer.slide({ pageProgress: "41/50" });
	composer.choiceInput("newborn_death_deformities", {
		question: translate(localization, {
			en: "Newborn Death and Fetal Deformities",
			ar: "نفوق مواليد وتشوهات أجنة",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 47: Increased Respiratory Rate
	composer.slide({ pageProgress: "42/50" });
	composer.choiceInput("increased_respiratory_rate", {
		question: translate(localization, {
			en: "Increased Respiratory Rate",
			ar: "زيادة بمعدل سرعة النفس",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 48: Death
	composer.slide({ pageProgress: "43/50" });
	composer.choiceInput("death", {
		question: translate(localization, {
			en: "Death",
			ar: "وفاة",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 49: Other Signs/Symptoms
	composer.slide({ pageProgress: "44/50" });
	composer.textInput("other_signs", {
		question: translate(localization, {
			en: "Other Signs and Symptoms (Specify)",
			ar: "أعراض وعلامات أخرى (حدد)",
		}),
		placeholder: translate(localization, {
			en: "Specify other symptoms",
			ar: "حدد الأعراض الأخرى",
		}),
		required: false,
	});

	// Question 50: Preliminary Diagnosis
	composer.slide({ pageProgress: "45/50" });
	composer.textInput("preliminary_diagnosis", {
		question: translate(localization, {
			en: "Preliminary Diagnosis",
			ar: "التشخيص المبدئي",
		}),
		placeholder: translate(localization, {
			en: "Enter diagnosis",
			ar: "أدخل التشخيص",
		}),
		required: false,
	});

	// Sample Information Section
	composer.slide({ pageProgress: "46/50" });
	composer.h2(
		translate(localization, {
			en: "Sample Information",
			ar: "معلومات العينة",
		}),
	);

	// Question 51: Animal Sample Code
	composer.textInput("animal_sample_code", {
		question: translate(localization, {
			en: "Animal Sample Code",
			ar: "رمز العينة الحيوانية",
		}),
		placeholder: translate(localization, {
			en: "Enter sample code",
			ar: "أدخل رمز العينة",
		}),
		required: false,
	});

	// Question 52: Animal Sample Type
	composer.slide({ pageProgress: "47/50" });
	composer.selectBox("animal_sample_type", {
		question: translate(localization, {
			en: "Animal Sample Type",
			ar: "نوع العينة الحيوانية",
		}),
		options:
			localization === "ar"
				? ["دم", "مسحة", "براز", "بول", "نسيج", "أخرى"]
				: ["Blood", "Swab", "Feces", "Urine", "Tissue", "Other"],
		required: false,
	});

	// Question 53: Number of Samples
	composer.slide({ pageProgress: "48/50" });
	composer.numberInput("number_of_samples", {
		question: translate(localization, {
			en: "Number of Samples",
			ar: "عدد العينات",
		}),
		min: 0,
		max: 100,
	});

	return composer;
}
