import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import FormProgressBar from "../components/FormProgressBar";
import { createChestPainHistoryFormComposer } from "../forms/ChestPain.js";
import { getFormOptions } from "../forms/formUtils.js";
import { useFormController } from "../hooks/useFormController.js";
import { useTheme } from "../contexts/ThemeContext";
import { generatePatientStory } from "../utils/gemini.js";

const ChestPainPage = () => {
	const { currentLang } = useOutletContext();
	const theme = useTheme();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	// Initialize the form controller
	const {
		formInstance,
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide
	} = useFormController({
		formId: "chest-pain-history-form-container",
		currentLang,
		hotkeys: {
			y: { en: "Yes", ar: "نعم" },
			n: { en: "No", ar: "لا" },
		},
		onLastSlideNext: (e, lastSlide) => {
			const msgId = "form-completion-message";
			let msgDiv = document.getElementById(msgId);

			if (!msgDiv && lastSlide) {
				msgDiv = document.createElement("div");
				msgDiv.id = msgId;
				msgDiv.style.cssText = "margin-top: 15px; padding: 15px; background-color: #cff4fc; color: #055160; border: 1px solid #b6effb; border-radius: 4px; text-align: center; width: 100%; font-weight: bold;";
				lastSlide.appendChild(msgDiv);
			}

			if (msgDiv) {
				msgDiv.innerText = "The form has concluded, don't forget to clear out patient data";
				msgDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}
	});

	useEffect(() => {
		const newComposer = createChestPainHistoryFormComposer(currentLang, theme);
		const newOptions = {
			...getFormOptions(currentLang, theme),
			postUrl: null,
			restartButton: "hide",
			thankYouScreenTitle: "",
			thankYouScreenDescription: "",
		};

		setComposer(newComposer);
		setOptions(newOptions);
	}, [currentLang, theme]);

	const handleGenerateStory = async () => {
		if (!formInstance) return;

		const btn = document.getElementById("btn-generate-story");
		const resultDiv = document.getElementById("story-result");

		if (!btn || !resultDiv) return;

		const originalText = btn.innerText;
		const loadingText = btn.getAttribute("data-loading-text");

		try {
			btn.disabled = true;
			btn.innerText = loadingText;
			resultDiv.style.display = "none";
			resultDiv.innerText = "";

			const formData = formInstance.state.formData;
			const story = await generatePatientStory(formData);

			resultDiv.innerText = story;
			resultDiv.style.display = "block";

			const copyBtn = document.getElementById("btn-copy-story");
			if (copyBtn) {
				copyBtn.style.display = "inline-block";
				copyBtn.innerText = currentLang === "ar" ? "نسخ" : "Copy";
			}
		} catch (error) {
			console.error("Story generation failed:", error);
			alert(currentLang === "ar" ? "فشل توليد القصة. يرجى المحاولة مرة أخرى." : "Failed to generate story. Please try again.");
		} finally {
			btn.disabled = false;
			btn.innerText = originalText;
		}
	};

	const handleCopyStory = () => {
		const resultDiv = document.getElementById("story-result");
		const copyBtn = document.getElementById("btn-copy-story");
		if (!resultDiv) return;

		const textToCopy = resultDiv.innerText;
		navigator.clipboard.writeText(textToCopy).then(() => {
			const originalText = copyBtn.innerText;
			copyBtn.innerText = currentLang === "ar" ? "تم النسخ!" : "Copied!";
			setTimeout(() => {
				copyBtn.innerText = originalText;
			}, 2000);
		}).catch(err => {
			console.error("Failed to copy text: ", err);
		});
	};

	const handleClearData = () => {
		const modal = document.getElementById("clear-data-modal");
		if (modal) {
			modal.style.display = "flex";
		}
	};

	const handleModalCancel = () => {
		const modal = document.getElementById("clear-data-modal");
		if (modal) {
			modal.style.display = "none";
		}
	};

	const handleModalConfirm = () => {
		Object.keys(localStorage).forEach(key => {
			if (key.startsWith("formsmd:chest-pain-history-form")) {
				localStorage.removeItem(key);
			}
		});

		Object.keys(sessionStorage).forEach(key => {
			if (key.startsWith("formsmd:chest-pain-history-form")) {
				sessionStorage.removeItem(key);
			}
		});

		window.location.reload();
	};

	const handleContainerClick = (e) => {
		const target = e.target;
		if (!target) return;

		if (target.id === "btn-generate-story" || target.closest("#btn-generate-story")) {
			handleGenerateStory();
		} else if (target.id === "btn-copy-story") {
			handleCopyStory();
		} else if (target.id === "btn-clear-data") {
			handleClearData();
		} else if (target.id === "btn-modal-cancel") {
			handleModalCancel();
		} else if (target.id === "btn-modal-confirm") {
			handleModalConfirm();
		}
	};

	if (!composer || !options) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={slides.length}
				excludeStart={1}
				excludeEnd={1}
				onStepClick={jumpToSlide}
				currentLang={currentLang}
			/>

			<div
				onClick={handleContainerClick}
				{...containerProps}
			>
				<FormRenderer
					composer={composer}
					options={options}
					id="chest-pain-history-form-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default ChestPainPage;
