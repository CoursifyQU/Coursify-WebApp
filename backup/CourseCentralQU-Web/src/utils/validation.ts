/**
 * Validates if an email belongs to the Queen's University domain (@queensu.ca)
 * @param email Email address to validate
 * @returns Boolean indicating if the email is from Queen's University
 */
export const isQueensEmail = (email: string): boolean => {
  if (!email) return false;
  return email.toLowerCase().endsWith('@queensu.ca');
};

/**
 * Validates if an email is in a valid format
 * @param email Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets minimum requirements
 * @param password Password to validate
 * @returns Boolean indicating if the password meets requirements
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  return password.length >= 6;
}; 