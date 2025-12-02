import React from 'react';

const Reveal = ({ children, className = "", delay = 0, duration = 0.8 }) => {
    return (
        <div
            className={`reveal-wrapper ${className}`}
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
