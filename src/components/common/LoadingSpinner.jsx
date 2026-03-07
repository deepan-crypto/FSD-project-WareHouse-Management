import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
    size = 'md',
    variant = 'primary',
    fullScreen = false,
    text,
    className = ''
}) => {
    const spinnerClass = [
        'spinner',
        `spinner-${size}`,
        `spinner-${variant}`,
        className
    ].filter(Boolean).join(' ');

    const Content = (
        <div className="spinner-wrapper">
            <div className={spinnerClass}></div>
            {text && <p className="spinner-text">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="spinner-fullscreen">
                {Content}
            </div>
        );
    }

    return Content;
};

export default LoadingSpinner;
