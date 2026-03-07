import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { DATE_FORMATS } from './constants';

// Format date for display
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return format(dateObj, formatString);
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

// Format date with time
export const formatDateTime = (date) => {
    return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
        console.error('Error formatting relative time:', error);
        return '';
    }
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

// Format number with commas
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    return new Intl.NumberFormat('en-US').format(number);
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
    if (value === null || value === undefined) return '';
    return `${Number(value).toFixed(decimals)}%`;
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

// Capitalize first letter
export const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert snake_case to Title Case
export const snakeToTitleCase = (str) => {
    if (!str) return '';
    return str
        .split('_')
        .map(word => capitalize(word))
        .join(' ');
};

// Format file size
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Format phone number
export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumber;
};
