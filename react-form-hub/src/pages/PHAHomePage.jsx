import { Link, useOutletContext } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { formRegistry } from "../config/formRegistry";

const PHAHomePage = () => {
	const { currentLang, toggleLanguage } = useOutletContext();
	const theme = useTheme();

	// Filter forms by PHA theme
	const availableForms = formRegistry.filter((form) =>
		form.themes.includes("pha"),
	);

	const translations = {
		title: {
			en: "PHA Form Hub",
			ar: "مركز نماذج PHA",
		},
		subtitle: {
			en: "Select a form to get started",
			ar: "اختر نموذجاً للبدء",
		},
		availableForms: {
			en: "Available Forms",
			ar: "النماذج المتاحة",
		},
	};

	return (
		<div className="pha-home-page">
			{/* PHA Top Header Bar */}
			<div className="pha-top-header">
				<button className="pha-lang-toggle" onClick={toggleLanguage}>
					{currentLang === "ar" ? "English" : "العربية"}
				</button>
				<div className="pha-logo">
					<img src={theme.logo.path} alt={theme.logo.alt} />
				</div>
			</div>

			<div className="pha-container">
				{/* PHA Header */}
				<div className="pha-header">
					<h1 className="pha-title">{translations.title[currentLang]}</h1>
					<p className="pha-subtitle">{translations.subtitle[currentLang]}</p>
				</div>

				{/* Forms List */}
				<div className="pha-forms-section">
					<h2 className="pha-section-title">
						{translations.availableForms[currentLang]}
					</h2>
					<div className="pha-form-list">
						{availableForms.map((form) => (
							<Link
								key={form.id}
								to={`/pha/${form.path}`}
								className="pha-form-card"
							>
								<div className="pha-form-icon">
									<svg
										width="24"
										height="24"
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
								<div className="pha-form-content">
									<h3 className="pha-form-title">{form.title[currentLang]}</h3>
									<span className="pha-form-arrow">→</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PHAHomePage;
