"use client";

import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import { siteConfig } from "@/config/site";
import { Spinner } from "@heroui/react";
import dynamic from "next/dynamic";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { Suspense } from "react";
const VideoHomeList = dynamic(() => import("@/components/sections/Video/HomeList"));

const HomePageList: React.FC = () => {
  const { movies } = siteConfig.queryLists;
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie"]).withDefault("movie"),
  );

  return (
    <div className="flex flex-col gap-12">
      <ContentTypeSelection className="justify-center" />
      <div className="relative flex min-h-32 flex-col gap-12">
        <Suspense
          fallback={
            <Spinner
              size="lg"
              variant="simple"
              className="absolute-center"
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
