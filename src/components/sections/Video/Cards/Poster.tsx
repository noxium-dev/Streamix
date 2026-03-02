"use client";

import Rating from "@/components/ui/other/Rating";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useLongPress } from "use-long-press";
import { StreamixVideo } from "@/api/streamix";
import { getStreamixImageUrl } from "@/utils/movies";
import { useCallback } from "react";

interface StreamixVideoCardProps {
  video: StreamixVideo;
  variant?: "full" | "bordered";
}

const StreamixVideoCard: React.FC<StreamixVideoCardProps> = ({ video, variant = "full" }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const posterImage = getStreamixImageUrl(video.poster);
  const title = video.name;
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, [handlers, startVibration]);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Link href={`/watch/${video.id}`} ref={ref} {...longPress()} className="w-full">
        {variant === "full" && (
          <div className="group motion-preset-focus relative aspect-2/3 overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-primary">
            {hovered && (
              <Icon
                icon="line-md:play-filled"
                width="64"
                height="64"
                className="absolute-center z-20 text-white"
              />
            )}
            <div className="absolute bottom-0 z-2 h-1/2 w-full bg-linear-to-t from-black from-1%"></div>
            <div className="absolute bottom-0 z-3 flex w-full flex-col gap-1 px-4 py-3">
              <h6 className="truncate text-sm font-semibold">{title}</h6>
              <div className="flex justify-between text-xs">
                <p>{video.resolution}</p>
                <p>{formatDuration(video.duration)}</p>
              </div>
            </div>
            <Image
              alt={title}
              src={posterImage}
              radius="none"
              className="z-0 aspect-2/3 h-[250px] w-full object-cover object-center transition group-hover:scale-110 md:h-[300px]"
              classNames={{
                img: "group-hover:opacity-70",
              }}
            />
          </div>
        )}

        {variant === "bordered" && (
          <Card
            isHoverable
            fullWidth
            shadow="md"
            className="group h-full bg-secondary-background"
          >
            <CardHeader className="flex items-center justify-center pb-0">
              <div className="relative size-full">
                {hovered && (
                  <Icon
                    icon="line-md:play-filled"
                    width="64"
                    height="64"
                    className="absolute-center z-20 text-white"
                  />
                )}
                <div className="relative overflow-hidden rounded-large">
                  <Image
                    isBlurred
                    alt={title}
                    className="aspect-2/3 rounded-lg object-cover object-center group-hover:scale-110"
                    src={posterImage}
                  />
                </div>
              </div>
            </CardHeader>
            <CardBody className="gap-3 overflow-visible pb-0 pt-1">
              <h6 className="truncate font-semibold">{title}</h6>
              <div className="flex items-center justify-between text-xs text-default-400">
                <p>{video.resolution}</p>
                <p>{formatDuration(video.duration)}</p>
              </div>
            </CardBody>
          </Card>
        )}
      </Link>
    </>
  );
};

export default StreamixVideoCard;
