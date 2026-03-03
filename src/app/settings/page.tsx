"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Switch, Slider, Select, SelectItem, Divider, Button, addToast } from "@heroui/react";
import SectionTitle from "@/components/ui/other/SectionTitle";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { loadPfpList, getAvatarUrl, randomizePfp } from "@/utils/avatar";
import { Avatar } from "@heroui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const STORAGE_KEY = "streamix_settings";

const defaultSettings = {
    autoplay: true,
    defaultQuality: "1080p",
    defaultVolume: 80,
    subtitles: false,
    theater: false,
    continuousPlay: true,
    reducedMotion: false,
};

const loadSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
};

const SettingSection = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-foreground/80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon icon={icon} width={18} />
            </div>
            <h2 className="font-bold text-base">{title}</h2>
        </div>
        <div className="flex flex-col gap-4 pl-2">{children}</div>
    </div>
);

const SettingRow = ({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
            <span className="font-medium text-sm">{label}</span>
            {description && <span className="text-xs text-default-400 mt-0.5">{description}</span>}
        </div>
        {children}
    </div>
);

const QUALITY_OPTIONS = ["Auto", "2160p (4K)", "1080p", "720p", "480p", "360p"];

const SettingsPage = () => {
    const { data: user, isLoading } = useSupabaseUser();
    const [settings, setSettings] = useState(loadSettings);
    const [saving, setSaving] = useState(false);
    const [pfpList, setPfpList] = useState<string[]>([]);
    const [avatar, setAvatar] = useState("");
    const [rolling, setRolling] = useState(false);

    useEffect(() => {
        loadPfpList().then((list) => {
            setPfpList(list);
            setAvatar(getAvatarUrl(user?.username, list));
        });
    }, [user?.username]);

    const update = (key: keyof typeof defaultSettings, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveSettings = () => {
        setSaving(true);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            addToast({ title: "Settings saved!", color: "success" });
        } catch {
            addToast({ title: "Could not save settings", color: "danger" });
        } finally {
            setSaving(false);
        }
    };

    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem(STORAGE_KEY);
        addToast({ title: "Settings reset to defaults", color: "primary" });
    };

    const handleRollPfp = () => {
        if (!pfpList.length) return;
        setRolling(true);
        // Animate through a few random previews then settle
        let count = 0;
        const interval = setInterval(() => {
            const idx = Math.floor(Math.random() * pfpList.length);
            setAvatar(`/pfps/${encodeURIComponent(pfpList[idx])}`);
            count++;
            if (count >= 8) {
                clearInterval(interval);
                const newUrl = randomizePfp(pfpList);
                setAvatar(newUrl);
                setRolling(false);
                addToast({ title: "New profile picture set!", color: "success" });
            }
        }, 100);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-2 min-h-[70vh] max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-3">
                <SectionTitle>Settings</SectionTitle>
                <p className="text-default-500 font-medium leading-relaxed">
                    Customize your Streamix streaming experience.
                </p>
            </div>

            {user && (
                <>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-default-50/50 border border-divider">
                        {/* Avatar preview with roll button */}
                        <div className="relative group flex-shrink-0">
                            <Avatar
                                showFallback
                                src={avatar}
                                className="size-16 ring-2 ring-primary/30"
                                fallback={<Icon icon="lucide:user" className="text-2xl" />}
                            />
                            {rolling && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60">
                                    <Icon icon="lucide:loader-2" className="text-primary text-xl animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <p className="font-bold text-lg">{user.fullName || user.username}</p>
                            <p className="text-sm text-default-400">@{user.username}</p>
                            <p className="text-xs text-default-400">{user.email}</p>
                        </div>
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={handleRollPfp}
                            isLoading={rolling}
                            isDisabled={pfpList.length === 0}
                            startContent={!rolling && <Icon icon="lucide:shuffle" className="text-base" />}
                        >
                            {rolling ? "Rolling..." : "Random PFP"}
                        </Button>
                    </div>
                    <Divider />
                </>
            )}

            {/* Playback Settings */}
            <SettingSection icon="lucide:play-circle" title="Playback">
                <SettingRow label="Autoplay" description="Automatically play videos when opened">
                    <Switch isSelected={settings.autoplay} onValueChange={(v) => update("autoplay", v)} size="sm" />
                </SettingRow>
                <SettingRow label="Continuous Play" description="Auto-play next video when current ends">
                    <Switch isSelected={settings.continuousPlay} onValueChange={(v) => update("continuousPlay", v)} size="sm" />
                </SettingRow>
                <SettingRow label="Default Quality" description="Preferred streaming quality">
                    <Select
                        size="sm"
                        className="max-w-36"
                        selectedKeys={[settings.defaultQuality]}
                        onSelectionChange={(keys) => update("defaultQuality", Array.from(keys)[0])}
                        aria-label="Select quality"
                    >
                        {QUALITY_OPTIONS.map((q) => (
                            <SelectItem key={q}>{q}</SelectItem>
                        ))}
                    </Select>
                </SettingRow>
                <SettingRow label="Default Volume" description={`${settings.defaultVolume}%`}>
                    <Slider
                        size="sm"
                        step={5}
                        minValue={0}
                        maxValue={100}
                        value={settings.defaultVolume}
                        onChange={(v) => update("defaultVolume", v)}
                        className="max-w-40"
                        aria-label="Volume"
                    />
                </SettingRow>
            </SettingSection>

            <Divider />

            {/* Display Settings */}
            <SettingSection icon="lucide:monitor" title="Display">
                <SettingRow label="Theater Mode by Default" description="Open player in expanded theater mode">
                    <Switch isSelected={settings.theater} onValueChange={(v) => update("theater", v)} size="sm" />
                </SettingRow>
                <SettingRow label="Reduced Motion" description="Minimize animations across the site">
                    <Switch isSelected={settings.reducedMotion} onValueChange={(v) => update("reducedMotion", v)} size="sm" />
                </SettingRow>
            </SettingSection>

            <Divider />

            {/* Accessibility */}
            <SettingSection icon="lucide:subtitles" title="Accessibility">
                <SettingRow label="Subtitles by Default" description="Enable subtitles when they are available">
                    <Switch isSelected={settings.subtitles} onValueChange={(v) => update("subtitles", v)} size="sm" />
                </SettingRow>
            </SettingSection>

            <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="flat" size="sm" onPress={resetSettings}>
                    Reset to Defaults
                </Button>
                <Button color="primary" variant="shadow" onPress={saveSettings} isLoading={saving}
                    startContent={!saving && <Icon icon="lucide:save" />}>
                    Save Settings
                </Button>
            </div>
        </div>
    );
};

export default SettingsPage;
