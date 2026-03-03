import { streamixApi } from "@/api/streamix";
import { SiteConfigType } from "@/types";
import { BiSearchAlt2, BiSolidSearchAlt2, BiCategoryAlt, BiSolidCategoryAlt, BiHeart, BiSolidHeart } from "react-icons/bi";
import { GoHomeFill, GoHome } from "react-icons/go";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosSunny } from "react-icons/io";
import { IoInformationCircle, IoInformationCircleOutline, IoMoon, IoVideocam, IoVideocamOutline } from "react-icons/io5";

export const siteConfig: SiteConfigType = {
  name: "Streamix",
  description: "Stream your favorite videos",
  favicon: "/favicon.ico",
  navItems: [
    { label: "Home", href: "/", icon: <GoHome className="size-full" />, activeIcon: <GoHomeFill className="size-full" /> },
    { label: "Videos", href: "/videos", icon: <IoVideocamOutline className="size-full" />, activeIcon: <IoVideocam className="size-full" /> },
    { label: "Search", href: "/search", icon: <BiSearchAlt2 className="size-full" />, activeIcon: <BiSolidSearchAlt2 className="size-full" /> },
    { label: "Genres", href: "/genres", icon: <BiCategoryAlt className="size-full" />, activeIcon: <BiSolidCategoryAlt className="size-full" /> },
    { label: "Favourites", href: "/favorites", icon: <BiHeart className="size-full" />, activeIcon: <BiSolidHeart className="size-full" /> },
  ],
  themes: [
    { name: "light", icon: <IoIosSunny className="size-full" /> },
    { name: "dark", icon: <IoMoon className="size-full" /> },
    { name: "system", icon: <HiComputerDesktop className="size-full" /> },
  ],
  queryLists: {
    anime: [],
    movies: [
      { name: "All Videos", query: () => streamixApi.getVideos(1, 20), param: "allVideos" },
    ],
  },
  socials: { github: "https://github.com" },
};

export type SiteConfig = typeof siteConfig;
