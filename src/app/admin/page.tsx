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
  Chip,
  Tabs,
  Tab,
  Tooltip,
  Select,
  SelectItem
} from "@heroui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { streamixApi, StreamixVideoDetail, StreamixVideo, PublishedVideo, Genre, Artist } from "@/api/streamix";
import HorizontalVideoCard from "@/components/sections/Video/Cards/Horizontal";
import { Icon } from "@iconify/react";
import { getStreamixImageUrl } from "@/utils/movies";

interface AdminVideoData {
  id?: string;
  name?: string;
  poster?: string;
  resolution?: string;
  duration?: number;
  play?: number;
  like?: number;
  isFeatured?: boolean;
  description?: string;
  tags?: string;
  genreId?: string;
  artistId?: string;
  createdAt?: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("videos");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingThumb, setIsFetchingThumb] = useState(false);
  const [videoData, setVideoData] = useState<AdminVideoData | null>(null);
  const [publishedVideos, setPublishedVideos] = useState<AdminVideoData[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  // Genre states
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoadingGenres, setIsLoadingGenres] = useState(false);
  const [genreData, setGenreData] = useState<Partial<Genre>>({ name: "", icon: "", description: "" });
  const [isEditingGenre, setIsEditingGenre] = useState(false);

  // Artist states
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [artistData, setArtistData] = useState<Partial<Artist>>({ name: "", bio: "", avatar: "", socialLinks: "{}" });
  const [isEditingArtist, setIsEditingArtist] = useState(false);

  useEffect(() => {
    localStorage.removeItem("published_videos");
    loadPublishedVideos();
    loadGenres();
    loadArtists();
  }, []);

  const loadGenres = async () => {
    setIsLoadingGenres(true);
    try {
      const data = await streamixApi.getGenres();
      setGenres(data);
    } catch (error) {
      console.error("Failed to load genres", error);
    } finally {
      setIsLoadingGenres(false);
    }
  };

  const handleGenreSubmit = async () => {
    if (!genreData.name) {
      addToast({ title: "Name is required", color: "danger" });
      return;
    }

    try {
      if (isEditingGenre && genreData.id) {
        await streamixApi.updateGenre(genreData.id, genreData);
        addToast({ title: "Genre updated", color: "success" });
      } else {
        const id = genreData.name.toLowerCase().replace(/\s+/g, '-');
        await streamixApi.createGenre({ ...genreData, id } as Genre);
        addToast({ title: "Genre created", color: "success" });
      }
      setGenreData({ name: "", icon: "", description: "" });
      setIsEditingGenre(false);
      loadGenres();
    } catch (error) {
      addToast({ title: "Operation failed", color: "danger" });
    }
  };

  const handleEditGenre = (genre: Genre) => {
    setGenreData(genre);
    setIsEditingGenre(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGenre = async (id: string) => {
    if (confirm("Are you sure you want to delete this genre?")) {
      try {
        await streamixApi.deleteGenre(id);
        addToast({ title: "Genre deleted", color: "success" });
        loadGenres();
      } catch (error) {
        addToast({ title: "Delete failed", color: "danger" });
      }
    }
  };

  const loadArtists = async () => {
    setIsLoadingArtists(true);
    try {
      const data = await streamixApi.getArtists();
      setArtists(data);
    } catch (error) {
      console.error("Failed to load artists", error);
    } finally {
      setIsLoadingArtists(false);
    }
  };

  const handleArtistSubmit = async () => {
    if (!artistData.name) {
      addToast({ title: "Name is required", color: "danger" });
      return;
    }

    try {
      if (isEditingArtist && artistData.id) {
        await streamixApi.updateArtist(artistData.id, artistData);
        addToast({ title: "Artist updated", color: "success" });
      } else {
        const id = artistData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        await streamixApi.createArtist({ ...artistData, id } as Artist);
        addToast({ title: "Artist created", color: "success" });
      }
      setArtistData({ name: "", bio: "", avatar: "", socialLinks: "{}" });
      setIsEditingArtist(false);
      loadArtists();
    } catch (error) {
      addToast({ title: "Operation failed", color: "danger" });
    }
  };

  const handleEditArtist = (artist: Artist) => {
    setArtistData(artist);
    setIsEditingArtist(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArtist = async (id: string) => {
    if (confirm("Are you sure you want to delete this artist?")) {
      try {
        await streamixApi.deleteArtist(id);
        addToast({ title: "Artist deleted", color: "success" });
        loadArtists();
      } catch (error) {
        addToast({ title: "Delete failed", color: "danger" });
      }
    }
  };

  const loadPublishedVideos = async () => {
    setIsLoadingVideos(true);
    try {
      const videos = await streamixApi.getPublishedVideos();
      setPublishedVideos(videos.map((v: any) => ({
        ...v,
        isFeatured: Boolean(v.isFeatured)
      })));
    } catch (error) {
      console.error("Failed to load published videos", error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

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

  const handleEdit = (video: AdminVideoData) => {
    setVideoData(video);
    setIsFeatured(!!video.isFeatured);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({ title: `Editing: ${video.name}`, color: "secondary" });
  };

  const handlePublish = async () => {
    if (!videoData) return;

    const newVideo = {
      ...videoData,
      isFeatured,
      play: videoData.play || 0,
      like: videoData.like || 0
    };

    try {
      if (isEditing) {
        await streamixApi.updatePublishedVideo(newVideo.id!, newVideo);
        setPublishedVideos(prev => prev.map(v => v.id === newVideo.id ? { ...v, ...newVideo } : v));
        addToast({ title: "Video updated successfully!", color: "success" });
      } else {
        await streamixApi.publishVideo(newVideo as any);
        setPublishedVideos(prev => [{ ...newVideo, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any, ...prev]);
        addToast({ title: "Video published successfully!", color: "success" });
      }

      if (isEditing) {
        setIsEditing(false);
        setVideoData(null);
        setUrl("");
      }
    } catch (error) {
      console.error("Failed to save video", error);
      addToast({ title: "Failed to save video", color: "danger" });
    }
  };

  const handleRemove = async (id: string) => {
    if (!id) {
      addToast({ title: "Invalid video ID", color: "danger" });
      return;
    }
    try {
      await streamixApi.deletePublishedVideo(id);
      setPublishedVideos(prev => prev.filter(v => v.id !== id));
      addToast({ title: "Video removed from database", color: "success" });
      if (videoData?.id === id) {
        setVideoData(null);
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error("Failed to delete video", error);
      const errorMsg = error?.message || error?.details || "Unknown error";
      addToast({ title: `Failed to delete: ${errorMsg}`, color: "danger" });
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
          Manage your site's content and structure.
        </p>
      </section>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary font-bold"
        }}
      >
        <Tab
          key="videos"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:video" width={20} />
              <span>Videos</span>
            </div>
          }
        >
          <div className="flex flex-col gap-8 mt-4">
            <Card className={cn(
              "bg-secondary-background/50 backdrop-blur-md border-1",
              isEditing ? "border-secondary shadow-lg shadow-secondary/10" : "border-divider"
            )}>
              {/* ... (rest of video edit card) */}
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
                        onChange={(e) => setVideoData({ ...videoData, name: e.target.value })}
                        variant="flat"
                      />

                      <Input
                        label="Thumbnail URL (Auto-fetched)"
                        value={videoData.poster}
                        onChange={(e) => setVideoData({ ...videoData, poster: e.target.value })}
                        variant="flat"
                      />

                      <Textarea
                        label="Description"
                        placeholder="Enter video description..."
                        value={videoData.description}
                        onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                        variant="flat"
                        minRows={3}
                      />

                      <Input
                        label="Tags (Comma separated)"
                        placeholder="action, drama, sci-fi"
                        value={videoData.tags}
                        onChange={(e) => setVideoData({ ...videoData, tags: e.target.value })}
                        variant="flat"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Genre"
                          placeholder="Select a genre"
                          selectedKeys={videoData.genreId ? [videoData.genreId] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            setVideoData({ ...videoData, genreId: selected || undefined });
                          }}
                          variant="flat"
                        >
                          {genres.map((genre) => (
                            <SelectItem key={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </Select>

                        <Select
                          label="Artist"
                          placeholder="Select an artist"
                          selectedKeys={videoData.artistId ? [videoData.artistId] : []}
                          onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as string;
                            setVideoData({ ...videoData, artistId: selected || undefined });
                          }}
                          variant="flat"
                        >
                          {artists.map((artist) => (
                            <SelectItem key={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Resolution"
                          value={videoData.resolution}
                          onChange={(e) => setVideoData({ ...videoData, resolution: e.target.value })}
                          variant="flat"
                        />
                        <Input
                          label="Duration (s)"
                          type="number"
                          value={String(videoData.duration)}
                          onChange={(e) => setVideoData({ ...videoData, duration: Number(e.target.value) })}
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:refresh-cw" />}
                    onPress={loadPublishedVideos}
                  >
                    Refresh
                  </Button>
                  <Button
                    size="sm"
                    color="secondary"
                    variant="flat"
                    startContent={<Icon icon="lucide:download" />}
                    onPress={async () => {
                      try {
                        const data = await streamixApi.getVideos(1, 50);
                        const videos = data.data || [];
                        for (const video of videos) {
                          const exists = publishedVideos.some(p => p.id === video.id);
                          if (!exists) {
                            await streamixApi.publishVideo({
                              id: video.id,
                              name: video.name,
                              poster: video.poster,
                              resolution: video.resolution,
                              duration: video.duration,
                              play: video.play,
                              like: 0,
                              isFeatured: false,
                              description: "",
                              tags: ""
                            });
                          }
                        }
                        await loadPublishedVideos();
                        addToast({ title: `Added ${videos.length} videos to collection`, color: "success" });
                      } catch (error) {
                        console.error("Failed to fetch videos", error);
                        addToast({ title: "Failed to fetch videos", color: "danger" });
                      }
                    }}
                  >
                    Fetch from API
                  </Button>
                  {publishedVideos.length > 0 && (
                    <Button size="sm" color="danger" variant="flat" onPress={async () => {
                      try {
                        for (const video of publishedVideos) {
                          if (video.id) {
                            await streamixApi.deletePublishedVideo(video.id);
                          }
                        }
                        setPublishedVideos([]);
                        addToast({ title: "Collection cleared", color: "warning" });
                      } catch (error) {
                        console.error("Failed to clear collection", error);
                        addToast({ title: "Failed to clear collection", color: "danger" });
                      }
                    }}>
                      Clear Collection
                    </Button>
                  )}
                </div>
              </div>

              {isLoadingVideos ? (
                <div className="h-48 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : publishedVideos.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-divider rounded-2xl text-default-400 bg-default-50/30">
                  <Icon icon="lucide:layout-template" width="40" className="mb-2 opacity-20" />
                  <p className="font-medium">No content published yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {publishedVideos.map((video) => (
                    <div key={video.id} className="relative group flex flex-col gap-2">
                      <HorizontalVideoCard video={video as any} />
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
                            onPress={() => video.id && handleRemove(video.id)}
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
        </Tab>
        <Tab
          key="genres"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layers" width={20} />
              <span>Genres</span>
            </div>
          }
        >
          <div className="flex flex-col gap-8 mt-4">
            <Card className={cn(
              "bg-secondary-background/50 backdrop-blur-md border-1",
              isEditingGenre ? "border-secondary shadow-lg shadow-secondary/10" : "border-divider"
            )}>
              <CardHeader className="flex flex-col items-start gap-1 pb-2">
                <p className="text-lg font-bold">{isEditingGenre ? "Edit Genre" : "Add New Genre"}</p>
                <p className="text-small text-default-500">Create a rectangle genre card with icon and description</p>
              </CardHeader>
              <Divider />
              <CardBody className="gap-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Genre Name"
                    placeholder="e.g. Action, Horror"
                    value={genreData.name}
                    onChange={(e) => setGenreData({ ...genreData, name: e.target.value })}
                  />
                  <Input
                    label="Icon URL"
                    placeholder="https://icon-url.com/img.png"
                    value={genreData.icon}
                    onChange={(e) => setGenreData({ ...genreData, icon: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Description"
                  placeholder="Tell something about this genre..."
                  value={genreData.description}
                  onChange={(e) => setGenreData({ ...genreData, description: e.target.value })}
                  minRows={2}
                />
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    className="flex-1 font-bold"
                    onPress={handleGenreSubmit}
                  >
                    {isEditingGenre ? "Update Genre" : "Create Genre"}
                  </Button>
                  {isEditingGenre && (
                    <Button variant="flat" onPress={() => {
                      setIsEditingGenre(false);
                      setGenreData({ name: "", icon: "", description: "" });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>

            <section className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Genre Categories</h2>
                <Button size="sm" variant="flat" onPress={loadGenres} startContent={<Icon icon="lucide:refresh-cw" />}>
                  Refresh
                </Button>
              </div>

              {isLoadingGenres ? (
                <div className="h-48 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : genres.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-divider rounded-2xl text-default-400">
                  No genres created yet
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {genres.map((genre) => (
                    <Card key={genre.id} className="bg-secondary-background/40 hover:bg-secondary-background/60 transition-colors border-1 border-divider/50">
                      <CardBody className="p-3.5 flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-[38px] h-[38px] rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border-1 border-primary/20 shadow-inner">
                            {genre.icon ? (
                              <Image src={genre.icon} alt={genre.name} className="w-full h-full object-cover" />
                            ) : (
                              <Icon icon="lucide:image" className="text-primary/40" width={18} />
                            )}
                          </div>
                          <div className="flex items-center justify-between flex-1 min-w-0">
                            <h3 className="font-bold text-base truncate uppercase tracking-tight">{genre.name}</h3>
                            <div className="flex gap-1">
                              <Button isIconOnly size="sm" variant="light" color="secondary" className="h-7 w-7 min-w-7" onPress={() => handleEditGenre(genre)}>
                                <Icon icon="lucide:edit-2" width={14} />
                              </Button>
                              <Button isIconOnly size="sm" variant="light" color="danger" className="h-7 w-7 min-w-7" onPress={() => handleDeleteGenre(genre.id)}>
                                <Icon icon="lucide:trash" width={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Tooltip
                          content={genre.description || "No description provided."}
                          placement="bottom"
                          showArrow
                          classNames={{
                            base: "before:bg-default-200",
                            content: "py-2 px-3 shadow-xl text-default-900 bg-default-100 max-w-[250px] text-xs font-medium",
                          }}
                          delay={500}
                        >
                          <p className="text-[0.95rem] text-default-500 line-clamp-2 leading-snug px-0.5 font-medium cursor-help">
                            {genre.description || "No description provided."}
                          </p>
                        </Tooltip>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </Tab>
        <Tab
          key="artists"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:user-circle" width={20} />
              <span>Artists</span>
            </div>
          }
        >
          <div className="flex flex-col gap-8 mt-4">
            <Card className={cn(
              "bg-secondary-background/50 backdrop-blur-md border-1",
              isEditingArtist ? "border-secondary shadow-lg shadow-secondary/10" : "border-divider"
            )}>
              <CardHeader className="flex flex-col items-start gap-1 pb-2">
                <p className="text-lg font-bold">{isEditingArtist ? "Edit Artist" : "Add New Artist"}</p>
                <p className="text-small text-default-500">Create artist profiles to display on video pages</p>
              </CardHeader>
              <Divider />
              <CardBody className="gap-5 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Artist Name"
                    placeholder="e.g. John Doe"
                    value={artistData.name}
                    onChange={(e) => setArtistData({ ...artistData, name: e.target.value })}
                  />
                  <Input
                    label="Avatar URL"
                    placeholder="https://avatar-url.com/img.png"
                    value={artistData.avatar}
                    onChange={(e) => setArtistData({ ...artistData, avatar: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Bio"
                  placeholder="Tell something about this artist..."
                  value={artistData.bio}
                  onChange={(e) => setArtistData({ ...artistData, bio: e.target.value })}
                  minRows={3}
                />
                <Textarea
                  label="Social Links (JSON)"
                  placeholder='{"twitter": "https://twitter.com/...", "instagram": "https://instagram.com/..."}'
                  value={artistData.socialLinks}
                  onChange={(e) => setArtistData({ ...artistData, socialLinks: e.target.value })}
                  minRows={2}
                />
                <div className="flex gap-2">
                  <Button
                    color="primary"
                    className="flex-1 font-bold"
                    onPress={handleArtistSubmit}
                  >
                    {isEditingArtist ? "Update Artist" : "Create Artist"}
                  </Button>
                  {isEditingArtist && (
                    <Button variant="flat" onPress={() => {
                      setIsEditingArtist(false);
                      setArtistData({ name: "", bio: "", avatar: "", socialLinks: "{}" });
                    }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>

            <section className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Artist Profiles</h2>
                <Button size="sm" variant="flat" onPress={loadArtists} startContent={<Icon icon="lucide:refresh-cw" />}>
                  Refresh
                </Button>
              </div>

              {isLoadingArtists ? (
                <div className="h-48 flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              ) : artists.length === 0 ? (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-divider rounded-2xl text-default-400">
                  No artists created yet
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {artists.map((artist) => (
                    <Card key={artist.id} className="bg-secondary-background/40 hover:bg-secondary-background/60 transition-colors border-1 border-divider/50">
                      <CardBody className="p-4 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden border-2 border-primary/20">
                            {artist.avatar ? (
                              <Image src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                            ) : (
                              <Icon icon="lucide:user" className="text-primary/40" width={24} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-bold text-base truncate">{artist.name}</h3>
                              <div className="flex gap-1">
                                <Button isIconOnly size="sm" variant="light" color="secondary" className="h-7 w-7 min-w-7" onPress={() => handleEditArtist(artist)}>
                                  <Icon icon="lucide:edit-2" width={14} />
                                </Button>
                                <Button isIconOnly size="sm" variant="light" color="danger" className="h-7 w-7 min-w-7" onPress={() => handleDeleteArtist(artist.id)}>
                                  <Icon icon="lucide:trash" width={14} />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-default-500 line-clamp-2 mt-1">
                              {artist.bio || "No bio provided."}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </Tab>
      </Tabs>
    </div>
  );

}
