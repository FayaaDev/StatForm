import React, { useEffect, useRef, useState } from 'react';

const AnimatedText = ({ text, className = "", delay = 0, tag = "span", threshold = 0.1 }) => {
    const Tag = tag;
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    // Check if text contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(text);

    // Split text into words first to handle spacing correctly
    const words = text.split(" ");

    // For Arabic text, animate word-by-word instead of character-by-character
    // to preserve ligatures and proper text shaping
    if (hasArabic) {
        return (
            <Tag
                ref={ref}
                className={`animated-text-wrapper ${isVisible ? 'is-visible' : ''} ${className}`}
                style={{ display: 'inline-block' }}
            >
                {words.map((word, wordIndex) => {
                    const wordDelay = delay + (wordIndex * 0.1);
                    return (
                        <React.Fragment key={wordIndex}>
                            <span
                                className="animated-char"
                                style={{
                                    animationDelay: `${wordDelay}s`,
                                    display: 'inline-block',
                                    whiteSpace: 'nowrap',
                                    opacity: 0
                                }}
                            >
                                {word}
                            </span>
                            {wordIndex < words.length - 1 && (
                                <span style={{ display: 'inline-block' }}>&nbsp;</span>
                            )}
                        </React.Fragment>
                    );
                })}
            </Tag>
        );
    }

    // For non-Arabic text, use character-by-character animation
    return (
        <Tag
            ref={ref}
            className={`animated-text-wrapper ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{ display: 'inline-block' }}
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                    {word.split("").map((char, charIndex) => {
                        // Calculate delay based on position
                        // Base delay + word offset + char offset
                        const charDelay = delay + (wordIndex * 0.1) + (charIndex * 0.03);

                        return (
                            <span
                                key={charIndex}
                                className="animated-char"
                                style={{
                                    animationDelay: `${charDelay}s`,
                                    display: 'inline-block',
                                    opacity: 0 // Start invisible
                                }}
                            >
                                {char}
                            </span>
                        );
                    })}
                    {/* Add space after word unless it's the last word */}
                    {wordIndex < words.length - 1 && (
                        <span style={{ display: 'inline-block' }}>&nbsp;</span>
                    )}
                </span>
            ))}
        </Tag>
    );
};

export default AnimatedText;
