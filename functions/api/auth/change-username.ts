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
        
        const body = await request.json();
        
        if (!body.username) {
            return new Response(JSON.stringify({ success: false, message: "Username is required" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }
        
        const existing = await env.DB.prepare(
            "SELECT id FROM users WHERE username = ? AND id != ?"
        ).bind(body.username, userId).first();
        
        if (existing) {
            return new Response(JSON.stringify({ success: false, message: "Username already taken" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }
        
        await env.DB.prepare(
            "UPDATE users SET username = ? WHERE id = ?"
        ).bind(body.username, userId).run();
        
        return new Response(JSON.stringify({ success: true, message: "Username changed successfully" }), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
