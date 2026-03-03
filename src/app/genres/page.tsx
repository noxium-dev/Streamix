"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { streamixApi, Genre } from "@/api/streamix";
import { Spinner, Card, CardBody, Image, Tooltip } from "@heroui/react";
import SectionTitle from "@/components/ui/other/SectionTitle";
import { Icon } from "@iconify/react";

const GenresPage = () => {
  const { data: genres, isPending } = useQuery({
    queryFn: () => streamixApi.getGenres(),
    queryKey: ["genres"],
  });

  return (
    <div className="flex flex-col gap-6 py-2 min-h-[70vh]">
      <div className="flex flex-col gap-3">
        <SectionTitle>Movie Genres</SectionTitle>
      </div>

      {isPending ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" color="primary" label="Loading genres..." />
        </div>
      ) : genres?.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center border-2 border-dashed border-divider rounded-3xl text-default-400">
           <Icon icon="solar:bill-list-bold-duotone" width="60" className="opacity-20 mb-2" />
           <p>No genres available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {genres?.map((genre: Genre) => (
            <Card 
              key={genre.id} 
              isPressable
              className="bg-secondary-background/40 hover:bg-secondary-background/70 border-1 border-divider/50 transition-all duration-300 hover:scale-[1.01]"
            >
              <CardBody className="p-3.5 flex flex-col gap-1.5">
                <div className="flex items-center gap-3">
                  {/* Icon Section */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border-1 border-primary/20 shadow-inner">
                    {genre.icon ? (
                      <Image 
                        src={genre.icon} 
                        alt={genre.name} 
                        className="w-full h-full object-cover"
                        radius="none"
                      />
                    ) : (
                      <Icon icon="solar:mask-happly-bold-duotone" className="text-primary/40" width="20" />
                    )}
                  </div>
                  
                  <h3 className="font-bold text-base tracking-tight text-foreground truncate uppercase">
                    {genre.name}
                  </h3>
                </div>
                
                {/* Description Section with Tooltip */}
                <Tooltip 
                  content={genre.description || `Explore our latest ${genre.name} collection.`}
                  placement="bottom"
                  showArrow
                  classNames={{
                    base: "before:bg-default-200",
                    content: "py-2 px-3 shadow-xl text-default-900 bg-default-100 max-w-[250px] text-xs font-medium",
                  }}
                  delay={500}
                >
                  <p className="text-[0.95rem] text-default-500 line-clamp-2 leading-snug font-medium px-0.5 cursor-help">
                    {genre.description || `Explore our latest ${genre.name} collection.`}
                  </p>
                </Tooltip>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenresPage;
