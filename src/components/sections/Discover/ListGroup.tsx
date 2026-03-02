"use client";

import { streamixApi, StreamixVideo } from "@/api/streamix";
import StreamixVideoCard from "@/components/sections/Video/Cards/Poster";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { Spinner } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

const DiscoverList = () => {
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: () => streamixApi.getVideos(1, 50),
    queryKey: ["all-videos"],
    enabled: inViewport,
  });

  const videos = data?.data || [];

  return (
    <div className="flex flex-col gap-8">
      {isPending ? (
        <Spinner size="lg" className="absolute-center mt-56" color="primary" />
      ) : (
        <>
          <h2 className="text-2xl font-bold">All Videos ({data?.metadata.total || 0})</h2>
          <div className="movie-grid" ref={ref}>
            {videos.map((video) => (
              <StreamixVideoCard key={video.id} video={video} />
            ))}
          </div>
        </>
      )}
      <BackToTopButton />
    </div>
  );
};

export default DiscoverList;
