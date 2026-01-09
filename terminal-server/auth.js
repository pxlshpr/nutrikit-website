/**
 * Terminal Server Authentication
 *
 * Simple token validation for controller mode.
 * The token is a shared secret that the Next.js app sends and we validate.
 */

// Controller token - same value should be set in Next.js TERMINAL_CONTROLLER_TOKEN
const CONTROLLER_TOKEN = process.env.TERMINAL_CONTROLLER_TOKEN;

/**
 * Validate a controller token.
 * Returns true if the token is valid and allows controller access.
 *
 * @param {string|undefined} token - The token to validate
 * @returns {Promise<boolean>} - Whether the token is valid
 */
export async function validateControllerToken(token) {
  // No token configured = no controller access
  if (!CONTROLLER_TOKEN) {
    console.warn('TERMINAL_CONTROLLER_TOKEN not configured - controller access disabled');
    return false;
  }

  // No token provided = denied
  if (!token) {
    return false;
  }

  // Simple string comparison (constant-time not critical here but good practice)
  return token === CONTROLLER_TOKEN;
}
