import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { formRegistry } from "../config/formRegistry";

const HomePage = () => {
	const { currentLang } = useOutletContext();
	const theme = useTheme();
	const [view, setView] = useState("main"); // main, review, create
	const [newFormName, setNewFormName] = useState("");
	const [generatedFormCode, setGeneratedFormCode] = useState("");
	const [generatedPageCode, setGeneratedPageCode] = useState("");

	// Filter forms by current theme
	const availableForms = formRegistry.filter((form) =>
		form.themes.includes(theme.id)
	);

	const translations = {
		welcome: { en: "Welcome to the Form Hub", ar: "مرحباً بك في مركز النماذج" },
		subtitle: { en: "Select an option to proceed", ar: "اختر خياراً للمتابعة" },
		createBtn: { en: "Create New Form", ar: "إنشاء نموذج جديد" },
		reviewBtn: { en: "Review Forms", ar: "مراجعة النماذج" },
		backBtn: { en: "Back", ar: "رجوع" },
		availableForms: { en: "Available Forms", ar: "النماذج المتاحة" },
		enterName: {
			en: "Enter Form Name (e.g., Contact)",
			ar: "أدخل اسم النموذج (مثلاً: تواصل)",
		},
		generate: { en: "Generate Code", ar: "توليد الكود" },
		copyCode: { en: "Copy Code", ar: "نسخ الكود" },
		formFile: { en: "Form Definition File", ar: "ملف تعريف النموذج" },
		pageFile: { en: "Page Component File", ar: "ملف مكون الصفحة" },
		codeInstructions: {
			en: "Create these two files in your project:",
			ar: "قم بإنشاء هذين الملفين في مشروعك:",
		},
	};

	const txt = (key) => translations[key][currentLang];

	const generateCode = () => {
		const name = newFormName.replace(/\s+/g, "");
		const formName = name.charAt(0).toUpperCase() + name.slice(1);

		// 1. Form Definition Code
		const formCode = `import { translate } from '../utils/translate.js';
import { GOOGLE_SCRIPT_URL } from './formUtils.js';

export function create${formName}FormComposer(localization = 'en') {
  if (!window.Composer) return null;

  const composer = new window.Composer({
    id: "${formName.toLowerCase()}-form",
    formStyle: "conversational",
    fontSize: "lg",
    rounded: "pill",
    restartButton: "show",
    buttonAlignment: "end",
    paddingInlineBottom: 80,
    paddingInlineTop: 100,
    colorScheme: "light",
    accent: "#09595C",
    accentForeground: "#ffffff",
    backgroundColor: "#ffffff",
    color: "#063E40",
    postUrl: GOOGLE_SCRIPT_URL,
    localization: localization,
    dir: localization === "ar" ? "rtl" : "ltr",
  });

  composer.h1("${newFormName}");
  composer.startSlide({
    buttonText: localization === "ar" ? "ابدأ" : "Start",
  });

  // 1. Text Field
  composer.slide({ pageProgress: "1/3" });
  composer.textInput("question1", {
    question: localization === "ar" ? "سؤال نصي؟" : "Text Question?",
    required: true,
  });

  // 2. Dropdown Menu (SelectBox)
  composer.slide({ pageProgress: "2/3" });
  composer.selectBox("question2", {
    question: localization === "ar" ? "سؤال القائمة المنسدلة؟" : "Dropdown Question?",
    options: localization === "ar" 
      ? ["خيار 1", "خيار 2", "خيار 3"] 
      : ["Option 1", "Option 2", "Option 3"],
    required: true,
  });

  // 3. Select Box (ChoiceInput)
  composer.slide({ pageProgress: "3/3" });
  composer.choiceInput("question3", {
    question: localization === "ar" ? "سؤال الاختيار؟" : "Selection Question?",
    choices: localization === "ar" 
      ? ["خيار أ", "خيار ب"] 
      : ["Choice A", "Choice B"],
    required: true,
  });

  return composer;
}
`;

		// 2. Page Component Code
		const pageCode = `import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { create${formName}FormComposer } from "../forms/${formName}Form";
import { getFormOptions } from "../forms/formUtils";

const ${formName}FormPage = () => {
  const { currentLang } = useOutletContext();
  const [composer, setComposer] = useState(null);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    const newComposer = create${formName}FormComposer(currentLang);
    const newOptions = getFormOptions(currentLang);

    setComposer(newComposer);
    setOptions(newOptions);
  }, [currentLang]);

  if (!composer || !options) {
    return <div>Loading...</div>;
  }

  return (
    <FormRenderer
      composer={composer}
      options={options}
      id="${formName.toLowerCase()}-form-container"
    />
  );
};

export default ${formName}FormPage;
`;

		setGeneratedFormCode(formCode);
		setGeneratedPageCode(pageCode);
	};

	return (
		<div className="home-page">
			<h1>{txt("welcome")}</h1>

			{view === "main" && (
				<div className="action-buttons">
					<button className="main-action-btn" onClick={() => setView("create")}>
						{txt("createBtn")}
					</button>
					<button className="main-action-btn" onClick={() => setView("review")}>
						{txt("reviewBtn")}
					</button>
				</div>
			)}

			{view === "review" && (
				<div className="review-section">
					<h2>{txt("availableForms")}</h2>
					<div className="form-list">
						{availableForms.map((form) => (
							<Link
								key={form.id}
								to={theme.id === "pha" ? `/pha/${form.path}` : `/${form.path}`}
								className="form-link-card"
							>
								{form.title[currentLang]}
							</Link>
						))}
					</div>
					<button className="back-btn" onClick={() => setView("main")}>
						{txt("backBtn")}
					</button>
				</div>
			)}

			{view === "create" && (
				<div className="create-section">
					{!generatedFormCode ? (
						<>
							<input
								type="text"
								value={newFormName}
								onChange={(e) => setNewFormName(e.target.value)}
								placeholder={txt("enterName")}
								className="name-input"
							/>
							<button
								className="generate-btn"
								onClick={generateCode}
								disabled={!newFormName}
							>
								{txt("generate")}
							</button>
						</>
					) : (
						<div className="code-display">
							<p>{txt("codeInstructions")}</p>

							<div className="code-block">
								<h3>
									{txt("formFile")}:{" "}
									<code>
										src/forms/{newFormName.replace(/\s+/g, "")}Form.js
									</code>
								</h3>
								<textarea
									readOnly
									value={generatedFormCode}
									rows={15}
									className="code-textarea"
								/>
								<button
									className="copy-btn"
									onClick={() =>
										navigator.clipboard.writeText(generatedFormCode)
									}
								>
									{txt("copyCode")}
								</button>
							</div>

							<div className="code-block">
								<h3>
									{txt("pageFile")}:{" "}
									<code>
										src/pages/{newFormName.replace(/\s+/g, "")}FormPage.jsx
									</code>
								</h3>
								<textarea
									readOnly
									value={generatedPageCode}
									rows={15}
									className="code-textarea"
								/>
								<button
									className="copy-btn"
									onClick={() =>
										navigator.clipboard.writeText(generatedPageCode)
									}
								>
									{txt("copyCode")}
								</button>
							</div>

							<div className="code-actions">
								<button
									className="reset-btn"
									onClick={() => {
										setGeneratedFormCode("");
										setGeneratedPageCode("");
										setNewFormName("");
									}}
								>
									{txt("backBtn")}
								</button>
							</div>
						</div>
					)}
					{!generatedFormCode && (
						<button className="back-btn" onClick={() => setView("main")}>
							{txt("backBtn")}
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default HomePage;
