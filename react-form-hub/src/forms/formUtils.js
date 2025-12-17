// Google Apps Script Web App URL
export const GOOGLE_SCRIPT_URL =
	"https://script.google.com/macros/s/AKfycbwNyLO_fWiudzmMVmU6OEaPI2PAjGWlV0kU8nd_QsmNjrFL2fidoRiGIfJ8QqA325osRQ/exec";

/**
 * Get shared form configuration for Composer
 * @param {string} localization - Language code
 * @param {Object} theme - Theme object from ThemeContext
 * @returns {Object} Shared configuration
 */
export function getSharedFormConfig(localization = "en", theme) {
	return {
		formStyle: "conversational",
		fontSize: "lg",
		rounded: "pill",
		restartButton: "show",
		buttonAlignment: "end",
		paddingInlineBottom: 40,
		paddingInlineTop: 50,
		colorScheme: "light",
		accent: theme.colors.accent,
		accentForeground: theme.colors.foreground,
		backgroundColor: theme.colors.background,
		color: theme.colors.text,
		localization: localization,
		dir: localization === "ar" ? "rtl" : "ltr",
	};
}

/**
 * Get form options with callbacks for FormRenderer
 * @param {string} localization - Language code
 * @param {Object} theme - Theme object from ThemeContext
 * @returns {Object} Form options
 */
export function getFormOptions(localization = "en", theme) {
	return {
		colorScheme: "light",
		formsmdBranding: "hide",
		fontSize: "lg",
		restartButton: "show",
		slideControls: "show",
		pageProgress: "show",
		paddingInlineBottom: 40,
		paddingInlineTop: 150,
		accent: theme.colors.accent,
		accentForeground: theme.colors.foreground,
		backgroundColor: theme.colors.background,
		color: theme.colors.text,
		onSubmit: (data) => {
			console.log("Form submitted - data object:", data);
			console.log("Form submitted - JSON:", JSON.stringify(data, null, 2));
			alert(
				localization === "ar"
					? "تم إرسال النموذج بنجاح! تحقق من جدول Google الخاص بك."
					: "Form submitted successfully! Check your Google Sheet.",
			);
		},
		onSubmitError: (error) => {
			console.error("Submission error:", error);
			alert(
				localization === "ar"
					? "خطأ في إرسال النموذج. تحقق من وحدة التحكم للحصول على التفاصيل."
					: "Error submitting form. Check console for details.",
			);
		},
	};
}
