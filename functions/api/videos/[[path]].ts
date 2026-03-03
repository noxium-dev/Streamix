export const onRequest = async (context: any) => {
  const { request, params, env } = context;
  const db = env.DB;

  if (!db) {
    return new Response(JSON.stringify({ error: "Database not configured" }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const url = new URL(request.url);
  const pathParts = params.path;
  
  // Parse path parts - handle both array and string formats
  let pathArray: string[] = [];
  if (Array.isArray(pathParts)) {
    pathArray = pathParts;
  } else if (typeof pathParts === 'string') {
    pathArray = pathParts.split('/').filter((p: string) => p);
  } else if (pathParts) {
    pathArray = [String(pathParts)];
  }
  
  const path = pathArray.join('/');

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // GET /api/videos - List all videos
    // POST /api/videos - Create video
    if (!path || path === "videos") {
      if (request.method === "GET") {
        const featured = url.searchParams.get("featured");
        let query = "SELECT * FROM videos ORDER BY createdAt DESC";
        if (featured === "true") {
          query = "SELECT * FROM videos WHERE isFeatured = 1 ORDER BY createdAt DESC";
        }
        
        const { results } = await db.prepare(query).all();
        return new Response(JSON.stringify({ data: results }), { headers });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const { id, name, poster, resolution, duration, play, like, isFeatured, description, tags, genreId, artistId } = body;
        
        await db.prepare(`
          INSERT INTO videos (id, name, poster, resolution, duration, play, like, isFeatured, description, tags, genreId, artistId)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(id, name, poster, resolution, duration, play || 0, like || 0, isFeatured ? 1 : 0, description || "", tags || "", genreId || null, artistId || null)
          .run();

        return new Response(JSON.stringify({ success: true, message: "Video published" }), { headers });
      }
    }

    // Handle /api/videos/:id - GET, PUT, DELETE
    if (pathArray.length === 1 && pathArray[0] && !pathArray[0].includes('=')) {
      const videoId = pathArray[0];

      // GET /api/videos/:id - Get single video
      if (request.method === "GET") {
        const { results } = await db.prepare("SELECT * FROM videos WHERE id = ?").bind(videoId).all();
        if (results.length === 0) {
          return new Response(JSON.stringify({ error: "Video not found" }), { status: 404, headers });
        }
        return new Response(JSON.stringify({ data: results[0] }), { headers });
      }

      // PUT /api/videos/:id - Update video
      if (request.method === "PUT") {
        const body = await request.json();
        const { name, poster, resolution, duration, play, like, isFeatured, description, tags, genreId, artistId } = body;
        
        await db.prepare(`
          UPDATE videos 
          SET name = ?, poster = ?, resolution = ?, duration = ?, play = ?, like = ?, 
              isFeatured = ?, description = ?, tags = ?, genreId = ?, artistId = ?, updatedAt = datetime('now')
          WHERE id = ?
        `).bind(name, poster, resolution, duration, play || 0, like || 0, isFeatured ? 1 : 0, description || "", tags || "", genreId || null, artistId || null, videoId)
          .run();

        return new Response(JSON.stringify({ success: true, message: "Video updated" }), { headers });
      }

      // DELETE /api/videos/:id - Delete video
      if (request.method === "DELETE") {
        await db.prepare("DELETE FROM videos WHERE id = ?").bind(videoId).run();
        return new Response(JSON.stringify({ success: true, message: "Video deleted" }), { headers });
      }
    }

    return new Response(JSON.stringify({ error: "Not found", path, pathArray }), { status: 404, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error), path, pathArray }), { status: 500, headers });
  }
};
