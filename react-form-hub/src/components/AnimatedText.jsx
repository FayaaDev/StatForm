import React from 'react';

const AnimatedText = ({ text, className = "", delay = 0, tag = "span" }) => {
    const Tag = tag;

    // Split text into words first to handle spacing correctly
    const words = text.split(" ");

    return (
        <Tag className={`animated-text-wrapper ${className}`} style={{ display: 'inline-block' }}>
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
