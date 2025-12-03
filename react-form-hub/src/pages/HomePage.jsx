import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
	formRegistry,
	getFormsByThemeGrouped,
	medicalCategories,
} from "../config/formRegistry";
import AnimatedText from "../components/AnimatedText";
import Reveal from "../components/Reveal";

const HomePage = () => {
	const { currentLang, toggleLanguage } = useOutletContext();
	const theme = useTheme();
	const [view, setView] = useState("main"); // main, review, create
	const [newFormName, setNewFormName] = useState("");
	const [generatedFormCode, setGeneratedFormCode] = useState("");
	const [generatedPageCode, setGeneratedPageCode] = useState("");
	const [activeSection, setActiveSection] = useState("home");

	// Scroll listener to update active navigation
	useEffect(() => {
		if (view !== "main") {
			setActiveSection("home");
			return;
		}

		const handleScroll = () => {
			const faqSection = document.getElementById("faq");
			if (faqSection) {
				const faqTop = faqSection.offsetTop - 100;
				const scrollPosition = window.scrollY;
				
				if (scrollPosition >= faqTop) {
					setActiveSection("faq");
				} else {
					setActiveSection("home");
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [view]);

	// Filter forms by current theme
	const availableForms = formRegistry.filter((form) =>
		form.themes.includes(theme.id)
	);

	// Get forms grouped by category (for personal theme only)
	const groupedForms = theme.id === "personal" ? getFormsByThemeGrouped(theme.id) : null;

	const translations = {
		nav: {
			home: { en: "Home", ar: "الرئيسية" },
			faq: { en: "FAQ", ar: "الأسئلة الشائعة" },
			getStarted: { en: "Get Started", ar: "ابدأ الآن" },
		},
		hero: {
			badge: { en: "Free for Limited Time", ar: "مجاني لفترة محدودة" },
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
			privacy: {
				title: { en: "Data Privacy", ar: "أمان البيانات والخصوصية" },
				desc: {
					en: "Patient data stays on your device only. with a One-click clear button. We do not store any data.",
					ar: "بيانات المرضى تبقى على جهازك فقط. زر مسح بنقرة واحدة للتحكم الكامل.",
				},
			},
		},
		cta: {
			explore: { en: "Explore Forms", ar: "استكشف النماذج" },
			create: { en: "Create Custom Form", ar: "أنشئ نموذجاً مخصصاً" },
		},
		faq: {
			title: { en: "Frequently Asked Questions", ar: "الأسئلة الشائعة" },
			q1: {
				question: { en: "Why StatForm?", ar: "لماذا ستات فورم؟" },
				answer: {
					en: "StatForm revolutionizes clinical documentation by offering specialty-specific forms with keyboard shortcuts for rapid data entry. Built by physicians for physicians, it streamlines your workflow, reduces documentation time, and improves accuracy, allowing you to focus more on patient care rather than paperwork.",
					ar: "ستات فورم يُحدث ثورة في التوثيق السريري من خلال تقديم نماذج خاصة بالتخصص مع اختصارات لوحة المفاتيح لإدخال البيانات السريع. مصمم من قبل أطباء للأطباء، يبسط سير عملك، يقلل وقت التوثيق، ويحسن الدقة—مما يتيح لك التركيز أكثر على رعاية المرضى بدلاً من الأعمال الورقية."
				}
			},
			q2: {
				question: { 
					en: "What if the generated story is different from what I entered?", 
					ar: "ماذا لو كانت القصة المُولدة مختلفة عما توقعت؟" 
				},
				answer: {
					en: "We use state of the art AI models to make sure no data leak nor hallucinations occurs. The tool merely combines your entries, rather than coming up of its own.",
					ar: "السرد السريري المُولد بالذكاء الاصطناعي يعتمد على بيانات النموذج التي تقدمها. إذا كان الناتج مختلفاً عن توقعاتك، يمكنك إعادة توليد القصة أو تعديلها يدوياً لتتناسب مع حكمك السريري. الذكاء الاصطناعي يعمل كمساعد لتسريع التوثيق، لكنك تحتفظ بالسيطرة الكاملة وسلطة اتخاذ القرار السريري."
				}
			},
			q3: {
				question: { 
					en: "Do you save patient's data?", 
					ar: "هل تحفظون بيانات المرضى؟" 
				},
				answer: {
					en: "No. Patient data privacy is our top priority. All data remains exclusively on your device and is never transmitted to our servers or stored anywhere. We provide a one-click clear button for instant data removal. You have complete control over your patient information at all times.",
					ar: "لا. خصوصية بيانات المرضى هي أولويتنا القصوى. جميع البيانات تبقى حصرياً على جهازك ولا يتم نقلها أبداً إلى خوادمنا أو تخزينها في أي مكان. نوفر زر مسح بنقرة واحدة لإزالة البيانات فورياً. لديك السيطرة الكاملة على معلومات مرضاك في جميع الأوقات."
				}
			},
			q4: {
				question: { 
					en: "Why is it free?", 
					ar: "لماذا هو مجاني؟" 
				},
				answer: {
					en: "StatForm is currently free as part of our mission to improve healthcare documentation and support medical professionals. We believe better tools lead to better patient care. However, we may introduce premium features in the future.",
					ar: "ستات فورم مجاني حالياً كجزء من مهمتنا لتحسين توثيق الرعاية الصحية ودعم المهنيين الطبيين. نؤمن بأن الأدوات الأفضل تؤدي إلى رعاية أفضل للمرضى. بينما قد نقدم ميزات مدفوعة في المستقبل، ستبقى الوظائف الأساسية متاحة دائماً لمساعدة الأطباء في جميع أنحاء العالم على تقديم رعاية ممتازة."
				}
			}
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
					<Link to={theme.id === "pha" ? "/pha" : "/"} className="header-logo">
						<img src={theme.logo.path} alt={theme.logo.alt} />
						<span className="logo-text">{translations.hero.title[currentLang]}</span>
					</Link>
					<nav className="header-nav">
						<a 
							href="#home" 
							className={`nav-item ${view === 'main' && activeSection === 'home' ? 'active' : ''}`}
							onClick={(e) => {
								e.preventDefault();
								setView('main');
								window.scrollTo({ top: 0, behavior: 'smooth' });
							}}
						>
							{translations.nav.home[currentLang]}
						</a>
						<a 
							href="#faq" 
							className={`nav-item ${view === 'main' && activeSection === 'faq' ? 'active' : ''}`}
							onClick={(e) => {
								e.preventDefault();
								if (view !== 'main') {
									setView('main');
									setTimeout(() => {
										const faqSection = document.getElementById('faq');
										if (faqSection) {
											faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
										}
									}, 100);
								} else {
									const faqSection = document.getElementById('faq');
									if (faqSection) {
										faqSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
									}
								}
							}}
						>
							{translations.nav.faq[currentLang]}
						</a>
						<button className="header-lang-toggle" onClick={toggleLanguage}>
							{currentLang === "ar" ? "English" : "العربية"}
						</button>
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
						<Reveal delay={0.1}>
							<div className="hero-badge">
								<span className="badge-icon">🎉</span>
								<span>{translations.hero.badge[currentLang]}</span>
							</div>
						</Reveal>

						<h1 className="hero-title">
							<AnimatedText
								text={translations.hero.subtitle[currentLang]}
								delay={0.2}
							/>
						</h1>

						<Reveal delay={0.6}>
							<p className="hero-description">
								{translations.hero.description[currentLang]}
							</p>
						</Reveal>

						{/* CTA Buttons */}
						<Reveal delay={0.8}>
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
						</Reveal>
					</div>

					{/* Features Grid */}
					<div className="features-section">
						<Reveal delay={1.0}>
							<h2 className="features-title">
								{translations.features.title[currentLang]}
							</h2>
						</Reveal>
						<div className="features-grid">
							<Reveal delay={1.2}>
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
							</Reveal>

							<Reveal delay={1.4}>
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
							</Reveal>

							<Reveal delay={1.6}>
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
							</Reveal>

							<Reveal delay={1.8}>
								<div className="feature-card">
									<div className="feature-icon">
										<svg
											width="32"
											height="32"
											viewBox="0 0 32 32"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M16 4L6 9V15C6 21 10 26 16 28C22 26 26 21 26 15V9L16 4Z"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M16 12V16M16 20H16.01"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
									<h3 className="feature-title">
										{translations.features.privacy.title[currentLang]}
									</h3>
									<p className="feature-description">
										{translations.features.privacy.desc[currentLang]}
									</p>
								</div>
							</Reveal>
						</div>
					</div>

					{/* FAQ Section */}
					<div id="faq" className="faq-section">
						<Reveal delay={2.0}>
							<h2 className="faq-title">
								{translations.faq.title[currentLang]}
							</h2>
						</Reveal>
						<div className="faq-container">
							<Reveal delay={2.1}>
								<div className="faq-item">
									<h3 className="faq-question">
										{translations.faq.q1.question[currentLang]}
									</h3>
									<p className="faq-answer">
										{translations.faq.q1.answer[currentLang]}
									</p>
								</div>
							</Reveal>

							<Reveal delay={2.2}>
								<div className="faq-item">
									<h3 className="faq-question">
										{translations.faq.q2.question[currentLang]}
									</h3>
									<p className="faq-answer">
										{translations.faq.q2.answer[currentLang]}
									</p>
								</div>
							</Reveal>

							<Reveal delay={2.3}>
								<div className="faq-item">
									<h3 className="faq-question">
										{translations.faq.q3.question[currentLang]}
									</h3>
									<p className="faq-answer">
										{translations.faq.q3.answer[currentLang]}
									</p>
								</div>
							</Reveal>

							<Reveal delay={2.4}>
								<div className="faq-item">
									<h3 className="faq-question">
										{translations.faq.q4.question[currentLang]}
									</h3>
									<p className="faq-answer">
										{translations.faq.q4.answer[currentLang]}
									</p>
								</div>
							</Reveal>
						</div>
					</div>
				</>
			)}

			{view === "review" && (
				<div className="review-section">
					<h2 className="review-title">{txt("availableForms")}</h2>
					<p className="review-subtitle">
						{currentLang === "en"
							? "Select a specialty form to get started with clinical documentation"
							: "اختر نموذج التخصص للبدء في التوثيق السريري"}
					</p>

					{/* Show grouped forms for personal theme, ungrouped for others */}
					{groupedForms ? (
						<div className="specialty-categories">
							{Object.keys(medicalCategories).map((categoryId, catIndex) => {
								const categoryForms = groupedForms[categoryId];
								if (categoryForms.length === 0) {
									return null; // Don't show empty categories
								}

								return (
									<Reveal key={categoryId} delay={0.1 + catIndex * 0.15}>
										<div className="category-section">
											<h3 className="category-title">
												{medicalCategories[categoryId][currentLang]}
											</h3>
											<div className="form-list">
												{categoryForms.map((form, formIndex) => (
													<Reveal
														key={form.id}
														delay={0.2 + catIndex * 0.15 + formIndex * 0.05}
													>
														<Link
															to={
																theme.id === "pha"
																	? `/pha/${form.path}`
																	: `/${form.path}`
															}
															className="form-link-card"
														>
															<div className="form-card-icon">
																<svg
																	width="28"
																	height="28"
																	viewBox="0 0 24 24"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
																		stroke="currentColor"
																		strokeWidth="2"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																</svg>
															</div>
															<div className="form-card-content">
																<h3 className="form-card-title">
																	{form.title[currentLang]}
																</h3>
																<span className="form-card-arrow">→</span>
															</div>
														</Link>
													</Reveal>
												))}
											</div>
										</div>
									</Reveal>
								);
							})}
						</div>
					) : (
						<div className="form-list">
							{availableForms.map((form, index) => (
								<Reveal key={form.id} delay={0.1 + index * 0.1}>
									<Link
										to={
											theme.id === "pha" ? `/pha/${form.path}` : `/${form.path}`
										}
										className="form-link-card"
									>
										<div className="form-card-icon">
											<svg
												width="28"
												height="28"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
										<div className="form-card-content">
											<h3 className="form-card-title">
												{form.title[currentLang]}
											</h3>
											<span className="form-card-arrow">→</span>
										</div>
									</Link>
								</Reveal>
							))}
						</div>
					)}

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
							<a
								href="/FreeLanceCertificate.pdf"
								target="_blank"
								rel="noopener noreferrer"
								className="footer-certificate-link"
							>
								<img
									src="/FreeLanceLogo.png"
									alt="Freelance Certificate"
									className="footer-certificate-logo"
								/>
							</a>
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
