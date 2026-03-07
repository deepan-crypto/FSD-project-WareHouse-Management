import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onClick,
    className = '',
    ...props
}) => {
    const buttonClass = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        loading && 'btn-loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClass}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="btn-spinner"></span>
            )}
            {!loading && leftIcon && (
                <span className="btn-icon-left">{leftIcon}</span>
            )}
            <span className="btn-text">{children}</span>
            {!loading && rightIcon && (
                <span className="btn-icon-right">{rightIcon}</span>
            )}
        </button>
    );
};

export default Button;
