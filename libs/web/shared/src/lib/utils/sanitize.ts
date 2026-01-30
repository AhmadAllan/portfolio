/**
 * Sanitize HTML by escaping special characters to prevent XSS attacks
 * SSR-compatible with fallback for server-side rendering
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string with special characters escaped
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';

  // Server-side fallback for SSR
  if (typeof document === 'undefined') {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Browser-side sanitization
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Sanitize URL to only allow HTTP(S) protocols
 * @param url - The URL string to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    // Only allow http(s) protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      console.warn('[Security] Blocked non-HTTP(S) URL:', url);
      return '';
    }
    return parsed.toString();
  } catch (error) {
    console.warn('[Security] Invalid URL:', url, error);
    return '';
  }
}

/**
 * Sanitize a filename by removing potentially dangerous characters
 * @param filename - The filename to sanitize
 * @returns Sanitized filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return '';

  // Remove path separators and dangerous characters
  return filename
    .replace(/[/\\]/g, '') // Remove slashes
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*]/g, '') // Remove Windows-invalid characters
    .replace(/^\./g, '') // Remove leading dots (hidden files)
    .trim();
}

/**
 * Sanitize user input by trimming whitespace and limiting length
 * @param input - The input string to sanitize
 * @param maxLength - Maximum allowed length (default: 10000)
 * @returns Sanitized input string
 */
export function sanitizeInput(input: string, maxLength = 10000): string {
  if (!input) return '';

  return input.trim().substring(0, maxLength);
}

/**
 * Sanitize email address
 * @param email - The email address to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  const trimmed = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    console.warn('[Security] Invalid email format:', email);
    return '';
  }

  return trimmed;
}

/**
 * Strip all HTML tags from a string
 * SSR-compatible with fallback for server-side rendering
 *
 * Note: This function is safe to use for extracting plain text from HTML.
 * It does not render the HTML to the page, only uses the browser's parser
 * to extract text content. Use sanitizeHtml() first if the input is untrusted.
 *
 * @param html - The HTML string
 * @returns Plain text without HTML tags
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';

  // Server-side fallback for SSR
  if (typeof document === 'undefined') {
    // Simple regex-based tag removal for SSR
    return html
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Unescape &
      .replace(/&lt;/g, '<') // Unescape <
      .replace(/&gt;/g, '>') // Unescape >
      .replace(/&quot;/g, '"') // Unescape "
      .replace(/&#039;/g, "'") // Unescape '
      .trim();
  }

  // Browser-side tag stripping
  // Safe: innerHTML is not rendered to page, only used to extract textContent
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

/**
 * Escape special regex characters in a string
 * @param str - The string to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
