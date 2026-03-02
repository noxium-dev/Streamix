"use client";

import { useState, useEffect } from "react";
import { 
  Input, 
  Button, 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Image,
  Textarea,
  Spacer,
  addToast,
  Switch,
  cn,
  Spinner,
  Chip
} from "@heroui/react";
import { streamixApi, StreamixVideoDetail, StreamixVideo } from "@/api/streamix";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import { Icon } from "@iconify/react";
import { getStreamixImageUrl } from "@/utils/movies";

interface PublishedVideo extends StreamixVideo {
  isFeatured?: boolean;
  description?: string;
  tags?: string; // Comma separated tags
}

export default function AdminPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingThumb, setIsFetchingThumb] = useState(false);
  const [videoData, setVideoData] = useState<Partial<PublishedVideo> | null>(null);
  const [publishedVideos, setPublishedVideos] = useState<PublishedVideo[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("published_videos");
    if (saved) {
      try {
        setPublishedVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse published videos", e);
      }
    }
  }, []);

  const extractId = (input: string) => {
    let id = input.trim();
    try {
      if (id.includes("://") || id.includes("upnshare.com") || id.includes("upns.pro")) {
        const urlObj = new URL(id.startsWith("http") ? id : `https://${id}`);
        if (urlObj.pathname.startsWith("/v/")) {
          return urlObj.pathname.split("/")[2];
        } else if (urlObj.hash) {
          return urlObj.hash.substring(1).split("&")[0];
        }
      }
    } catch (e) {
      if (id.includes("/v/")) {
        return id.split("/v/")[1].split("/")[0].split("?")[0];
      } else if (id.includes("#")) {
        return id.split("#")[1].split("&")[0].split("?")[0];
      }
    }
    return id;
  };

  const handleFetch = async () => {
    if (!url) {
      addToast({ title: "Please enter a video URL or ID", color: "danger" });
      return;
    }

    setIsLoading(true);
    setIsEditing(false);
    try {
      const id = extractId(url);
      const data = await streamixApi.getVideoById(id);
      
      setVideoData({ 
        ...data, 
        isFeatured: false,
        description: "",
        tags: ""
      });
      setIsFeatured(false);
      addToast({ title: "Video metadata fetched", color: "success" });
    } catch (error) {
      console.error(error);
      addToast({ title: "Failed to fetch video info", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchThumbnail = async () => {
    if (!videoData?.id) return;
    
    setIsFetchingThumb(true);
    try {
      const data = await streamixApi.getVideoById(videoData.id);
      setVideoData(prev => prev ? { ...prev, poster: data.poster } : null);
      addToast({ title: "Thumbnail refreshed from API", color: "success" });
    } catch (error) {
      addToast({ title: "Failed to refresh thumbnail", color: "danger" });
    } finally {
      setIsFetchingThumb(false);
    }
  };

  const handleEdit = (video: PublishedVideo) => {
    setVideoData(video);
    setIsFeatured(!!video.isFeatured);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({ title: `Editing: ${video.name}`, color: "secondary" });
  };

  const handlePublish = () => {
    if (!videoData) return;

    const newVideo = { ...videoData, isFeatured } as PublishedVideo;
    let updated;
    
    if (isEditing) {
      updated = publishedVideos.map(v => v.id === newVideo.id ? newVideo : v);
    } else {
      updated = [newVideo, ...publishedVideos];
    }
    
    // Deduplicate by ID
    const unique = updated.filter((v, index, self) =>
      index === self.findIndex((t) => t.id === v.id)
    );

    setPublishedVideos(unique);
    localStorage.setItem("published_videos", JSON.stringify(unique));
    addToast({ 
      title: isEditing ? "Video updated successfully!" : "Video published successfully!", 
      color: "success" 
    });
    
    if (isEditing) {
      setIsEditing(false);
      setVideoData(null);
      setUrl("");
    }
  };

  const handleRemove = (id: string) => {
    const updated = publishedVideos.filter(v => v.id !== id);
    setPublishedVideos(updated);
    localStorage.setItem("published_videos", JSON.stringify(updated));
    addToast({ title: "Video removed", color: "success" });
    if (videoData?.id === id) {
      setVideoData(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-10 px-4">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Icon icon="material-symbols:admin-panel-settings-outline" className="text-primary" />
          Admin Dashboard
        </h1>
        <p className="text-default-500">
          Manage and publish video content to the main UI.
        </p>
      </section>

      <Card className={cn(
        "bg-secondary-background/50 backdrop-blur-md border-1",
        isEditing ? "border-secondary shadow-lg shadow-secondary/10" : "border-divider"
      )}>
        <CardHeader className="flex flex-col items-start gap-1 pb-2">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold">{isEditing ? "Edit Content" : "Fetch Content"}</p>
            {isEditing && <Chip size="sm" color="secondary" variant="flat">Editing Mode</Chip>}
          </div>
          <p className="text-small text-default-500">
            {isEditing ? `You are currently editing ${videoData?.name}` : "Enter Streamix or Upnshare video link"}
          </p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-6 py-6">
          {!isEditing && (
            <div className="flex gap-2">
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://upnshare.com/v/..." 
                variant="bordered"
                className="flex-1"
                startContent={<Icon icon="lucide:link" className="text-default-400" />}
              />
              <Button 
                color="primary" 
                onPress={handleFetch}
                isLoading={isLoading}
                className="font-bold"
                startContent={!isLoading && <Icon icon="lucide:zap" />}
              >
                Fetch Data
              </Button>
            </div>
          )}

          {videoData && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="md:col-span-4 flex flex-col gap-4">
                <p className="text-sm font-semibold text-default-600 uppercase tracking-wider">Preview</p>
                <div className="flex flex-col gap-4">
                  <div className="pointer-events-none grayscale-[0.2]">
                    <HorizontalVideoCard video={videoData as StreamixVideo} />
                  </div>
                  <Button 
                    variant="flat" 
                    color="secondary" 
                    className="w-full font-semibold"
                    onPress={handleFetchThumbnail}
                    isLoading={isFetchingThumb}
                    startContent={<Icon icon="lucide:image" />}
                  >
                    Force Fetch Thumbnail
                  </Button>
                  <p className="text-[10px] text-default-400 text-center italic">Tooltips disabled in preview mode</p>
                </div>
              </div>
              
              <div className="md:col-span-8 flex flex-col gap-5">
                <p className="text-sm font-semibold text-default-600 uppercase tracking-wider">Configuration</p>
                <Input 
                  label="Title"
                  value={videoData.name}
                  onChange={(e) => setVideoData({...videoData, name: e.target.value})}
                  variant="flat"
                />
                
                <Input 
                  label="Thumbnail URL (Auto-fetched)"
                  value={videoData.poster}
                  onChange={(e) => setVideoData({...videoData, poster: e.target.value})}
                  variant="flat"
                />
                
                <Textarea 
                  label="Description"
                  placeholder="Enter video description..."
                  value={videoData.description}
                  onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                  variant="flat"
                  minRows={3}
                />

                <Input 
                  label="Tags (Comma separated)"
                  placeholder="action, drama, sci-fi"
                  value={videoData.tags}
                  onChange={(e) => setVideoData({...videoData, tags: e.target.value})}
                  variant="flat"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Resolution"
                    value={videoData.resolution}
                    onChange={(e) => setVideoData({...videoData, resolution: e.target.value})}
                    variant="flat"
                  />
                  <Input 
                    label="Duration (s)"
                    type="number"
                    value={String(videoData.duration)}
                    onChange={(e) => setVideoData({...videoData, duration: Number(e.target.value)})}
                    variant="flat"
                  />
                </div>

                <div className="p-4 rounded-xl border-1 border-divider bg-default-50/50 flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-bold">Featured Content</p>
                    <p className="text-xs text-default-500">Display this video in the featured carousel.</p>
                  </div>
                  <Switch 
                    isSelected={isFeatured} 
                    onValueChange={setIsFeatured}
                    color="primary"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <Button 
                    color={isEditing ? "secondary" : "primary"}
                    size="lg"
                    className="flex-1 font-bold shadow-lg"
                    onPress={handlePublish}
                    startContent={<Icon icon={isEditing ? "lucide:save" : "lucide:send"} />}
                  >
                    {isEditing ? "Update Content" : "Publish Content"}
                  </Button>
                  {isEditing && (
                    <Button 
                      size="lg" 
                      variant="flat" 
                      onPress={() => {
                        setIsEditing(false);
                        setVideoData(null);
                        setUrl("");
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold">Published Collection</h2>
            <p className="text-sm text-default-500">Currently live on the main UI</p>
          </div>
          {publishedVideos.length > 0 && (
            <Button size="sm" color="danger" variant="flat" onPress={() => {
              localStorage.removeItem("published_videos");
              setPublishedVideos([]);
              addToast({title: "Collection cleared", color: "warning"});
            }}>
              Clear Collection
            </Button>
          )}
        </div>
        
        {publishedVideos.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-divider rounded-2xl text-default-400 bg-default-50/30">
            <Icon icon="lucide:layout-template" width="40" className="mb-2 opacity-20" />
            <p className="font-medium">No content published yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {publishedVideos.map((video) => (
              <div key={video.id} className="relative group flex flex-col gap-2">
                <HorizontalVideoCard video={video} />
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    {video.isFeatured && (
                      <Chip size="sm" color="primary" variant="flat" startContent={<Icon icon="lucide:star" width="12" />}>
                        Featured
                      </Chip>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      color="secondary" 
                      variant="light"
                      onPress={() => handleEdit(video)}
                    >
                      <Icon icon="lucide:edit" width={18} />
                    </Button>
                    <Button 
                      isIconOnly 
                      size="sm" 
                      color="danger" 
                      variant="light"
                      onPress={() => handleRemove(video.id)}
                    >
                      <Icon icon="lucide:trash-2" width="18" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
