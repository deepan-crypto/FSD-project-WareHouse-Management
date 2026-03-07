import React from 'react';
import './Card.css';

const Card = ({
    children,
    title,
    subtitle,
    headerAction,
    footer,
    variant = 'default',
    hoverable = false,
    className = '',
    ...props
}) => {
    const cardClass = [
        'card',
        `card-${variant}`,
        hoverable && 'card-hoverable',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClass} {...props}>
            {(title || subtitle || headerAction) && (
                <div className="card-header">
                    <div className="card-header-content">
                        {title && <h3 className="card-title">{title}</h3>}
                        {subtitle && <p className="card-subtitle">{subtitle}</p>}
                    </div>
                    {headerAction && (
                        <div className="card-header-action">{headerAction}</div>
                    )}
                </div>
            )}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;
