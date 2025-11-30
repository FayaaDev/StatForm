import { useOutletContext } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import FormRenderer from "../components/FormRenderer";
import { createNeurologyHistoryFormComposer } from "../forms/NeurologyHistoryForm.js";
import { getFormOptions } from "../forms/formUtils.js";
import { useFormController } from "../hooks/useFormController.js";

import { generatePatientStory } from "../utils/gemini.js";

const NeurologyHistoryFormPage = () => {
    const { currentLang } = useOutletContext();
    const [composer, setComposer] = useState(null);
    const [options, setOptions] = useState(null);
    const observerRef = useRef(null);

    const [slideCount, setSlideCount] = useState(0);

    // Helper for translation
    const translate = (lang, obj) => obj[lang] || obj['en'];

    // Initialize the form controller
    const { formInstance, setFormInstance, containerProps } = useFormController({
        formId: "neurology-history-form-container",
        currentLang,
        hotkeys: {
            m: { en: "Maybe", ar: "ربما" },
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
        const newComposer = createNeurologyHistoryFormComposer(currentLang);
        const newOptions = {
            ...getFormOptions(currentLang),
            // Disable form submission since this is a template generator, not a submittable form
            postUrl: null,
            // Disable restart button on final slide
            restartButton: "hide",
            // Disable thank you message
            thankYouScreenTitle: "",
            thankYouScreenDescription: "",
        };

        setComposer(newComposer);
        setOptions(newOptions);
    }, [currentLang]);

    // Monitor slide changes and update circular progress
    useEffect(() => {
        if (!formInstance) return;

        const container = formInstance.container;
        if (!container) return;

        // Initial update
        setTimeout(() => {
            const slides = Array.from(container.querySelectorAll(".fmd-slide"));
            setSlideCount(Math.max(0, slides.length - 2)); // Exclude header slide and generate story slide

            const activeSlide = container.querySelector(".fmd-slide.fmd-slide-active");
            if (activeSlide) {
                const currentIndex = slides.indexOf(activeSlide);
                if (currentIndex !== -1) {
                    updateCircularProgress(currentIndex);
                }
            }
        }, 500);

        // Watch for slide changes
        observerRef.current = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('fmd-slide') && target.classList.contains('fmd-slide-active')) {
                        const slides = Array.from(container.querySelectorAll(".fmd-slide"));
                        const currentIndex = slides.indexOf(target);
                        if (currentIndex !== -1) {
                            updateCircularProgress(currentIndex);
                        }
                    }
                }
            });
        });

        const slides = container.querySelectorAll(".fmd-slide");
        slides.forEach(slide => {
            observerRef.current.observe(slide, {
                attributes: true,
                attributeFilter: ['class']
            });
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [formInstance]);

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

            // Get form data from the instance
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
        window.location.reload();
    };

    // Event delegation for the button since it's injected as raw HTML
    const handleProgressCircleClick = (circleIndex) => {
        if (!formInstance) return;

        const slides = formInstance.container.querySelectorAll(".fmd-slide");
        // +1 because the first slide (index 0) is the header, so circle 0 maps to slide 1
        const targetSlide = slides[circleIndex + 1];

        if (!targetSlide) return;

        // Get current active slide
        const currentSlide = formInstance.container.querySelector(".fmd-slide.fmd-slide-active");

        if (currentSlide === targetSlide) return; // Already on this slide

        // Remove active class from current slide
        if (currentSlide) {
            currentSlide.classList.remove("fmd-slide-active");
        }

        // Add active class to target slide
        targetSlide.classList.add("fmd-slide-active");

        // Update the form instance state and trigger all necessary updates
        formInstance.hasNewActiveSlide(targetSlide, circleIndex + 1, false);

        // Update the circular progress indicator
        updateCircularProgress(circleIndex + 1);
    };

    const updateCircularProgress = (currentSlideIndex) => {
        const circles = document.querySelectorAll(".progress-circle");
        const progressBarFill = document.getElementById("progress-bar-fill");
        const progressContainer = document.getElementById("progress-scroll-container");
        const totalCircles = circles.length;

        // Map slide index to circle index (slide 0 = header = -1 circle index)
        const currentCircleIndex = currentSlideIndex - 1;

        circles.forEach((circle, index) => {
            // Reset inline styles that might interfere with classes
            circle.style.background = "";
            circle.style.color = "";
            circle.style.borderColor = "";
            circle.style.transform = "";

            if (index === currentCircleIndex) {
                // Active circle
                circle.classList.add("active");
                circle.classList.remove("completed");

                // Scroll the active circle into view
                if (progressContainer) {
                    const circleLeft = circle.offsetLeft;
                    const circleWidth = circle.offsetWidth;
                    const containerWidth = progressContainer.offsetWidth;

                    // Calculate the position to center the circle
                    const targetScroll = circleLeft - (containerWidth / 2) + (circleWidth / 2);

                    progressContainer.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                }
            } else if (index < currentCircleIndex) {
                // Completed circles
                circle.classList.add("completed");
                circle.classList.remove("active");
            } else {
                // Upcoming circles
                circle.classList.remove("active", "completed");
            }
        });

        // Update progress bar fill
        if (progressBarFill) {
            // If we are at header (currentCircleIndex = -1), width is 0
            // If we are at first question (currentCircleIndex = 0), width is 0% (start of bar)
            // If we are at last question (currentCircleIndex = totalCircles - 1), width is 100%

            let percentage = 0;
            if (currentCircleIndex >= 0) {
                percentage = (currentCircleIndex / (totalCircles - 1)) * 100;
            }

            progressBarFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
        }
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
        // Note: progress circle click is now handled directly by React onClick
    };

    if (!composer || !options) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* step Progress Bar */}
            <style>
                {`
                #circular-progress-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 900;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(8px);
                    border-bottom: 1px solid #e0e0e0;
                    padding: 15px 140px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                }

                #progress-scroll-container {
                    width: 100%;
                    max-width: calc(100% - 120px); /* Adjust for arrows */
                    margin: 0 10px;
                    overflow-x: auto;
                    padding: 10px 20px;
                    scroll-behavior: smooth;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                }

                #progress-scroll-container::-webkit-scrollbar {
                    display: none; /* Chrome, Safari and Opera */
                }

                .nav-arrow {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    color: #09595c;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease, opacity 0.2s;
                    opacity: 0.7;
                }

                .nav-arrow:hover {
                    transform: scale(1.1);
                    opacity: 1;
                }

                .nav-arrow svg {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }

                .progress-track {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 12px;
                    width: max-content;
                    min-width: 100%;
                    padding: 5px 0;
                }

                .progress-line-bg {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #e0e0e0;
                    transform: translateY(-50%);
                    z-index: 1;
                    border-radius: 2px;
                }

                #progress-bar-fill {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    height: 3px;
                    background: #09595c;
                    transform: translateY(-50%);
                    z-index: 2;
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                }

                .progress-circle {
                    position: relative;
                    z-index: 3;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: white;
                    border: 2px solid #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                    user-select: none;
                }

                .progress-circle.active {
                    border-color: #09595c;
                    color: #09595c;
                    background-color: #f0f9f9;
                }

                .progress-circle.completed {
                    background-color: #09595c;
                    border-color: #09595c;
                    color: white;
                }

                .progress-circle:hover {
                    transform: scale(1.1);
                    border-color: #09595c;
                    box-shadow: 0 2px 5px rgba(9, 89, 92, 0.2);
                }
                `}
            </style>
            <div id="circular-progress-nav">
                <button
                    className="nav-arrow"
                    onClick={() => {
                        const container = document.getElementById('progress-scroll-container');
                        if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                    }}
                    aria-label="Scroll left"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                </button>

                <div id="progress-scroll-container">
                    <div className="progress-track">
                        <div className="progress-line-bg"></div>
                        <div id="progress-bar-fill"></div>
                        {Array.from({ length: slideCount }).map((_, index) => (
                            <div
                                key={index}
                                className="progress-circle"
                                data-slide-index={index}
                                title={translate(currentLang, { en: `Question ${index + 1}`, ar: `السؤال ${index + 1}` })}
                                onClick={() => handleProgressCircleClick(index)}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="nav-arrow"
                    onClick={() => {
                        const container = document.getElementById('progress-scroll-container');
                        if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                    }}
                    aria-label="Scroll right"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </button>
            </div>

            <div
                onClick={handleContainerClick}
                {...containerProps}
            >
                <FormRenderer
                    composer={composer}
                    options={options}
                    id="neurology-history-form-container"
                    onMount={setFormInstance}
                />
            </div>
        </>
    );
};

export default NeurologyHistoryFormPage;
