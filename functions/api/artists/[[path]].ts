export const onRequest = async (context: any) => {
  const { request, params, env } = context;
  const db = env.DB;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), { 
      status: 500, 
      headers 
    });
  }

  const pathParts = params.path || [];
  const pathArray = Array.isArray(pathParts) ? pathParts : [pathParts];
  const subPath = pathArray.join('/');

  try {
    // GET /api/artists - List all artists
    if (subPath === "" || subPath === "artists") {
      if (request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM artists ORDER BY name ASC").all();
        return new Response(JSON.stringify({ data: results }), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const { id, name, bio, avatar, socialLinks } = body;
        
        if (!id || !name) {
          return new Response(JSON.stringify({ error: "ID and Name are required" }), { status: 400, headers });
        }

        await db.prepare(`
          INSERT INTO artists (id, name, bio, avatar, socialLinks)
          VALUES (?, ?, ?, ?, ?)
        `).bind(id, name, bio || "", avatar || "", socialLinks || "{}")
          .run();

        return new Response(JSON.stringify({ success: true, message: "Artist created" }), { headers });
      }
    }

    // Handle /api/artists/:id - GET, PUT, DELETE
    if (pathArray.length === 1 && pathArray[0]) {
      const artistId = pathArray[0];

      // GET /api/artists/:id
      if (request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM artists WHERE id = ?").bind(artistId).all();
        if (results.length === 0) {
          return new Response(JSON.stringify({ error: "Artist not found" }), { status: 404, headers });
        }
        return new Response(JSON.stringify({ data: results[0] }), { headers });
      }

      // PUT /api/artists/:id
      if (request.method === "PUT") {
        const body = await request.json();
        const { name, bio, avatar, socialLinks } = body;
        
        await db.prepare(`
          UPDATE artists 
          SET name = ?, bio = ?, avatar = ?, socialLinks = ?, updatedAt = datetime('now')
          WHERE id = ?
        `).bind(name || "", bio || "", avatar || "", socialLinks || "{}", artistId)
          .run();

        return new Response(JSON.stringify({ success: true, message: "Artist updated" }), { headers });
      }

      // DELETE /api/artists/:id
      if (request.method === "DELETE") {
        await db.prepare("DELETE FROM artists WHERE id = ?").bind(artistId).run();
        return new Response(JSON.stringify({ success: true, message: "Artist deleted" }), { headers });
      }
    }

    return new Response(JSON.stringify({ error: "Not found", subPath, pathArray }), { status: 404, headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: "Internal server error", 
      details: error.message || String(error),
      stack: error.stack
    }), { status: 500, headers });
  }
};
