"use client";

import { Card, CardBody, CardFooter, CardHeader, Image, Link, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHover } from "@mantine/hooks";
import { StreamixVideo } from "@/api/streamix";
import useBreakpoints from "@/hooks/useBreakpoints";
import { getStreamixImageUrl } from "@/utils/movies";

interface HorizontalVideoCardProps {
  video: StreamixVideo;
}

const HorizontalVideoCard: React.FC<HorizontalVideoCardProps> = ({ video }) => {
  const { hovered, ref } = useHover();
  const { mobile } = useBreakpoints();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/watch/${video.id}`} ref={ref} className="w-full">
      <div className="group motion-preset-focus relative w-full overflow-hidden rounded-xl border-2 border-transparent transition-all hover:border-primary">
        <div className="relative aspect-video w-full overflow-hidden">
           {hovered && (
              <Icon
                icon="line-md:play-filled"
                width="48"
                height="48"
                className="absolute-center z-20 text-white opacity-90"
              />
            )}
          <Image
            alt={video.name}
            src={getStreamixImageUrl(video.poster)}
            radius="none"
            className="z-0 aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 z-10 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {formatDuration(video.duration)}
          </div>
        </div>
        <div className="flex flex-col gap-1 p-2">
          <h6 className="line-clamp-2 text-sm font-medium leading-tight group-hover:text-primary transition-colors">
            {video.name}
          </h6>
          <div className="flex items-center gap-2 text-[11px] text-default-500">
            <span>{video.resolution}</span>
            <span>•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HorizontalVideoCard;
