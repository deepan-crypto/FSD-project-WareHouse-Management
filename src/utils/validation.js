// Form validation utilities

// Validate email
export const validateEmail = (email) => {
    if (!email) {
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

// Validate password
export const validatePassword = (password, minLength = 8) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters long`;
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    return null;
};

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return `${fieldName} is required`;
    }
    return null;
};

// Validate number
export const validateNumber = (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) {
        return `${fieldName} is required`;
    }
    if (isNaN(value)) {
        return `${fieldName} must be a number`;
    }
    return null;
};

// Validate number range
export const validateRange = (value, min, max, fieldName = 'This field') => {
    const numberError = validateNumber(value, fieldName);
    if (numberError) return numberError;

    const num = Number(value);
    if (min !== undefined && num < min) {
        return `${fieldName} must be at least ${min}`;
    }
    if (max !== undefined && num > max) {
        return `${fieldName} must be at most ${max}`;
    }
    return null;
};

// Validate positive number
export const validatePositive = (value, fieldName = 'This field') => {
    const numberError = validateNumber(value, fieldName);
    if (numberError) return numberError;

    if (Number(value) <= 0) {
        return `${fieldName} must be a positive number`;
    }
    return null;
};

// Validate phone number
export const validatePhone = (phone) => {
    if (!phone) {
        return 'Phone number is required';
    }
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        return 'Please enter a valid phone number';
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
        return 'Phone number must be at least 10 digits';
    }
    return null;
};

// Validate date
export const validateDate = (date, fieldName = 'Date') => {
    if (!date) {
        return `${fieldName} is required`;
    }
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        return `Please enter a valid ${fieldName.toLowerCase()}`;
    }
    return null;
};

// Validate future date
export const validateFutureDate = (date, fieldName = 'Date') => {
    const dateError = validateDate(date, fieldName);
    if (dateError) return dateError;

    const dateObj = new Date(date);
    const now = new Date();
    if (dateObj <= now) {
        return `${fieldName} must be in the future`;
    }
    return null;
};

// Validate min length
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
    if (!value) {
        return `${fieldName} is required`;
    }
    if (value.length < minLength) {
        return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
};

// Validate max length
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
    if (value && value.length > maxLength) {
        return `${fieldName} must be at most ${maxLength} characters`;
    }
    return null;
};

// Password strength checker
export const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: 'None' };

    let strength = 0;

    // Length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Lowercase
    if (/[a-z]/.test(password)) strength++;

    // Uppercase
    if (/[A-Z]/.test(password)) strength++;

    // Numbers
    if (/[0-9]/.test(password)) strength++;

    // Special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const index = Math.min(Math.floor(strength / 1.5), labels.length - 1);

    return {
        strength: Math.min(strength, 5),
        label: labels[index]
    };
};
