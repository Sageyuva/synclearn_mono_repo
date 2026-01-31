import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
    return (
        <div
            className={`
        glass-card rounded-xl p-6 
        border border-white/10
        ${hover ? 'hover:border-emerald-500/50 transition-all duration-300' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
