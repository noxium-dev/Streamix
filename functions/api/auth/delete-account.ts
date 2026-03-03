// @ts-nocheck
// Cloudflare Pages Function - runs in Workers runtime

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
        
        // Delete user sessions first
        await env.DB.prepare(
            "DELETE FROM sessions WHERE user_id = ?"
        ).bind(userId).run();
        
        // Delete user account
        await env.DB.prepare(
            "DELETE FROM users WHERE id = ?"
        ).bind(userId).run();
        
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Set-Cookie", "streamix_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
        
        return new Response(JSON.stringify({ success: true, message: "Account deleted successfully" }), {
            headers, status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
