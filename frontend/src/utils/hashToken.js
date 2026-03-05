/**
 * Hashes a string using SHA-256 via the Web Crypto API.
 * @param {string} token - The plain text token to hash.
 * @returns {Promise<string>} The hex-encoded SHA-256 hash.
 */
export async function hashToken(token) {
    const msgUint8 = new TextEncoder().encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
