"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Chip, Button, Divider, Tooltip, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { streamixApi, StreamixVideo, PublishedVideo } from "@/api/streamix";
import { getStreamixImageUrl } from "@/utils/movies";

const VideoPlayer = React.lazy(() => import("@/components/sections/Video/Player/Player"));

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [localOverride, setLocalOverride] = useState<PublishedVideo | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadPublishedVideo(id);
    checkIsFavorite(id);
  }, [id]);

  const checkIsFavorite = (videoId: string) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: any) => fav.id === videoId));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: any) => fav.id !== id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      addToast({ title: "Removed from Favourites", color: "warning" });
    } else {
      const videoToSave = {
        id: video.id,
        name: video.name,
        poster: video.poster,
        resolution: video.resolution,
        duration: video.duration,
        createdAt: video.createdAt
      };
      favorites.push(videoToSave);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      addToast({ title: "Added to Favourites", color: "success" });
    }
  };

  const loadPublishedVideo = async (videoId: string) => {
    try {
      const video = await streamixApi.getPublishedVideoById(videoId);
      if (video) {
        setLocalOverride({
          ...video,
          isFeatured: Boolean(video.isFeatured)
        });
      }
    } catch (error) {
      console.error("Failed to load published video", error);
    }
  };

  const {
    data: apiVideo,
    isPending,
    error,
  } = useQuery({
    queryFn: () => streamixApi.getVideoById(id!),
    queryKey: ["video-detail", id],
    enabled: !!id,
  });

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error || !apiVideo) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-white">
        <h2 className="text-2xl font-bold">Video Not Found</h2>
        <Button as="a" href="/">Go Home</Button>
      </div>
    );
  }

  // Merge API data with local overrides if they exist
  const video = localOverride 
    ? { ...apiVideo, ...localOverride, isFeatured: localOverride.isFeatured, like: localOverride.like || 0 } as PublishedVideo
    : apiVideo as unknown as PublishedVideo;

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

  const tags = video.tags
    ? (Array.isArray(video.tags) ? video.tags : video.tags.split(",").map(t => t.trim()).filter(t => t !== ""))
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 min-h-screen bg-background text-white">
      <Suspense fallback={<Spinner size="lg" className="absolute-center" variant="simple" />}>
        <div className="flex flex-col gap-6">
          {/* Video Player Section */}
          <div className="w-full overflow-hidden rounded-xl shadow-xl border-1 border-white/5 bg-black">
            <VideoPlayer videoId={video.id} title={video.name} poster={getStreamixImageUrl(video.poster)} />
          </div>

          {/* Video Info Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <h1 className="text-2xl font-bold md:text-3xl tracking-tight flex-1">{video.name}</h1>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <Button
                    color={isFavorite ? "danger" : "primary"}
                    variant={isFavorite ? "solid" : "flat"}
                    className="font-bold px-8"
                    onPress={toggleFavorite}
                    startContent={<Icon icon={isFavorite ? "heroicons:heart-solid" : "heroicons:heart"} width={20} />}
                  >
                    {isFavorite ? "Favourited" : "Favourite"}
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

            <Divider className="opacity-10" />

            {/* Combined Description & Tags Section */}
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
