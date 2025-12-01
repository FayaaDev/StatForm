import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import FormRenderer from "../components/FormRenderer";
import { createBurnoutSurveyComposer } from "../forms/BurnoutSurvey.js";
import { getFormOptions } from "../forms/formUtils.js";
import { useTheme } from "../contexts/ThemeContext";

import FormProgressBar from "../components/FormProgressBar";
import { useFormController } from "../hooks/useFormController.js";

const BurnoutSurveyPage = () => {
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
        formId: "burnout-survey-container",
        currentLang
    });

    useEffect(() => {
        const newComposer = createBurnoutSurveyComposer(currentLang, theme);
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
                    id="burnout-survey-container"
                    onMount={setFormInstance}
                />
            </div>
        </>
    );
};

export default BurnoutSurveyPage;
