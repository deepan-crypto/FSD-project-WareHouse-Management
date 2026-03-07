import React from 'react';
import './Badge.css';

const Badge = ({
    children,
    variant = 'default',
    size = 'md',
    dot = false,
    className = '',
    ...props
}) => {
    const badgeClass = [
        'badge',
        `badge-${variant}`,
        `badge-${size}`,
        dot && 'badge-dot',
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={badgeClass} {...props}>
            {dot && <span className="badge-dot-indicator"></span>}
            {children}
        </span>
    );
};

export default Badge;
