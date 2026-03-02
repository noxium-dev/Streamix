import { streamixApi } from "@/api/streamix";
import { SiteConfigType } from "@/types";
import { BiSearchAlt2, BiSolidSearchAlt2 } from "react-icons/bi";
import { GoHomeFill, GoHome } from "react-icons/go";
import { HiComputerDesktop } from "react-icons/hi2";
import { IoIosSunny } from "react-icons/io";
import { IoInformationCircle, IoInformationCircleOutline, IoMoon, IoVideocam, IoVideocamOutline } from "react-icons/io5";
import { TbFolder, TbFolderFilled } from "react-icons/tb";

export const siteConfig: SiteConfigType = {
  name: "Streamix",
  description: "Stream your favorite videos",
  favicon: "/favicon.ico",
  navItems: [
    { label: "Home", href: "/", icon: <GoHome className="size-full" />, activeIcon: <GoHomeFill className="size-full" /> },
    { label: "Videos", href: "/discover", icon: <IoVideocamOutline className="size-full" />, activeIcon: <IoVideocam className="size-full" /> },
    { label: "Search", href: "/search", icon: <BiSearchAlt2 className="size-full" />, activeIcon: <BiSolidSearchAlt2 className="size-full" /> },
    { label: "Library", href: "/library", icon: <TbFolder className="size-full" />, activeIcon: <TbFolderFilled className="size-full" /> },
    { label: "About", href: "/about", icon: <IoInformationCircleOutline className="size-full" />, activeIcon: <IoInformationCircle className="size-full" /> },
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
