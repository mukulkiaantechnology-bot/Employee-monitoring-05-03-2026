/**
 * Generates a cryptographically secure random API token.
 * Format: sk_live_ followed by 40 random characters.
 * @returns {string} The generated token.
 */
export async function generateSecureToken() {
    const array = new Uint8Array(20); // 20 bytes will give 40 hex characters
    window.crypto.getRandomValues(array);
    const hex = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return `sk_live_${hex}`;
}
