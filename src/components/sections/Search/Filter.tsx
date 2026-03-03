"use client";

import { siteConfig } from "@/config/site";
import { parseAsSet } from "@/utils/parsers";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import SearchInput from "@/components/ui/input/SearchInput";
import GenresSelect from "@/components/ui/input/GenresSelect";

interface SearchFilterProps {
  isLoading?: boolean;
  onSearchSubmit: (value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ isLoading, onSearchSubmit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const genres = useMemo(() => {
    const val = searchParams.get("genres");
    return val ? parseAsSet.parse(val) : new Set<string>([]);
  }, [searchParams]);

  const setQuery = (newQuery: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newQuery) nextParams.delete("q");
    else nextParams.set("q", newQuery);
    setSearchParams(nextParams);
  };

  const setGenres = (newGenres: Set<string> | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newGenres || newGenres.size === 0) nextParams.delete("genres");
    else nextParams.set("genres", parseAsSet.serialize(newGenres));
    setSearchParams(nextParams);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl">
      <SearchInput
        isLoading={isLoading}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearchSubmit(query);
          }
        }}
        placeholder="Search for movies, TV shows..."
      />
      <GenresSelect
        selectedKeys={genres}
        onSelectionChange={(keys) => setGenres(keys as Set<string>)}
      />
    </div>
  );
};

export default SearchFilter;
