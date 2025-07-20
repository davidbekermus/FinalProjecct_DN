export const signupValidation = (formData) => {
  if (!formData.name || !formData.email || !formData.password) {
    return "Please fill in all fields";
  } else if (formData.password.length < 8) {
    return "Password must be at least 8 characters long";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return "Please enter a valid email address";
  } else if (
    !/\d/.test(formData.password) ||
    !/[A-Z]/.test(formData.password) ||
    !/[a-z]/.test(formData.password) ||
    !/[!@#$%^&*]/.test(formData.password)
  ) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return "";
};

export const signinValidation = (formData) => {
  if (!formData.email || !formData.password) {
    return "Please fill in all fields.";
  } else if (
    !/\d/.test(formData.password) ||
    !/[A-Z]/.test(formData.password) ||
    !/[a-z]/.test(formData.password) ||
    !/[!@#$%^&*]/.test(formData.password)
  ) {
    return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  return "";
};
