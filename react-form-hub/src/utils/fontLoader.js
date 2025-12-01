// Dynamic font loading utility
// Loads custom fonts only when needed for a specific theme

const loadedFonts = new Set();

export function loadFont(fontConfig) {
	// If no custom font URL, skip loading
	if (!fontConfig.url) {
		return;
	}

	// If already loaded, skip
	if (loadedFonts.has(fontConfig.url)) {
		return;
	}

	// Create @font-face rule dynamically
	const fontFamily = fontConfig.family.split(",")[0].trim().replace(/['"]/g, "");
	const fontFace = new FontFace(fontFamily, `url(${fontConfig.url})`);

	fontFace
		.load()
		.then((loaded) => {
			document.fonts.add(loaded);
			loadedFonts.add(fontConfig.url);
		})
		.catch((error) => {
			console.warn(`Failed to load font ${fontFamily}:`, error);
		});
}
