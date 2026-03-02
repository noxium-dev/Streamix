import { queryClient as q } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { parseAsSet } from "@/utils/parsers";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useCallback, useMemo, useEffect } from "react";

const VALID_CONTENT_TYPES = ["movie"] as const;
const DEFAULT_QUERY_TYPE = "allVideos";

const useDiscoverFilters = () => {
  const { movies } = siteConfig.queryLists;

  const [genres, setGenres] = useQueryState("genres", parseAsSet.withDefault(new Set([])));
  const [queryType, setQueryType] = useQueryState(
    "type",
    parseAsStringLiteral(movies.map(m => m.param)).withDefault(DEFAULT_QUERY_TYPE),
  );
  const [content, setContent] = useQueryState(
    "content",
    parseAsStringLiteral(VALID_CONTENT_TYPES).withDefault("movie"),
  );

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
    setGenres(null);
    setQueryType(DEFAULT_QUERY_TYPE);
  }, [setGenres, setQueryType]);

  const clearQueries = useCallback(() => {
    const queryKeys = ["discover-movies"];
    queryKeys.forEach((key) => {
      if (!q.isFetching({ queryKey: [key] })) {
        q.removeQueries({ queryKey: [key] });
      }
    });
  }, [q]);

  useEffect(() => {
    clearQueries();
  }, [content, queryType, genresString]);

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
