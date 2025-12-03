import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const HubLayout = () => {
	const theme = useTheme();
	const [currentLang, setCurrentLang] = useState(() => {
		return localStorage.getItem("localization") || "en";
	});

	const toggleLanguage = () => {
		const newLang = currentLang === "ar" ? "en" : "ar";
		setCurrentLang(newLang);
		localStorage.setItem("localization", newLang);

		// Update stylesheet
		const stylesheet = document.getElementById("formsmd-stylesheet");
		if (stylesheet) {
			if (newLang === "ar") {
				stylesheet.href = "/formsmd.rtl.min.css";
			} else {
				stylesheet.href = "/formsmd.min.css";
			}
		}

		// Reload the page to apply new language
		window.location.reload();
	};

	useEffect(() => {
		// Update document direction based on language
		document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
		document.documentElement.lang = currentLang;
	}, [currentLang]);

	// Determine root path based on theme
	const rootPath = theme.id === "pha" ? "/pha" : "/";
	const location = useLocation();
	const isHomePage = location.pathname === "/" || location.pathname === "/pha";

	return (
		<div className="hub-layout">
			{/* Logo - Hidden on home pages */}
			{!isHomePage && (
				<div className="logo">
					<Link to={rootPath}>
						<img src={theme.logo.path} alt={theme.logo.alt} />
					</Link>
				</div>
			)}

			{/* Language Toggle - Hidden on home pages */}
			{!isHomePage && (
				<button className="lang-toggle" onClick={toggleLanguage}>
					{currentLang === "ar" ? "English" : "العربية"}
				</button>
			)}

			{/* Main content area where forms will render */}
			<main className={isHomePage ? "home-main-container" : "form-container"}>
				<Outlet context={{ currentLang, toggleLanguage }} />
			</main>
		</div>
	);
};

export default HubLayout;
