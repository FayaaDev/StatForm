import { useEffect, useState, useCallback } from 'react';

export const useFormController = ({
    formId,
    onMount,
    onLastSlideNext,
    hotkeys,
    currentLang = 'en'
}) => {
    const [formInstance, setFormInstance] = useState(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [slides, setSlides] = useState([]);

    // Handle form mount
    const handleMount = useCallback((instance) => {
        setFormInstance(instance);
        if (onMount) onMount(instance);
    }, [onMount]);

    // DOM Manipulation Logic (MutationObserver & Button Cleanup & Slide Tracking)
    useEffect(() => {
        if (!formInstance) return;

        const container = document.getElementById(formId);
        if (!container) return;

        const updateSlideState = () => {
            const allSlides = Array.from(container.querySelectorAll(".fmd-slide"));
            setSlides(allSlides);

            const activeSlide = container.querySelector(".fmd-slide.fmd-slide-active");
            if (activeSlide) {
                const index = allSlides.indexOf(activeSlide);
                if (index !== -1) {
                    setActiveSlideIndex(index);
                }
            }
        };

        const cleanupButtons = () => {
            // Check if we are on the last slide by checking if our custom button is visible
            // This assumes the consumer has injected a button with id="btn-generate-story"
            // If not, we might need a more generic way to detect the last slide, but for now this matches the specific use case
            const generateStoryBtn = container.querySelector("#btn-generate-story");

            // If the custom button doesn't exist or isn't visible, we likely aren't on the last slide
            if (!generateStoryBtn || generateStoryBtn.offsetParent === null) return;

            const lastSlide = generateStoryBtn.closest('.fmd-slide');
            const allButtons = container.querySelectorAll('button');

            allButtons.forEach(btn => {
                // Skip our custom buttons and modal buttons
                if (btn.id === 'btn-generate-story' ||
                    btn.closest('#btn-generate-story') ||
                    btn.id === 'btn-copy-story' ||
                    btn.id === 'btn-clear-data' ||
                    btn.closest('#clear-data-modal')) {
                    return;
                }

                const btnText = (btn.innerText || btn.textContent).toLowerCase();
                const isBackBtn = btnText.includes('back') || btnText.includes('السابق') || btn.classList.contains('fmd-btn-prev');

                // Handle "Next" buttons (text or arrow)
                const isNextBtn = btnText.includes('next') ||
                    btnText.includes('التالي') ||
                    btn.classList.contains('fmd-btn-next') ||
                    (!isBackBtn && (btn.querySelector('svg') || btn.closest('.fmd-next-controls')));

                if (isNextBtn) {
                    if (btn.dataset.customized === "true") return;

                    // If a custom handler is provided, replace the button
                    if (onLastSlideNext) {
                        const newBtn = btn.cloneNode(true);
                        newBtn.dataset.customized = "true";

                        newBtn.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            onLastSlideNext(e, lastSlide);
                        };

                        btn.parentNode.replaceChild(newBtn, btn);
                    } else {
                        // Default behavior if no handler: remove the button
                        btn.remove();
                    }
                }

                // Remove Submit buttons if any appear
                if (btn.getAttribute('type') === 'submit') {
                    btn.remove();
                }
            });

            // Remove thank you screens if they appear
            const thankYouScreens = container.querySelectorAll(".fmd-thank-you-screen");
            thankYouScreens.forEach(screen => screen.remove());
        };

        // Initial update
        setTimeout(() => {
            cleanupButtons();
            updateSlideState();
        }, 100);

        // Observer for dynamic changes
        const observer = new MutationObserver((mutations) => {
            cleanupButtons();

            // Check if slide changed
            let slideChanged = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('fmd-slide')) {
                        slideChanged = true;
                    }
                } else if (mutation.type === 'childList') {
                    // If slides are added/removed
                    if (mutation.target === container || mutation.target.closest('.fmd-slide')) {
                        slideChanged = true;
                    }
                }
            });

            if (slideChanged) {
                updateSlideState();
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        return () => {
            observer.disconnect();
        };
    }, [formInstance, formId, onLastSlideNext]);

    // Hotkey Logic
    useEffect(() => {
        if (!hotkeys) return;

        const handleKeyDown = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

            const key = e.key.toLowerCase();
            const action = hotkeys[key];

            if (action) {
                // Determine target text based on language if action is an object, or use directly if string
                const targetText = (typeof action === 'object' && action[currentLang]) ? action[currentLang] : action;

                const container = document.getElementById(formId);
                if (!container) return;

                const labels = Array.from(container.querySelectorAll(".fmd-form-check-label"));
                const targetLabel = labels.find((label) => {
                    const text = label.innerText || label.textContent;
                    return label.offsetParent !== null && text.toLowerCase().includes(targetText.toLowerCase());
                });

                if (targetLabel) {
                    const parent = targetLabel.closest(".fmd-form-check");
                    const input = parent ? parent.querySelector("input") : null;

                    if (input) {
                        input.click();
                        input.blur();
                    } else {
                        targetLabel.click();
                    }

                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown, true);
        return () => window.removeEventListener("keydown", handleKeyDown, true);
    }, [hotkeys, currentLang, formId]);

    // Input Event Propagation Stopper
    const handleInputKeyEvents = useCallback((e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
            e.stopPropagation();
        }
    }, []);

    const jumpToSlide = useCallback((index) => {
        if (!formInstance || !slides[index]) return;

        const targetSlide = slides[index];
        const currentSlide = slides[activeSlideIndex];

        if (currentSlide === targetSlide) return;

        if (currentSlide) {
            currentSlide.classList.remove("fmd-slide-active");
        }
        targetSlide.classList.add("fmd-slide-active");

        // Trigger internal form update
        // Note: 1-based index for formInstance logic usually, but let's check what we did before
        // Before: formInstance.hasNewActiveSlide(targetSlide, circleIndex + 1, false);
        // circleIndex + 1 was the slide index (since circle 0 -> slide 1)
        // So here we pass index (which is the actual slide index)
        formInstance.hasNewActiveSlide(targetSlide, index, false);

        setActiveSlideIndex(index);
    }, [formInstance, slides, activeSlideIndex]);

    return {
        formInstance,
        setFormInstance: handleMount,
        containerProps: {
            onKeyDown: handleInputKeyEvents,
            onKeyPress: handleInputKeyEvents,
            onKeyUp: handleInputKeyEvents
        },
        activeSlideIndex,
        slides,
        jumpToSlide
    };
};
