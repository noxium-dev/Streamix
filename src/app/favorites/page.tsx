"use client";

import React, { useState, useEffect } from "react";
import SectionTitle from "@/components/ui/other/SectionTitle";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);
  }, []);

  const clearAll = () => {
    if (confirm("Clear all favourites?")) {
      localStorage.removeItem("favorites");
      setFavorites([]);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 min-h-[70vh]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <SectionTitle>My Favourites</SectionTitle>
          <p className="text-default-500 font-medium leading-relaxed max-w-2xl">
            All your saved videos in one place. Your favourites are stored locally on this device.
          </p>
        </div>
        {favorites.length > 0 && (
          <Button 
            color="danger" 
            variant="flat" 
            size="sm"
            onPress={clearAll}
            startContent={<Icon icon="solar:trash-bin-trash-bold" />}
          >
            Clear All
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 text-center rounded-[2.5rem] border-2 border-dashed border-divider bg-default-50/30 backdrop-blur-sm px-6">
          <div className="relative">
            <Icon icon="solar:heart-broken-bold-duotone" width={80} className="text-default-200" />
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <p className="text-2xl font-bold tracking-tight">No Favourites Yet</p>
            <p className="text-default-400 font-medium">
              Start adding your favorite videos by clicking the heart icon on any video page.
            </p>
          </div>
          <Button 
            as="a" 
            href="/videos"
            color="primary"
            className="mt-2 rounded-full px-8 py-6 font-bold shadow-lg shadow-primary/20"
          >
            Explore Videos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((video) => (
            <HorizontalVideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
