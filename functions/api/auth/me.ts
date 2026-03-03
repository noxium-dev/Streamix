// @ts-nocheck
// Cloudflare Pages Function - runs in Workers runtime

export const onRequestGet = async (context) => {
    try {
        const { request, env } = context;
        const cookies = request.headers.get("Cookie") || "";
        const sessionCookieMatch = cookies.match(/streamix_session=([^;]+)/);

        if (!sessionCookieMatch) {
            return new Response(JSON.stringify({ success: false, user: null }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }

        const sessionId = sessionCookieMatch[1];
        const now = Math.floor(Date.now() / 1000);

        const session = await env.DB.prepare(
            "SELECT user_id, expiresAt FROM sessions WHERE id = ?"
        ).bind(sessionId).first();

        if (!session || session.expiresAt < now) {
            return new Response(JSON.stringify({ success: false, user: null }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }

        const user = await env.DB.prepare(
            "SELECT id, username, full_name as fullName, email FROM users WHERE id = ?"
        ).bind(session.user_id).first();

        if (!user) {
            return new Response(JSON.stringify({ success: false, user: null }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ success: true, user }), {
            headers: { "Content-Type": "application/json" }, status: 200
        });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
