// @ts-nocheck
// Cloudflare Pages Function - runs in Workers runtime

export const onRequestPost = async (context) => {
    try {
        const { request, env } = context;
        const cookies = request.headers.get("Cookie") || "";
        const sessionCookieMatch = cookies.match(/streamix_session=([^;]+)/);

        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        headers.set("Set-Cookie", `streamix_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);

        if (sessionCookieMatch) {
            const sessionId = sessionCookieMatch[1];
            await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
        }

        return new Response(JSON.stringify({ success: true, message: "You have been logged out" }), { headers, status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ success: false, message: error.message || "Server error" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
};
