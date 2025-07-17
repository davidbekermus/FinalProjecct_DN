export const signupValidation = (formData) => {
    if (formData.password < 8) {
        return ('Password must be at least 8 characters long');
    } else if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.username || !formData.password || !formData.confirmPassword) {
        return ('Please fill in all fields');
    } else if (formData.password !== formData.confirmPassword) {
        return ('Passwords do not match');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return ('Please enter a valid email address');
    } else if (!/^\d{10}$/.test(formData.phone)) {
        return ('Please enter a valid phone number (10 digits)');
    } else if (!/\d/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
        return ('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
}

export const signinValidation = (formData) => {
    if (!formData.username || !formData.password) {
        return ('Please fill in all fields.');
    } else if (!/\d/.test(formData.password) || !/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[!@#$%^&*]/.test(formData.password)) {
        return ('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }
    return '';
}