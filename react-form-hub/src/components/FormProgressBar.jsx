import React, { useEffect, useRef } from "react";

const FormProgressBar = ({
	currentSlideIndex,
	totalSlides,
	excludeStart = 0,
	excludeEnd = 0,
	onStepClick,
	currentLang = "en",
}) => {
	const scrollContainerRef = useRef(null);

	// Calculate the number of steps (circles) to show
	// If totalSlides is 0 or undefined, stepsCount is 0
	const stepsCount = Math.max(0, totalSlides - excludeStart - excludeEnd);

	// Calculate the active step index (0-based) relative to the steps shown
	// If currentSlideIndex is within the excluded start, it's -1 (or less)
	// If currentSlideIndex is within the excluded end, it's stepsCount (or more)
	const activeStepIndex = currentSlideIndex - excludeStart;

	// Helper for translation
	const translate = (lang, obj) => obj[lang] || obj["en"];

	const handleScroll = (direction) => {
		if (scrollContainerRef.current) {
			const scrollAmount = 200;
			// For RTL, flip the scroll direction
			const isRtl = currentLang === "ar";
			const actualDirection = isRtl 
				? (direction === "left" ? "right" : "left")
				: direction;
			
			scrollContainerRef.current.scrollBy({
				left: actualDirection === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	// Auto-scroll to active circle
	useEffect(() => {
		// Small delay to ensure DOM is ready
		const scrollTimeout = setTimeout(() => {
			if (
				activeStepIndex >= 0 &&
				activeStepIndex < stepsCount &&
				scrollContainerRef.current
			) {
				const circles =
					scrollContainerRef.current.querySelectorAll(".progress-circle");
				const activeCircle = circles[activeStepIndex];

				if (activeCircle) {
					const container = scrollContainerRef.current;
					const isRtl = currentLang === "ar";
					
					// Use scrollIntoView for better cross-browser support
					activeCircle.scrollIntoView({
						behavior: "smooth",
						block: "nearest",
						inline: "center"
					});
				}
			}
		}, 100);

		return () => clearTimeout(scrollTimeout);
	}, [activeStepIndex, stepsCount, currentLang]);

	if (stepsCount <= 0) return null;

	return (
		<>
			<style>
				{`
                #circular-progress-nav {
                    position: fixed;
                    top: 20px;
                    left: 200px;
                    right: 200px;
                    z-index: 900;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(8px);
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 10px 20px;
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
                    color: var(--theme-primary);
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
                    margin: 0 auto;
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
                    background: var(--theme-primary);
                    transform: translateY(-50%);
                    z-index: 2;
                    width: 0%;
                    transition: width 0.3s ease;
                    border-radius: 2px;
                }

                /* RTL Support for Arabic */
                [dir="rtl"] #progress-bar-fill {
                    left: auto;
                    right: 0;
                }

                [dir="rtl"] .progress-track {
                    direction: rtl;
                }

                [dir="rtl"] .nav-arrow svg {
                    transform: scaleX(-1);
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
                    border-color: var(--theme-primary);
                    color: var(--theme-primary);
                    background-color: #f0f9f9;
                }

                .progress-circle.completed {
                    background-color: var(--theme-primary);
                    border-color: var(--theme-primary);
                    color: white;
                }

                .progress-circle:hover {
                    transform: scale(1.1);
                    border-color: var(--theme-primary);
                    box-shadow: 0 2px 5px color-mix(in srgb, var(--theme-primary) 20%, transparent);
                }

                @media (max-width: 768px) {
                    #circular-progress-nav {
                        top: 90px;
                        left: 10px;
                        right: 10px;
                        padding: 6px 10px;
                    }

                    #progress-scroll-container {
                        max-width: calc(100% - 60px);
                        padding: 5px 10px;
                    }

                    .progress-track {
                        gap: 8px;
                    }

                    .progress-circle {
                        width: 26px;
                        height: 26px;
                        font-size: 10px;
                    }

                    .nav-arrow {
                        padding: 4px;
                    }

                    .nav-arrow svg {
                        width: 20px;
                        height: 20px;
                    }
                }
                `}
			</style>
			<div id="circular-progress-nav" dir={currentLang === "ar" ? "rtl" : "ltr"}>
				<button
					className="nav-arrow"
					onClick={() => handleScroll("left")}
					aria-label="Scroll left"
				>
					<svg viewBox="0 0 24 24">
						<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
					</svg>
				</button>

				<div id="progress-scroll-container" ref={scrollContainerRef}>
					<div className="progress-track">
						<div className="progress-line-bg"></div>
						<div
							id="progress-bar-fill"
							style={{
								width: `${Math.max(0, Math.min(100, (activeStepIndex / (stepsCount - 1)) * 100))}%`,
							}}
						></div>
						{Array.from({ length: stepsCount }).map((_, index) => {
							let statusClass = "";
							if (index === activeStepIndex) {
								statusClass = "active";
							} else if (index < activeStepIndex) {
								statusClass = "completed";
							}
							// If activeStepIndex is beyond the steps (e.g. last slide), all are completed
							if (activeStepIndex >= stepsCount) {
								statusClass = "completed";
							}

							return (
								<div
									key={index}
									className={`progress-circle ${statusClass}`}
									data-step-index={index}
									title={translate(currentLang, {
										en: `Question ${index + 1}`,
										ar: `السؤال ${index + 1}`,
									})}
									onClick={() =>
										onStepClick && onStepClick(index + excludeStart)
									}
								>
									{index + 1}
								</div>
							);
						})}
					</div>
				</div>

				<button
					className="nav-arrow"
					onClick={() => handleScroll("right")}
					aria-label="Scroll right"
				>
					<svg viewBox="0 0 24 24">
						<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
					</svg>
				</button>
			</div>
		</>
	);
};

export default FormProgressBar;
