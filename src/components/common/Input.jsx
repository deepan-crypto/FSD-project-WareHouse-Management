import React from 'react';
import './Input.css';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    disabled = false,
    required = false,
    icon,
    rightIcon,
    className = '',
    ...props
}) => {
    const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon-left">{icon}</span>}
                <input
                    id={inputId}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={`input ${icon ? 'input-with-left-icon' : ''} ${rightIcon ? 'input-with-right-icon' : ''
                        } ${error ? 'input-error' : ''}`}
                    {...props}
                />
                {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
};

export default Input;
