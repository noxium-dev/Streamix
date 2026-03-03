export const onRequest = async (context: any) => {
  const { request, params } = context;
  const url = new URL(request.url);
  
  // Extract the path after /api/streamix-api/
  const pathParts = params.path as string[] | undefined;
  const path = pathParts?.join('/') || '';
  const searchParams = url.searchParams.toString();
  
  // Base URL already includes v1, so endpoints should be clean
  const API_BASE = "https://upnshare.com/api/v1";
  const API_TOKEN = "f6335d071b5b4ed82bace91d";

  const targetUrl = `${API_BASE}/${path}${searchParams ? `?${searchParams}` : ''}`;

  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers),
      "api-token": API_TOKEN,
      "Content-Type": "application/json",
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().blob() : null,
  });

  try {
    const response = await fetch(modifiedRequest);
    return response;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch from upstream API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
