"use client";

import { Suspense, use, useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { Params } from "@/types";
import { NextPage } from "next";
import { Chip, Button, Divider, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { streamixApi, StreamixVideo } from "@/api/streamix";
import { getStreamixImageUrl } from "@/utils/movies";

const VideoPlayer = dynamic(() => import("@/components/sections/Video/Player/Player"));

interface PublishedVideo extends StreamixVideo {
  isFeatured?: boolean;
  description?: string;
  tags?: string;
}

const VideoDetailPage: NextPage<Params<{ id: string }>> = ({ params }) => {
  const { id } = use(params);
  const [localOverride, setLocalOverride] = useState<PublishedVideo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("published_videos");
    if (saved) {
      try {
        const videos: PublishedVideo[] = JSON.parse(saved);
        const found = videos.find((v) => v.id === id);
        if (found) {
          setLocalOverride(found);
        }
      } catch (e) {
        console.error("Failed to parse published videos", e);
      }
    }
  }, [id]);

  const {
    data: apiVideo,
    isPending,
    error,
  } = useQuery({
    queryFn: () => streamixApi.getVideoById(id),
    queryKey: ["video-detail", id],
  });

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" color="primary" label="Loading video details..." />
      </div>
    );
  }

  if (error || !apiVideo) {
    return notFound();
  }

  // Merge API data with local overrides if they exist
  const video = localOverride ? { ...apiVideo, ...localOverride } : apiVideo as PublishedVideo;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTagColor = (tagName: string) => {
    const colors = [
      "primary", "secondary", "success", "warning", "danger"
    ] as const;
    const charCode = tagName.toLowerCase().charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const tags = video.tags ? video.tags.split(",").map(t => t.trim()).filter(t => t !== "") : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 min-h-screen bg-background text-white">
      <Suspense fallback={<Spinner size="lg" className="absolute-center" variant="simple" />}>
        <div className="flex flex-col gap-6">
          {/* Video Player Section - Centered and reduced size */}
          <div className="w-full overflow-hidden rounded-xl shadow-xl border-1 border-white/5 bg-black">
            <VideoPlayer videoId={video.id} title={video.name} poster={getStreamixImageUrl(video.poster)} />
          </div>

          {/* Video Info Section - Restored side-by-side layout */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold md:text-3xl tracking-tight">{video.name}</h1>

                <div className="flex flex-wrap items-center gap-3 text-base text-default-400">
                  <span className="flex items-center gap-1.5">
                    <Icon icon="heroicons:play-solid" />
                    {video.play.toLocaleString()} views
                  </span>
                  <span>•</span>
                  <span>{video.resolution}</span>
                  <span>•</span>
                  <span>{formatDuration(video.duration)}</span>
                  <span>•</span>
                  <span>Uploaded {formatDate(video.createdAt)}</span>
                </div>
              </div>

              {/* Action Buttons - Restored positions */}
              <div className="flex flex-wrap gap-2">
                <Button
                  color="primary"
                  variant="flat"
                  className="font-bold px-8"
                  startContent={<Icon icon="heroicons:heart-solid" width={20} />}
                >
                  Favourite
                </Button>
                <Button
                  variant="flat"
                  className="font-bold px-6"
                  startContent={<Icon icon="heroicons:hand-thumb-up-solid" width={20} />}
                >
                  Like
                </Button>
                <Tooltip content="Share">
                  <Button isIconOnly variant="flat" aria-label="Share">
                    <Icon icon="heroicons:share-solid" width={20} />
                  </Button>
                </Tooltip>
                <Button
                  as="a"
                  href={`https://streamix.upns.pro/#${video.id}&dl=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  isIconOnly
                  variant="flat"
                  aria-label="Download"
                  className="text-success"
                  startContent={<Icon icon="heroicons:arrow-down-tray-solid" width={20} />}
                />
              </div>
            </div>

            <Divider className="opacity-10" />

            {/* Combined Description & Tags Section - Heading inside */}
            <div className="rounded-2xl bg-secondary-background/50 p-6 border-1 border-divider flex flex-col gap-4">
               <h3 className="text-xl font-bold">Description</h3>
               
               {video.description ? (
                 <p className="whitespace-pre-wrap text-default-600 leading-relaxed text-base">
                   {video.description}
                 </p>
               ) : (
                 <p className="italic text-default-400 text-sm">No description provided for this video.</p>
               )}

               {tags.length > 0 && (
                 <div className="flex flex-col gap-2 pt-5 border-t border-divider/50">
                   <h4 className="text-[10px] font-bold text-default-400 uppercase tracking-widest">Tags</h4>
                   <div className="flex flex-wrap gap-2">
                     {tags.map((tag) => (
                       <Chip 
                         key={tag} 
                         color={getTagColor(tag)} 
                         variant="flat"
                         size="sm"
                         className="lowercase font-medium px-3"
                       >
                         {tag}
                       </Chip>
                     ))}
                   </div>
                 </div>
               )}
            </div>

          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default VideoDetailPage;
