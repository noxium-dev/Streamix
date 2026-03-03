"use client";

import { streamixApi, StreamixVideo } from "@/api/streamix";
import StreamixVideoCard from "@/components/sections/Video/Cards/Poster";
import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";

interface VideoHomeListProps {
  name: string;
  query: () => Promise<any>;
  param: string;
}

const VideoHomeList: React.FC<VideoHomeListProps> = ({ query, name, param }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: query,
    queryKey: [key],
    enabled: inViewport,
  });

  const videos: StreamixVideo[] = data?.data || [];

  return (
    <section id={key} className="min-h-[250px] md:min-h-[300px]" ref={ref}>
      {isPending ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex grow items-center justify-between">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
        </div>
      ) : (
        <div className="z-3 flex flex-col gap-2">
          <div className="flex grow items-center justify-between">
            <SectionTitle>{name}</SectionTitle>
            <a
              href="/videos"
              className="text-sm text-foreground hover:text-primary"
            >
              See All &gt;
            </a>
          </div>
          <Carousel>
            {videos.map((video) => {
              return (
                <div
                  key={video.id}
                  className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
                >
                  <StreamixVideoCard video={video} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default VideoHomeList;
