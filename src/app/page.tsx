"use client";

import { useState, useEffect } from "react";
import { streamixApi, StreamixVideo } from "@/api/streamix";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import SectionTitle from "@/components/ui/other/SectionTitle";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface PublishedVideo extends StreamixVideo {
  isFeatured?: boolean;
}

const HomePage: React.FC = () => {
  const [publishedVideos, setPublishedVideos] = useState<PublishedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPublishedVideos();
  }, []);

  const loadPublishedVideos = async () => {
    try {
      const videos = await streamixApi.getPublishedVideos();
      setPublishedVideos(videos.map((v: any) => ({
        ...v,
        isFeatured: Boolean(v.isFeatured)
      })));
    } catch (error) {
      console.error("Failed to load published videos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const featuredVideos = publishedVideos.filter(v => v.isFeatured);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Featured Published Section - Only shows specific featured videos */}
      {featuredVideos.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionTitle>Featured Content</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {featuredVideos.slice(0, 5).map((video) => (
              <HorizontalVideoCard key={video.id} video={video as any} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Published Section - Only D1 published videos */}
      {publishedVideos.length > 0 && (
        <div className="flex flex-col gap-3">
          <SectionTitle>Recently Added</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {publishedVideos.slice(0, 10).map((video) => (
              <HorizontalVideoCard key={video.id} video={video as any} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
