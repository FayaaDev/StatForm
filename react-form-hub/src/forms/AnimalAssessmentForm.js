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
		postUrl: "https://script.google.com/macros/s/AKfycbyGxKsPTk6f8zobbeMa7EjeR8S1kyaVhte9PGNDRkUcn0I22HiXqoDbwzyNdkD8BcrPXw/exec",
		_sheetName: "التقصي الحيواني",
		_sheetId: "1pjnsNQr8qzWBQ118kO6lNUrFMg4ySDAllpM3MBgy-6M",
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

	// Question 1: Investigation Code
	composer.slide({ pageProgress: "1/54" });
	composer.textInput("investigation_code", {
		question: translate(localization, {
			en: "Investigation Code",
			ar: "رمز التقصي",
		}),
		placeholder: translate(localization, {
			en: "Enter investigation code",
			ar: "أدخل رمز التقصي",
		}),
		required: false,
	});

	// Question 2: Date
	composer.slide({ pageProgress: "2/54" });
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

	// Question 3: Coordinates
	composer.slide({ pageProgress: "3/54" });
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

	// Question 4: City
	composer.slide({ pageProgress: "4/54" });
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

	// Question 5: District
	composer.slide({ pageProgress: "5/54" });
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

	// Question 6: Site Type
	composer.slide({ pageProgress: "6/54" });
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

	// Question 7: Site Description
	composer.slide({ pageProgress: "7/54" });
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

	// Question 8: Site Name
	composer.slide({ pageProgress: "8/54" });
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

	// Question 9: Owner Name
	composer.slide({ pageProgress: "9/54" });
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

	// Question 10: Owner Mobile Number
	composer.slide({ pageProgress: "10/54" });
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
	composer.slide({ pageProgress: "11/54" });
	composer.h2(
		translate(localization, {
			en: "Site Health Assessment",
			ar: "التقييم الصحي للموقع",
		}),
	);

	// Question 11: Residence Present
	composer.choiceInput("residence_present", {
		question: translate(localization, {
			en: "Is there a residence near the site?",
			ar: "هل يوجد مسكن بالقرب من الموقع",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 12: Standing Water
	composer.slide({ pageProgress: "12/54" });
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

	// Question 13: Waste Management
	composer.slide({ pageProgress: "13/54" });
	composer.choiceInput("waste_management", {
		question: translate(localization, {
			en: "Poor Waste Management?",
			ar: "إدارة نفايات سيئة",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 14: Animal Products Collection/Consumption
	composer.slide({ pageProgress: "14/54" });
	composer.choiceInput("animal_products", {
		question: translate(localization, {
			en: "Consumption, collection or sale of animal products?",
			ar: "استهلاك, جمع او بيع للمنتجات الحيوانية",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 15: Animal Slaughter
	composer.slide({ pageProgress: "15/54" });
	composer.choiceInput("animal_slaughter", {
		question: translate(localization, {
			en: "Animal slaughter at the site?",
			ar: "ذبح للحيوانات بالموقع",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 16: Suspected Rodents Presence
	composer.slide({ pageProgress: "16/54" });
	composer.choiceInput("suspected_rodents", {
		question: translate(localization, {
			en: "Suspected rodents presence?",
			ar: "اشتباه وجود قوارض",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 17: Ticks Present
	composer.slide({ pageProgress: "17/54" });
	composer.choiceInput("ticks_present", {
		question: translate(localization, {
			en: "Ticks present on animals?",
			ar: "وجود قراد بالحيوانات",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 18: Mosquito Breeding Sites
	composer.slide({ pageProgress: "18/54" });
	composer.choiceInput("breeding_sites", {
		question: translate(localization, {
			en: "Mosquito breeding sites?",
			ar: "بؤر توالد للبعوض",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 19: High Mosquito Density
	composer.slide({ pageProgress: "19/54" });
	composer.choiceInput("high_density", {
		question: translate(localization, {
			en: "High mosquito density?",
			ar: "كثافة عالية للبعوض",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Animal Information Section
	composer.slide({ pageProgress: "20/54" });
	composer.h2(
		translate(localization, {
			en: "Animal Information",
			ar: "معلومات الحيوان",
		}),
	);

	// Question 20: Animal Type
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

	// Question 21: Animal Classification
	composer.slide({ pageProgress: "21/54" });
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

	// Question 22: Animal ID Number
	composer.slide({ pageProgress: "22/54" });
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

	// Question 23: Animal Age
	composer.slide({ pageProgress: "23/54" });
	composer.numberInput("animal_age", {
		question: translate(localization, {
			en: "Animal Age (years)",
			ar: "عمر الحيوان (سنوات)",
		}),
		min: 0,
		max: 50,
	});

	// Question 24: Animal Gender
	composer.slide({ pageProgress: "24/54" });
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

	// Question 25: Herd Size
	composer.slide({ pageProgress: "25/54" });
	composer.numberInput("herd_size", {
		question: translate(localization, {
			en: "Number of Animals in Herd",
			ar: "عدد أفراد القطيع",
		}),
		min: 1,
		max: 10000,
	});

	// Question 26: Number Affected
	composer.slide({ pageProgress: "26/54" });
	composer.numberInput("number_affected", {
		question: translate(localization, {
			en: "Number Affected from Herd",
			ar: "عدد المصاب من القطيع",
		}),
		min: 0,
		max: 10000,
	});

	// Question 27: Number Deceased
	composer.slide({ pageProgress: "27/54" });
	composer.numberInput("number_deceased", {
		question: translate(localization, {
			en: "Number Deceased from Herd",
			ar: "عدد المتوفي من القطيع",
		}),
		min: 0,
		max: 10000,
	});

	// Question 28: Imported Animal
	composer.slide({ pageProgress: "28/54" });
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

	// Question 29: Import Country
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

	// Question 30: Import Date
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

	// Question 31: Animal Moved in 30 Days
	composer.slide({ pageProgress: "31/54" });
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

	// Question 32: Locations in 30 Days
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

	// Question 33: Vaccinated
	composer.slide({ pageProgress: "33/54" });
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

	// Question 34: Vaccination Company Details
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

	// Question 35: Vaccination Date
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
	composer.slide({ pageProgress: "36/54" });
	composer.h2(
		translate(localization, {
			en: "Health Status and Clinical Signs",
			ar: "الحالة الصحية والعلامات السريرية",
		}),
	);

	// Question 36: General Health Status
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

	// Question 37: Fever
	composer.slide({ pageProgress: "37/54" });
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

	// Question 38: Physical Weakness/Depression
	composer.slide({ pageProgress: "38/54" });
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

	// Question 39: Bloody Diarrhea
	composer.slide({ pageProgress: "39/54" });
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

	// Question 40: Dehydration
	composer.slide({ pageProgress: "40/54" });
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

	// Question 41: Excessive Nasal Discharge
	composer.slide({ pageProgress: "41/54" });
	composer.choiceInput("nasal_discharge", {
		question: translate(localization, {
			en: "Excessive Nasal Mucous Discharge",
			ar: "إفراط بالافرازات المخاطية من الانف",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 42: Excessive Salivation
	composer.slide({ pageProgress: "42/54" });
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

	// Question 43: Excessive Tearing
	composer.slide({ pageProgress: "43/54" });
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

	// Question 44: Loss of Appetite
	composer.slide({ pageProgress: "44/54" });
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

	// Question 45: Decreased Milk Production
	composer.slide({ pageProgress: "45/54" });
	composer.choiceInput("decreased_milk_production", {
		question: translate(localization, {
			en: "Decreased Milk Production",
			ar: "إنخفاض محصول الحليب",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 46: Abortion
	composer.slide({ pageProgress: "46/54" });
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

	// Question 47: Newborn Death/Fetal Deformities
	composer.slide({ pageProgress: "47/54" });
	composer.choiceInput("newborn_death_deformities", {
		question: translate(localization, {
			en: "Newborn Death and Fetal Deformities",
			ar: "نفوق مواليد وتشوهات أجنه",
		}),
		choices: [
			translate(localization, { en: "Yes", ar: "نعم" }),
			translate(localization, { en: "No", ar: "لا" }),
		],
		downkeys: ["Y", "N"],
	});

	// Question 48: Increased Respiratory Rate
	composer.slide({ pageProgress: "48/54" });
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

	// Question 49: Death
	composer.slide({ pageProgress: "49/54" });
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

	// Question 50: Other Signs/Symptoms
	composer.slide({ pageProgress: "50/54" });
	composer.textInput("other_signs", {
		question: translate(localization, {
			en: "Other Signs and Symptoms (Specify)",
			ar: "أعراض وعلامات اخرى (حدد)",
		}),
		placeholder: translate(localization, {
			en: "Specify other symptoms",
			ar: "حدد الأعراض الأخرى",
		}),
		required: false,
	});

	// Question 51: Preliminary Diagnosis
	composer.slide({ pageProgress: "51/54" });
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
	composer.slide({ pageProgress: "52/54" });
	composer.h2(
		translate(localization, {
			en: "Sample Information",
			ar: "معلومات العينة",
		}),
	);

	// Question 52: Animal Sample Code
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

	// Question 53: Animal Sample Type
	composer.slide({ pageProgress: "53/54" });
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

	// Question 54: Number of Samples
	composer.slide({ pageProgress: "54/54" });
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
