import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, className = "", delay = 0, duration = 0.8, threshold = 0.1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
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

    return (
        <div
            ref={ref}
            className={`reveal-wrapper ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                opacity: 0 // Start invisible
            }}
        >
            {children}
        </div>
    );
};

export default Reveal;
