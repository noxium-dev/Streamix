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

  // params.path is what comes AFTER /api/genres/
  // /api/genres -> params.path is undefined or empty
  // /api/genres/action -> params.path is ["action"]
  
  const pathParts = params.path || [];
  const pathArray = Array.isArray(pathParts) ? pathParts : [pathParts];
  const subPath = pathArray.join('/');

  try {
    // GET /api/genres - List all genres
    if (subPath === "" || subPath === "genres") {
      if (request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM genres ORDER BY name ASC").all();
        return new Response(JSON.stringify({ data: results }), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const { id, name, icon, description } = body;
        
        if (!id || !name) {
          return new Response(JSON.stringify({ error: "ID and Name are required" }), { status: 400, headers });
        }

        await db.prepare(`
          INSERT INTO genres (id, name, icon, description)
          VALUES (?, ?, ?, ?)
        `).bind(id, name, icon || "", description || "")
          .run();

        return new Response(JSON.stringify({ success: true, message: "Genre created" }), { headers });
      }
    }

    // Handle /api/genres/:id - GET, PUT, DELETE
    if (pathArray.length === 1 && pathArray[0]) {
      const genreId = pathArray[0];

      // GET /api/genres/:id
      if (request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM genres WHERE id = ?").bind(genreId).all();
        if (results.length === 0) {
          return new Response(JSON.stringify({ error: "Genre not found" }), { status: 404, headers });
        }
        return new Response(JSON.stringify({ data: results[0] }), { headers });
      }

      // PUT /api/genres/:id
      if (request.method === "PUT") {
        const body = await request.json();
        const { name, icon, description } = body;
        
        await db.prepare(`
          UPDATE genres 
          SET name = ?, icon = ?, description = ?, updatedAt = datetime('now')
          WHERE id = ?
        `).bind(name || "", icon || "", description || "", genreId)
          .run();

        return new Response(JSON.stringify({ success: true, message: "Genre updated" }), { headers });
      }

      // DELETE /api/genres/:id
      if (request.method === "DELETE") {
        await db.prepare("DELETE FROM genres WHERE id = ?").bind(genreId).run();
        return new Response(JSON.stringify({ success: true, message: "Genre deleted" }), { headers });
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
