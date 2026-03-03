import { streamixApi } from "@/api/streamix";
import { ActionResponse } from "@/types";

export type SearchSuggestion = {
  id: string;
  title: string;
  type: "video";
};

export const getSearchSuggestions = async (
  query: string,
  limit: number = 10,
): Promise<ActionResponse<SearchSuggestion[] | null>> => {
  try {
    if (!query || query.trim() === "") {
      return { success: true, message: "No search suggestions", data: null };
    }

    const results = await streamixApi.searchVideos(query, 1, 20);
    
    const suggestions: SearchSuggestion[] = results.data.map((video) => ({
      id: video.id,
      title: video.name,
      type: "video" as const,
    }));

    if (suggestions.length === 0) {
      return { success: true, message: "No search suggestions", data: null };
    }

    return {
      success: true,
      message: "Search suggestions fetched",
      data: suggestions.slice(0, limit),
    };
  } catch (error) {
    console.error("Search suggestions error:", error);
    return { success: false, message: "Error fetching search suggestions", data: null };
  }
};
