export const PFP_INDEX_KEY = "streamix_pfp_index";

// Simple deterministic hash from a string → number
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    return Math.abs(hash);
};

// Cache the loaded list so we only fetch once
let cachedPfpList: string[] | null = null;

export const loadPfpList = async (): Promise<string[]> => {
    if (cachedPfpList) return cachedPfpList;
    try {
        const res = await fetch("/pfp-list.json");
        cachedPfpList = await res.json() as string[];
        return cachedPfpList;
    } catch {
        return [];
    }
};

export const getAvatarUrl = (username: string | undefined, pfpList: string[]): string => {
    if (!pfpList || pfpList.length === 0) return "";
    // Check for a user-set custom index first
    try {
        const stored = localStorage.getItem(PFP_INDEX_KEY);
        if (stored !== null) {
            const idx = parseInt(stored, 10);
            if (!isNaN(idx) && idx >= 0 && idx < pfpList.length) {
                return `/pfps/${encodeURIComponent(pfpList[idx])}`;
            }
        }
    } catch { /* localStorage unavailable */ }
    // Fallback to deterministic hash
    const seed = username ? username.trim().toLowerCase() : "guest";
    const index = hashString(seed) % pfpList.length;
    return `/pfps/${encodeURIComponent(pfpList[index])}`;
};

/** Pick a completely random PFP index and save it to localStorage. Returns the new URL. */
export const randomizePfp = (pfpList: string[]): string => {
    if (!pfpList.length) return "";
    const idx = Math.floor(Math.random() * pfpList.length);
    try { localStorage.setItem(PFP_INDEX_KEY, String(idx)); } catch { /* ignore */ }
    return `/pfps/${encodeURIComponent(pfpList[idx])}`;
};

// Kept for backwards compatibility
export const getGithubAvatar = (_username: string | undefined): string => "";
