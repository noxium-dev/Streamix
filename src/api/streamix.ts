const API_BASE = "/api/streamix-api";
const VIDEOS_API_BASE = "/api/videos";
const GENRES_API_BASE = "/api/genres";
const ARTISTS_API_BASE = "/api/artists";

export interface Artist {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  socialLinks: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublishedVideo {
  id: string;
  name: string;
  poster: string;
  resolution: string;
  duration: number;
  play: number;
  like: number;
  isFeatured: boolean;
  description: string;
  tags: string;
  genreId?: string;
  artistId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StreamixVideo {
  id: string;
  name: string;
  poster: string;
  subtitle: number;
  impression: number;
  play: number;
  premiumPlay: number;
  download: number;
  premiumDownload: number;
  size: number;
  duration: number;
  width: number;
  height: number;
  resolution: string;
  bitrate: number;
  framerate: number;
  codec: string;
  audioBitrate: number;
  audioChannels: number;
  audioSampleRate: number;
  audioCodec: string;
  type: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface StreamixVideoDetail extends StreamixVideo {
  description?: string;
  tags?: string[];
}

export interface StreamixPlayer {
  id: string;
  domain: string;
  logo: string;
  isPremium: boolean;
  allowDownload: boolean;
  isDefault: boolean;
  impression: number;
  play: number;
  premiumPlay: number;
  download: number;
  premiumDownload: number;
  configuration: string;
  status: string;
  updatedAt: string;
  createdAt: string;
}

export interface StreamixDefaultPlayer {
  domain: string;
  embedWidth: number;
  embedHeight: number;
}

export interface StreamixPagination {
  currentPage: number;
  perPage: number;
  total: number;
  maxPage: number;
  offset: number;
}

export interface StreamixApiResponse<T> {
  data: T;
  metadata: StreamixPagination;
}

const fetchApi = async <T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> => {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
  }

  const queryString = searchParams.toString();
  // Ensure endpoint starts with / and doesn't double up
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE}${cleanEndpoint}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

let cachedPlayer: StreamixDefaultPlayer | null = null;

export const streamixApi = {
  getVideos: (page = 1, perPage = 20) =>
    fetchApi<StreamixApiResponse<StreamixVideo[]>>("/video/manage", {
      page: String(page),
      perPage: String(perPage),
    }),

  getVideoById: (id: string) =>
    fetchApi<StreamixVideoDetail>(`/video/manage/${id}`),

  getPlayers: () =>
    fetchApi<StreamixApiResponse<StreamixPlayer[]>>("/video/player"),

  getDefaultPlayer: async (): Promise<StreamixDefaultPlayer> => {
    if (cachedPlayer) {
      return cachedPlayer;
    }
    const player = await fetchApi<StreamixDefaultPlayer>("/video/player/default");
    cachedPlayer = player;
    return player;
  },

  getPlayerDomains: () =>
    fetchApi<string[]>("/video/player/domain"),

  searchVideos: (query: string, page = 1, perPage = 20) =>
    fetchApi<StreamixApiResponse<StreamixVideo[]>>("/video/manage", {
      page: String(page),
      perPage: String(perPage),
      search: query,
    }),


  getVideoEmbedUrl: async (videoId: string): Promise<string> => {
    const player = await streamixApi.getDefaultPlayer();
    return `https://${player.domain}/#${videoId}`;
  },

  getPublishedVideos: async (featured?: boolean) => {
    const url = featured ? `${VIDEOS_API_BASE}?featured=true` : VIDEOS_API_BASE;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch published videos");
    const result = await response.json() as { data?: any[] };
    return result.data || [];
  },

  getPublishedVideoById: async (id: string) => {
    const response = await fetch(`${VIDEOS_API_BASE}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch video");
    const result = await response.json() as { data?: any };
    return result.data;
  },

  publishVideo: async (video: Omit<PublishedVideo, "createdAt" | "updatedAt">) => {
    const response = await fetch(VIDEOS_API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(video),
    });
    if (!response.ok) throw new Error("Failed to publish video");
    return response.json();
  },

  updatePublishedVideo: async (id: string, video: Partial<PublishedVideo>) => {
    const response = await fetch(`${VIDEOS_API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(video),
    });
    if (!response.ok) throw new Error("Failed to update video");
    return response.json();
  },

  deletePublishedVideo: async (id: string) => {
    const response = await fetch(`${VIDEOS_API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete video");
    return response.json();
  },

  // Genres API
  getGenres: async () => {
    const response = await fetch(GENRES_API_BASE);
    if (!response.ok) throw new Error("Failed to fetch genres");
    const result = await response.json() as { data?: any[] };
    return result.data || [];
  },

  getGenreById: async (id: string) => {
    const response = await fetch(`${GENRES_API_BASE}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch genre");
    const result = await response.json() as { data?: any };
    return result.data;
  },

  createGenre: async (genre: Omit<Genre, "createdAt" | "updatedAt">) => {
    const response = await fetch(GENRES_API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genre),
    });
    if (!response.ok) throw new Error("Failed to create genre");
    return response.json();
  },

  updateGenre: async (id: string, genre: Partial<Genre>) => {
    const response = await fetch(`${GENRES_API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(genre),
    });
    if (!response.ok) throw new Error("Failed to update genre");
    return response.json();
  },

  deleteGenre: async (id: string) => {
    const response = await fetch(`${GENRES_API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete genre");
    return response.json();
  },

  // Artists API
  getArtists: async () => {
    const response = await fetch(ARTISTS_API_BASE);
    if (!response.ok) throw new Error("Failed to fetch artists");
    const result = await response.json() as { data?: any[] };
    return result.data || [];
  },

  getArtistById: async (id: string) => {
    const response = await fetch(`${ARTISTS_API_BASE}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch artist");
    const result = await response.json() as { data?: any };
    return result.data;
  },

  createArtist: async (artist: Omit<Artist, "createdAt" | "updatedAt">) => {
    const response = await fetch(ARTISTS_API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });
    if (!response.ok) throw new Error("Failed to create artist");
    return response.json();
  },

  updateArtist: async (id: string, artist: Partial<Artist>) => {
    const response = await fetch(`${ARTISTS_API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(artist),
    });
    if (!response.ok) throw new Error("Failed to update artist");
    return response.json();
  },

  deleteArtist: async (id: string) => {
    const response = await fetch(`${ARTISTS_API_BASE}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete artist");
    return response.json();
  },
};
