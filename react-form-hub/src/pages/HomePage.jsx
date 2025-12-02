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
		nav: {
			home: { en: "Home", ar: "الرئيسية" },
			faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
			getStarted: { en: "Get Started", ar: "ابدأ الآن" },
		},
		hero: {
			title: { en: "StatForm", ar: "ستات فورم" },
			subtitle: {
				en: "Quick Documentation for Modern Physicians",
				ar: "توثيق سريع للأطباء المعاصرين",
			},
			description: {
				en: "Transform your clinical documentation with intelligent forms designed for medical professionals. Save time, improve accuracy, and focus on patient care.",
				ar: "حوّل توثيقك السريري مع نماذج ذكية مصممة للمهنيين الطبيين. وفّر الوقت، حسّن الدقة، وركّز على رعاية المرضى.",
			},
		},
		footer: {
			tagline: {
				en: "Empowering physicians with intelligent documentation tools",
				ar: "تمكين الأطباء بأدوات توثيق ذكية",
			},
			copyright: {
				en: "All rights reserved",
				ar: "جميع الحقوق محفوظة",
			},
			links: {
				title: { en: "Quick Links", ar: "روابط سريعة" },
				privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
				terms: { en: "Terms of Service", ar: "شروط الخدمة" },
				contact: { en: "Contact Us", ar: "اتصل بنا" },
			},
			product: {
				title: { en: "Product", ar: "المنتج" },
				features: { en: "Features", ar: "المميزات" },
				pricing: { en: "Pricing", ar: "الأسعار" },
				docs: { en: "Documentation", ar: "التوثيق" },
			},
		},
		features: {
			title: { en: "Built for Medical Excellence", ar: "مصمم للتميز الطبي" },
			specialty: {
				title: { en: "Specialty-Ready Forms", ar: "نماذج جاهزة للتخصص" },
				desc: {
					en: "Pre-built forms tailored to your medical specialty with clinical accuracy.",
					ar: "نماذج مسبقة الصنع مصممة لتخصصك الطبي بدقة سريرية.",
				},
			},
			keyboard: {
				title: { en: "Keyboard Navigation", ar: "التنقل بلوحة المفاتيح" },
				desc: {
					en: "Lightning-fast data entry with keyboard shortcuts. Document faster than ever.",
					ar: "إدخال بيانات سريع مع اختصارات لوحة المفاتيح. وثّق أسرع من أي وقت.",
				},
			},
			ai: {
				title: { en: "AI Story Generation", ar: "توليد القصة بالذكاء الاصطناعي" },
				desc: {
					en: "Transform form data into comprehensive clinical narratives automatically.",
					ar: "حوّل بيانات النماذج إلى سرديات سريرية شاملة تلقائياً.",
				},
			},
		},
		cta: {
			explore: { en: "Explore Forms", ar: "استكشف النماذج" },
			create: { en: "Create Custom Form", ar: "أنشئ نموذجاً مخصصاً" },
		},
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
			{/* Navigation Header */}
			<header className="site-header">
				<div className="header-container">
					<div className="header-logo">
						<img src={theme.logo.path} alt={theme.logo.alt} />
						<span className="logo-text">{translations.hero.title[currentLang]}</span>
					</div>
					<nav className="header-nav">
						<a href="#home" className="nav-item active">
							{translations.nav.home[currentLang]}
						</a>
						<a href="#faq" className="nav-item">
							{translations.nav.faq[currentLang]}
						</a>
						<button
							className="nav-cta"
							onClick={() => setView("review")}
						>
							{translations.nav.getStarted[currentLang]}
						</button>
					</nav>
				</div>
			</header>

			{view === "main" && (
				<>
					{/* Hero Section */}
					<div className="hero-section">
						<div className="hero-badge">
							<span className="badge-icon">⚡</span>
							<span>{translations.hero.title[currentLang]}</span>
						</div>
						<h1 className="hero-title">
							{translations.hero.subtitle[currentLang]}
						</h1>
						<p className="hero-description">
							{translations.hero.description[currentLang]}
						</p>

						{/* CTA Buttons */}
						<div className="hero-actions">
							<button className="cta-primary" onClick={() => setView("review")}>
								<span>{translations.cta.explore[currentLang]}</span>
								<svg
									width="20"
									height="20"
									viewBox="0 0 20 20"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M7.5 15L12.5 10L7.5 5"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>
							<button className="cta-secondary" onClick={() => setView("create")}>
								{translations.cta.create[currentLang]}
							</button>
						</div>
					</div>

					{/* Features Grid */}
					<div className="features-section">
						<h2 className="features-title">
							{translations.features.title[currentLang]}
						</h2>
						<div className="features-grid">
							<div className="feature-card">
								<div className="feature-icon">
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="4"
											y="4"
											width="24"
											height="24"
											rx="4"
											stroke="currentColor"
											strokeWidth="2"
										/>
										<path
											d="M10 12H22M10 16H22M10 20H18"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</div>
								<h3 className="feature-title">
									{translations.features.specialty.title[currentLang]}
								</h3>
								<p className="feature-description">
									{translations.features.specialty.desc[currentLang]}
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="6"
											y="8"
											width="20"
											height="16"
											rx="2"
											stroke="currentColor"
											strokeWidth="2"
										/>
										<rect
											x="10"
											y="12"
											width="3"
											height="3"
											rx="1"
											fill="currentColor"
										/>
										<rect
											x="14"
											y="12"
											width="3"
											height="3"
											rx="1"
											fill="currentColor"
										/>
										<rect
											x="18"
											y="12"
											width="3"
											height="3"
											rx="1"
											fill="currentColor"
										/>
									</svg>
								</div>
								<h3 className="feature-title">
									{translations.features.keyboard.title[currentLang]}
								</h3>
								<p className="feature-description">
									{translations.features.keyboard.desc[currentLang]}
								</p>
							</div>

							<div className="feature-card">
								<div className="feature-icon">
									<svg
										width="32"
										height="32"
										viewBox="0 0 32 32"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<circle
											cx="16"
											cy="16"
											r="10"
											stroke="currentColor"
											strokeWidth="2"
										/>
										<path
											d="M16 12L18 16H14L16 12Z"
											fill="currentColor"
										/>
										<circle cx="16" cy="19" r="1" fill="currentColor" />
									</svg>
								</div>
								<h3 className="feature-title">
									{translations.features.ai.title[currentLang]}
								</h3>
								<p className="feature-description">
									{translations.features.ai.desc[currentLang]}
								</p>
							</div>
						</div>
					</div>
				</>
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

			{/* Footer */}
			<footer className="site-footer">
				<div className="footer-container">
					<div className="footer-main">
						<div className="footer-brand">
							<div className="footer-logo">
								<img src={theme.logo.path} alt={theme.logo.alt} />
								<span className="footer-logo-text">
									{translations.hero.title[currentLang]}
								</span>
							</div>
							<p className="footer-tagline">
								{translations.footer.tagline[currentLang]}
							</p>
						</div>

						<div className="footer-links-group">
							<div className="footer-column">
								<h4>{translations.footer.product.title[currentLang]}</h4>
								<ul>
									<li>
										<a href="#features">
											{translations.footer.product.features[currentLang]}
										</a>
									</li>
									<li>
										<a href="#pricing">
											{translations.footer.product.pricing[currentLang]}
										</a>
									</li>
									<li>
										<a href="#docs">
											{translations.footer.product.docs[currentLang]}
										</a>
									</li>
								</ul>
							</div>

							<div className="footer-column">
								<h4>{translations.footer.links.title[currentLang]}</h4>
								<ul>
									<li>
										<a href="#privacy">
											{translations.footer.links.privacy[currentLang]}
										</a>
									</li>
									<li>
										<a href="#terms">
											{translations.footer.links.terms[currentLang]}
										</a>
									</li>
									<li>
										<a href="#contact">
											{translations.footer.links.contact[currentLang]}
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="footer-bottom">
						<p className="footer-copyright">
							© {new Date().getFullYear()} {translations.hero.title[currentLang]}.{" "}
							{translations.footer.copyright[currentLang]}.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
