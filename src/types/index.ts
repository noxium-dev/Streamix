export type ContentType = "movie" | "video";

export type Params<T> = {
  params: Promise<T>;
};

export type ActionResponse<T = null> = Promise<{
  success: boolean;
  message?: string;
  data?: T;
}>;

export type QueryList<T> = {
  name: string;
  query: () => Promise<any>;
  param: string;
};

export type SiteConfigType = {
  name: string;
  description: string;
  favicon: string;
  navItems: {
    label: string;
    href: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[];
  queryLists: {
    anime: QueryList<any>[];
    movies: QueryList<any>[];
  };
  themes: {
    name: "light" | "dark" | "system";
    icon: React.ReactNode;
  }[];
  socials: {
    github: string;
  };
};

export type PlayersProps = {
  title: string;
  source: `https://${string}`;
  recommended?: boolean;
  fast?: boolean;
  ads?: boolean;
  resumable?: boolean;
};

export type Settings = {
  theme: "light" | "dark" | "system";
  showSpecialSeason: boolean;
  disableAnimation: boolean;
  saveWatchHistory: boolean;
};
