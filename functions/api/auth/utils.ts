// @ts-nocheck
// This file runs in the Cloudflare Workers runtime, not in the browser or Node.js.

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "STR3AM1X_S4LT_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const generateSessionId = () => crypto.randomUUID();

export { hashPassword, generateSessionId };
