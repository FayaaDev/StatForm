import { createContext, useContext, useEffect } from "react";
import { getTheme } from "../config/themes";
import { loadFont } from "../utils/fontLoader";

const ThemeContext = createContext(null);

export function ThemeProvider({ theme: themeId, children }) {
	const theme = getTheme(themeId);

	useEffect(() => {
		// Set CSS custom properties on document root
		const root = document.documentElement;

		root.style.setProperty("--theme-primary", theme.colors.primary);
		root.style.setProperty("--theme-accent", theme.colors.accent);
		root.style.setProperty("--theme-text", theme.colors.text);
		root.style.setProperty("--theme-background", theme.colors.background);
		root.style.setProperty("--theme-foreground", theme.colors.foreground);
		root.style.setProperty("--theme-font-family", theme.font.family);

		// Load custom font if specified
		loadFont(theme.font);

		// Apply font family to body
		document.body.style.fontFamily = theme.font.family;
	}, [theme]);

	return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
