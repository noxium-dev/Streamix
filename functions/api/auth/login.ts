// @ts-nocheck
// Cloudflare Pages Function - runs in Workers runtime

const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + "STR3AM1X_S4LT_2026");
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const onRequestPost = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json();

        if (!body.email || !body.password) {
            return new Response(JSON.stringify({ success: false, message: "Missing email or password" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        const passwordHash = await hashPassword(body.password);

        const user = await env.DB.prepare(
            "SELECT id, username FROM users WHERE email = ? AND password_hash = ?"
        ).bind(body.email, passwordHash).first();

        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "Invalid email or password" }), {
                status: 401, headers: { "Content-Type": "application/json" }
            });
        }

        const sessionId = crypto.randomUUID();
        const expiresAt = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60);

        await env.DB.prepare(
            "INSERT INTO sessions (id, user_id, expiresAt) VALUES (?, ?, ?)"
        ).bind(sessionId, user.id, expiresAt).run();

        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Set-Cookie", `streamix_session=${sessionId}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`);

        return new Response(JSON.stringify({ success: true, message: `Welcome back, ${user.username}!` }), { headers, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
