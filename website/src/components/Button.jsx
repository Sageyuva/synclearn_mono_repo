import React from 'react';

const Button = ({ children, variant = 'primary', onClick, className = '', type = 'button' }) => {
    const variants = {
        primary: 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-emerald-glow',
        secondary: 'bg-violet-500 hover:bg-violet-600 text-white hover:shadow-violet-glow',
        ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/20'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        px-4 py-2 rounded-lg font-medium
        transition-all duration-300
        hover:scale-105
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export default Button;
