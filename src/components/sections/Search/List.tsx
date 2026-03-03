"use client";

import { streamixApi, StreamixVideo } from "@/api/streamix";
import { queryClient } from "@/app/providers";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import StreamixVideoCard from "@/components/sections/Video/Cards/Poster";
import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { ContentType } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import SearchFilter from "./Filter";

type FetchType = {
  page: number;
  type: ContentType;
  query: string;
};

const fetchData = async ({
  page,
  query,
}: FetchType): Promise<{
  data: StreamixVideo[];
  metadata: { currentPage: number; perPage: number; total: number; maxPage: number; offset: number };
}> => {
  return streamixApi.searchVideos(query, page, 12);
};

const SearchList = () => {
  const { content } = useDiscoverFilters();
  const { ref, inViewport } = useInViewport();
  const [submittedSearchQuery, setSubmittedSearchQuery] = useState("");
  const triggered = !isEmpty(submittedSearchQuery);
  const { data, isFetching, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      enabled: triggered,
      queryKey: ["search-list", content, submittedSearchQuery],
      queryFn: ({ pageParam: page }) =>
        fetchData({ page, type: content as ContentType, query: submittedSearchQuery }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.currentPage < lastPage.metadata.maxPage 
          ? lastPage.metadata.currentPage + 1 
          : undefined,
    });

  useEffect(() => {
    if (inViewport) {
      fetchNextPage();
    }
  }, [inViewport]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["search-list"] });
  }, [content]);

  const renderSearchResults = useMemo(() => {
    return () => {
      if (isEmpty(data?.pages[0]?.data)) {
        return (
          <h5 className="mt-56 text-center text-xl">
            No videos found with query{" "}
            <span className="text-secondary font-semibold">"{submittedSearchQuery}"</span>
          </h5>
        );
      }

      return (
        <>
          <h5 className="text-center text-xl">
            <span className="motion-preset-focus">
              Found{" "}
              <span className="text-success font-semibold">
                {data?.pages[0]?.data.length}
              </span>{" "}
              videos with query{" "}
              <span className="text-secondary font-semibold">"{submittedSearchQuery}"</span>
            </span>
          </h5>
          <div className="movie-grid">
            {data?.pages.map((page) =>
              page.data.map((video) => (
                <StreamixVideoCard key={video.id} video={video} variant="bordered" />
              )),
            )}
          </div>
        </>
      );
    };
  }, [content, data?.pages, submittedSearchQuery]);

  return (
    <div className="flex flex-col items-center gap-8">
      <SearchFilter
        isLoading={isFetching}
        onSearchSubmit={(value: string) => setSubmittedSearchQuery(value.trim())}
      />
      {triggered && (
        <>
          <div className="relative flex flex-col items-center gap-8">
            {isPending && (
              <Spinner
                size="lg"
                className="absolute-center mt-56"
                color="primary"
                variant="simple"
              />
            )}
            {!isPending && renderSearchResults()}
          </div>
          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && (
              <Spinner
                color="primary"
                size="lg"
                variant="wave"
                label="Loading more..."
              />
            )}
            {!isEmpty(data?.pages[0]?.data) && !hasNextPage && !isPending && (
              <p className="text-muted-foreground text-center text-base">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}

      <BackToTopButton />
    </div>
  );
};

export default SearchList;
