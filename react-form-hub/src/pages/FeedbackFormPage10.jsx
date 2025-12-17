import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { createFeedbackForm10Composer } from "../forms/FeedbackForm10";
import { getFormOptions } from "../forms/formUtils";
import { useTheme } from "../contexts/ThemeContext";

import FormProgressBar from "../components/FormProgressBar";
import { useFormController } from "../hooks/useFormController.js";

const FeedbackFormPage10 = () => {
	const { currentLang } = useOutletContext();
	const theme = useTheme();
	const [composer, setComposer] = useState(null);
	const [options, setOptions] = useState(null);

	const {
		setFormInstance,
		containerProps,
		activeSlideIndex,
		slides,
		jumpToSlide,
		maxVisitedSlideIndex
	} = useFormController({
		formId: "tool10_operations-container",
		currentLang
	});

	useEffect(() => {
		// Create composer and options based on current language and theme
		const newComposer = createFeedbackForm10Composer(currentLang, theme);
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
				maxVisitedSlideIndex={maxVisitedSlideIndex}
			/>
			<div {...containerProps}>
				<FormRenderer
					composer={composer}
					options={options}
					id="tool10_operations-container"
					onMount={setFormInstance}
				/>
			</div>
		</>
	);
};

export default FeedbackFormPage10;
