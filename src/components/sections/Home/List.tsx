"use client";

import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import { siteConfig } from "@/config/site";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import VideoHomeList from "../Video/HomeList";

const HomePageList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const content = searchParams.get("content") || "movie";
  const { movies } = siteConfig.queryLists;

  const setContent = (newContent: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newContent === "movie") nextParams.delete("content");
    else nextParams.set("content", newContent);
    setSearchParams(nextParams);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <ContentTypeSelection
          selectedKey={content}
          onSelectionChange={(key) => setContent(key as string)}
        />
      </div>

      <div className="flex flex-col gap-8">
        <Suspense
          fallback={
            <LoadingSpinner
              size="lg"
              className="mt-20 self-center"
              color="primary"
            />
          }
        >
          {content === "movie" &&
            movies.map((item) => <VideoHomeList key={item.name} {...item} />)}
        </Suspense>
      </div>
    </div>
  );
};

export default HomePageList;
