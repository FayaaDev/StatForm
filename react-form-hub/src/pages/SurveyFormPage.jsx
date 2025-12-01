import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { createSurveyFormComposer } from "../forms/SurveyForm";
import { getFormOptions } from "../forms/formUtils";
import { useTheme } from "../contexts/ThemeContext";

import FormProgressBar from "../components/FormProgressBar";
import { useFormController } from "../hooks/useFormController.js";

const SurveyFormPage = () => {
	const { currentLang } = useOutletContext();
	const theme = useTheme();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	const {
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide
	} = useFormController({
		formId: "survey-form-container",
		currentLang
	});

	useEffect(() => {
		// Create composer and options based on current language and theme
		const newComposer = createSurveyFormComposer(currentLang, theme);
		const newOptions = getFormOptions(currentLang, theme);

		setComposer(newComposer);
		setOptions(newOptions);
	}, [currentLang, theme]);

	if (!composer || !options) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<FormProgressBar
				currentSlideIndex={activeSlideIndex}
				totalSlides={slides.length}
				excludeStart={1}
				excludeEnd={0}
				onStepClick={jumpToSlide}
				currentLang={currentLang}
			/>
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="survey-form-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default SurveyFormPage;
