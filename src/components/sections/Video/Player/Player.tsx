"use client";

import { siteConfig } from "@/config/site";
import { cn } from "@/utils/helpers";
import { Card, Skeleton } from "@heroui/react";
import { useDocumentTitle, useIdle } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { streamixApi } from "@/api/streamix";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title, poster }) => {
  const idle = useIdle(3000);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useDocumentTitle(`Watch ${title} | ${siteConfig.name}`);

  const { data: player } = useQuery({
    queryFn: () => streamixApi.getDefaultPlayer(),
    queryKey: ["default-player"],
  });

  useEffect(() => {
    if (player?.domain) {
      setEmbedUrl(`https://${player.domain}/#${videoId}`);
    }
  }, [player, videoId]);

  return (
    <div className={cn("relative")}>
      <Card shadow="md" radius="none" className="relative aspect-video w-full overflow-hidden bg-black">
        {!embedUrl && <Skeleton className="absolute h-full w-full" />}
        {embedUrl && (
          <iframe
            allowFullScreen
            src={embedUrl}
            className={cn("z-10 h-full w-full")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </Card>
    </div>
  );
};

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
