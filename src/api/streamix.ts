const API_BASE = "/api/streamix-api";
const STREAMIX_TOKEN = "f6335d071b5b4ed82bace91d";

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
  const url = new URL(`${API_BASE}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
};

let cachedPlayer: StreamixDefaultPlayer | null = null;

export const streamixApi = {
  getVideos: (page = 1, perPage = 20) =>
    fetchApi<StreamixApiResponse<StreamixVideo[]>>("/api/v1/video/manage", {
      page: String(page),
      perPage: String(perPage),
    }),

  getVideoById: (id: string) =>
    fetchApi<StreamixVideoDetail>(`/api/v1/video/manage/${id}`),

  getPlayers: () =>
    fetchApi<StreamixApiResponse<StreamixPlayer[]>>("/api/v1/video/player"),

  getDefaultPlayer: async (): Promise<StreamixDefaultPlayer> => {
    if (cachedPlayer) {
      return cachedPlayer;
    }
    const player = await fetchApi<StreamixDefaultPlayer>("/api/v1/video/player/default");
    cachedPlayer = player;
    return player;
  },

  getPlayerDomains: () =>
    fetchApi<string[]>("/api/v1/video/player/domain"),

  searchVideos: (query: string, page = 1, perPage = 20) =>
    fetchApi<StreamixApiResponse<StreamixVideo[]>>("/api/v1/video/manage", {
      page: String(page),
      perPage: String(perPage),
      search: query,
    }),


  getVideoEmbedUrl: async (videoId: string): Promise<string> => {
    const player = await streamixApi.getDefaultPlayer();
    // Assuming player.domain returns streamix.upns.pro
    return `https://${player.domain}/#${videoId}`;
  },
};
