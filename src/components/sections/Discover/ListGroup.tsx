"use client";

import { streamixApi } from "@/api/streamix";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";

const DiscoverList = () => {
  const { data: videos, isPending } = useQuery({
    queryFn: () => streamixApi.getPublishedVideos(),
    queryKey: ["published-videos"],
  });

  return (
    <div className="flex flex-col gap-6 py-2 min-h-[70vh]">
      {isPending ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <Spinner size="lg" color="primary" labelColor="primary" label="Loading collection..." />
          <p className="animate-pulse text-sm text-default-400">Fetching the latest content for you</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
             <SectionTitle>All Videos</SectionTitle>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {videos?.map((video: any) => (
              <HorizontalVideoCard key={video.id} video={video} />
            ))}
          </div>

          {videos?.length === 0 && (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center rounded-[2.5rem] border-2 border-dashed border-divider bg-default-50/30 backdrop-blur-sm px-6">
               <div className="relative">
                 <Icon icon="solar:videocamera-off-bold-duotone" width="80" className="text-default-200" />
                 <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white">
                   <Icon icon="solar:info-circle-bold" width="14" />
                 </div>
               </div>
               <div className="flex flex-col gap-2 max-w-sm">
                 <p className="text-2xl font-bold tracking-tight">Your collection is empty</p>
                 <p className="text-default-400">
                   We haven't published any videos yet. Please check back later or contact support if you believe this is an error.
                 </p>
               </div>
               <a 
                 href="/"
                 className="mt-2 rounded-full bg-primary px-8 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
               >
                 Go back home
               </a>
            </div>
          )}
        </>
      )}
      <BackToTopButton />
    </div>
  );
};

export default DiscoverList;
