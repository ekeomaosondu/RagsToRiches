import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Validate username based on platform-specific rules
 * @param {string} username - The username to validate
 * @param {string} platform - The chess platform (chesscom or lichess)
 * @returns {string|null} - Error message if invalid, null if valid
 */
export function validateUsername(username, platform) {
  if (!username || username.trim() === '') {
    return ERROR_MESSAGES.USERNAME_REQUIRED;
  }

  const rules = VALIDATION_RULES[platform];
  if (!rules) {
    return 'Invalid platform selected';
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < rules.minLength) {
    return rules.errorMessage;
  }

  if (trimmedUsername.length > rules.maxLength) {
    return rules.errorMessage;
  }

  if (!rules.pattern.test(trimmedUsername)) {
    return rules.errorMessage;
  }

  return null;
}

/**
 * Validate the entire form
 * @param {Object} formData - Form data containing platform, username, and color
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export function validateForm(formData) {
  const errors = {};

  if (!formData.platform) {
    errors.platform = 'Please select a platform';
  }

  if (!formData.username) {
    errors.username = ERROR_MESSAGES.USERNAME_REQUIRED;
  } else if (formData.platform) {
    const usernameError = validateUsername(formData.username, formData.platform);
    if (usernameError) {
      errors.username = usernameError;
    }
  }

  if (!formData.color) {
    errors.color = 'Please select a color';
  }

  return errors;
}

/**
 * Check if form has any validation errors
 * @param {Object} errors - Errors object from validateForm
 * @returns {boolean} - True if form is valid, false otherwise
 */
export function isFormValid(errors) {
  return Object.keys(errors).length === 0;
}
