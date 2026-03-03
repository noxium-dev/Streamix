import { queryClient as q } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { parseAsSet } from "@/utils/parsers";
import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo, useEffect } from "react";

const VALID_CONTENT_TYPES = ["movie"] as const;
const DEFAULT_QUERY_TYPE = "allVideos";

const useDiscoverFilters = () => {
  const { movies } = siteConfig.queryLists;
  const [searchParams, setSearchParams] = useSearchParams();

  const genres = useMemo(() => {
    const val = searchParams.get("genres");
    return val ? parseAsSet.parse(val) : new Set<string>([]);
  }, [searchParams]);

  const queryType = useMemo(() => {
    const val = searchParams.get("type");
    const validParams = movies.map(m => m.param);
    return val && validParams.includes(val) ? val : DEFAULT_QUERY_TYPE;
  }, [searchParams, movies]);

  const content = useMemo(() => {
    const val = searchParams.get("content");
    return val === "movie" ? "movie" : "movie"; // Default to movie as per VALID_CONTENT_TYPES
  }, [searchParams]);

  const setGenres = useCallback((newGenres: Set<string> | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newGenres || newGenres.size === 0) {
      nextParams.delete("genres");
    } else {
      nextParams.set("genres", parseAsSet.serialize(newGenres));
    }
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const setQueryType = useCallback((newType: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newType || newType === DEFAULT_QUERY_TYPE) {
      nextParams.delete("type");
    } else {
      nextParams.set("type", newType);
    }
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const setContent = useCallback((newContent: string | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newContent || newContent === "movie") {
      nextParams.delete("content");
    } else {
      nextParams.set("content", newContent);
    }
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  const types = useMemo(
    () => [
      { name: "Browse", key: DEFAULT_QUERY_TYPE },
      ...movies.map(({ name, param }) => ({
        name: name,
        key: param,
      })),
    ],
    [movies],
  );

  const genresString = useMemo(
    () =>
      Array.from(genres)
        .filter((genre) => genre !== "")
        .join(","),
    [genres],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const clearQueries = useCallback(() => {
    const queryKeys = ["discover-movies"];
    queryKeys.forEach((key) => {
      if (!q.isFetching({ queryKey: [key] })) {
        q.removeQueries({ queryKey: [key] });
      }
    });
  }, []);

  useEffect(() => {
    clearQueries();
  }, [content, queryType, genresString, clearQueries]);

  return {
    types,
    genres,
    queryType,
    content,
    genresString,
    setGenres,
    setQueryType,
    setContent,
    resetFilters,
  };
};

export default useDiscoverFilters;
