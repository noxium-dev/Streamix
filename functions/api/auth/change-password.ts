// @ts-nocheck
// Cloudflare Pages Function - runs in Workers runtime

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "STR3AM1X_S4LT_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const getUserFromSession = async (request, env) => {
    const cookie = request.headers.get("Cookie");
    if (!cookie) return null;
    
    const sessionMatch = cookie.match(/streamix_session=([^;]+)/);
    if (!sessionMatch) return null;
    
    const sessionId = sessionMatch[1];
    const session = await env.DB.prepare(
        "SELECT user_id FROM sessions WHERE id = ? AND expiresAt > ?"
    ).bind(sessionId, Math.floor(Date.now() / 1000)).first();
    
    return session ? session.user_id : null;
};

export const onRequestPost = async (context) => {
    try {
        const { request, env } = context;
        const userId = await getUserFromSession(request, env);
        
        if (!userId) {
            return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }
        
        const body = await request.json();
        
        if (!body.currentPassword || !body.newPassword) {
            return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }
        
        const currentPasswordHash = await hashPassword(body.currentPassword);
        const user = await env.DB.prepare(
            "SELECT id FROM users WHERE id = ? AND password_hash = ?"
        ).bind(userId, currentPasswordHash).first();
        
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "Current password is incorrect" }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }
        
        const newPasswordHash = await hashPassword(body.newPassword);
        await env.DB.prepare(
            "UPDATE users SET password_hash = ? WHERE id = ?"
        ).bind(newPasswordHash, userId).run();
        
        return new Response(JSON.stringify({ success: true, message: "Password changed successfully" }), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
