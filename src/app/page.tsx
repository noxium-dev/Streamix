"use client";

import { useState, useEffect } from "react";
import { streamixApi, StreamixVideo } from "@/api/streamix";
import StreamixVideoCard from "@/components/sections/Video/Cards/Poster";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

interface PublishedVideo extends StreamixVideo {
  isFeatured?: boolean;
}

const VideoGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-lg" />
      </div>
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const { ref, inViewport } = useInViewport();
  const [publishedVideos, setPublishedVideos] = useState<PublishedVideo[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("published_videos");
    if (saved) {
      try {
        setPublishedVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse published videos", e);
      }
    }
  }, []);

  const { data, isPending, isError } = useQuery({
    queryFn: () => streamixApi.getVideos(1, 20),
    queryKey: ["home-videos"],
    enabled: isClient,
  });

  const apiVideos = data?.data || [];
  const featuredVideos = publishedVideos.filter(v => v.isFeatured);
  const regularPublishedVideos = publishedVideos.filter(v => !v.isFeatured);

  // If we're server-side or haven't loaded local storage yet
  const showPublishedLoading = !isClient;

  return (
    <div className="flex flex-col gap-10">
      {/* Featured Published Section - Only shows specific featured videos */}
      {featuredVideos.length > 0 && (
        <div className="flex flex-col gap-4">
          <SectionTitle>Featured Content</SectionTitle>
          <Carousel>
            {featuredVideos.map((video) => (
              <div key={video.id} className="embla__slide flex min-h-fit max-w-fit px-1 py-2">
                <StreamixVideoCard video={video} />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Recently Published Section - Should show videos */}
      {(showPublishedLoading || regularPublishedVideos.length > 0 || apiVideos.length > 0) && (
        <div className="flex flex-col gap-4">
          <SectionTitle>Recently Added</SectionTitle>
          {showPublishedLoading || isPending ? (
            <VideoGridSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {/* Combine local published with API videos, but keep it varied */}
              {[...regularPublishedVideos, ...apiVideos.slice(0, 10)]
                .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Dedupe
                .slice(0, 10)
                .map((video) => (
                  <HorizontalVideoCard key={video.id} video={video} />
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* All Videos from API */}
      <div className="flex flex-col gap-4" ref={ref}>
        <SectionTitle>Discover More ({data?.metadata?.total || 0})</SectionTitle>
        {isPending ? (
          <VideoGridSkeleton />
        ) : isError ? (
          <div className="h-40 flex items-center justify-center text-default-400 border-2 border-dashed border-divider rounded-xl">
             <p>Unable to connect to video library. Please try again later.</p>
          </div>
        ) : apiVideos.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-default-400 border-2 border-dashed border-divider rounded-xl">
             <p>No videos found in the library.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {apiVideos.map((video) => (
              <HorizontalVideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
