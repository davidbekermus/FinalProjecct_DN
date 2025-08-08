export const signupValidation = (formData) => {
  if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
    return "Please fill in all fields";
  }
  if (formData.name.length < 2 || formData.name.length > 50) {
    return "Name must be between 2 and 50 characters.";
  }
  if (!/.+@.+\..+/.test(formData.email)) {
    return "Please enter a valid email address";
  }
  if (formData.password.length < 6 || formData.password.length > 128) {
    return "Password must be between 6 and 128 characters.";
  }
  if (!/[0-9]/.test(formData.password)) {
    return "Password must contain at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(formData.password)) {
    return "Password must contain at least one symbol.";
  }
  if (formData.password !== formData.confirmPassword) {
    return "Passwords do not match.";
  }
  if (!formData.role || (formData.role !== "passenger" && formData.role !== "driver")) {
    return "Please select a valid user type.";
  }
  return "";
};

export const signinValidation = (formData) => {
  if (!formData.email || !formData.password) {
    return "Please fill in all fields.";
  }
  // You may want to add similar password checks here if needed
  return "";
};

export const imageValidation = (file) => {
  if (!file) {
    return "Please select an image file";
  }
  
  // Check file type
  if (!file.type.startsWith("image/")) {
    return "Please select a valid image file (JPEG, PNG, GIF, etc.)";
  }
  
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return "Image size must be less than 5MB";
  }
  
  return "";
};
