// Theme configuration for multi-theme support
// Each theme defines colors, fonts, and branding assets

export const themes = {
	personal: {
		id: "personal",
		name: {
			en: "Personal",
			ar: "شخصي",
		},
		colors: {
			primary: "#4D122F", // Dark burgundy/maroon
			accent: "#4D122F",
			text: "#2D0A1C", // Darker shade for text
			background: "#ffffff",
			foreground: "#ffffff",
		},
		font: {
			family: "Majalla",
			url: "/font/majalla.ttf", // Same font as PHA
		},
		logo: {
			path: "/MainLogo.png",
			alt: "Medical Forms Logo",
		},
	},
	pha: {
		id: "pha",
		name: {
			en: "PHA",
			ar: "PHA",
		},
		colors: {
			primary: "#09595C", // Existing teal
			accent: "#09595C",
			text: "#063E40",
			background: "#ffffff",
			foreground: "#ffffff",
		},
		font: {
			family: "Majalla",
			url: "/font/majalla.ttf",
		},
		logo: {
			path: "/logos/PHAlogo.png",
			alt: "PHA Logo",
		},
	},
};

// Helper to get theme by ID
export function getTheme(themeId) {
	return themes[themeId] || themes.personal;
}
