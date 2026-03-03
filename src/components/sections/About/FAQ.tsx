"use client";

import useBreakpoints from "@/hooks/useBreakpoints";
import { Accordion, AccordionItem, Link } from "@heroui/react";
import { Icon } from "@iconify/react";

const FAQS = [
  {
    title: "What is Streamix and how does it work?",
    icon: "solar:info-circle-bold-duotone",
    description:
      "Streamix is a modern streaming platform designed to provide easy access to a vast library of videos. We don't host any files locally; instead, we provide a seamless interface to stream content directly from various high-quality third-party storage providers.",
  },
  {
    title: "Where are the videos hosted?",
    icon: "solar:globus-bold-duotone",
    description:
      "All videos are hosted on specialized third-party streaming services such as Upnshare, MegaUp.cc, and other reliable content delivery networks. This ensures fast buffering and multiple server options for the best viewing experience.",
  },
  {
    title: "What are the key features of Streamix?",
    icon: "solar:star-bold-duotone",
    description: (
      <ul className="list-disc ml-5 space-y-2">
        <li><span className="font-bold">Favourites System:</span> Save your favorite videos to your personal list for quick access anytime.</li>
        <li><span className="font-bold">High Resolution:</span> Support for 1080p, 4K, and ultra-high-definition streaming where available.</li>
        <li><span className="font-bold">Smart Search:</span> Quickly find any video or category with our advanced indexing system.</li>
        <li><span className="font-bold">Genre Categories:</span> Browse through organized collections to discover new content effortlessly.</li>
        <li><span className="font-bold">Responsive Design:</span> A beautiful, consistent experience across all devices from mobile to desktop.</li>
      </ul>
    ),
  },
  {
    title: "Are there any costs or subscriptions?",
    icon: "solar:dollar-minimalistic-bold-duotone",
    description:
      "Streamix is built to be accessible. While our platform is free to use for browsing and organizing your watch history, the third-party hosting services we link to may have their own policies regarding access and downloads.",
  },
  {
    title: "How do I add videos to my Favourites?",
    icon: "solar:heart-bold-duotone",
    description:
      "Simply navigate to any video page and click the 'Favourite' heart button. Your choice is instantly saved to your browser's local storage, meaning your list stays with you on that device without needing an account.",
  },
  {
    title: "What should I do if a link is broken?",
    icon: "solar:shield-warning-bold-duotone",
    description:
      "Since we rely on external hosting, links can occasionally go down. We recommend checking the different server options provided in the player or returning later as our system frequently updates to fetch working mirrors.",
  },
];

const FAQ = () => {
  const { mobile } = useBreakpoints();

  return (
    <Accordion 
      variant="splitted" 
      isCompact={mobile}
      className="px-0"
      itemClasses={{
        base: "bg-default-50/50 backdrop-blur-sm border-1 border-divider mb-3 rounded-2xl!",
        title: "font-bold text-lg",
        trigger: "py-4",
        content: "pb-6 pt-0 text-default-500 leading-relaxed font-medium"
      }}
    >
      {FAQS.map(({ title, icon, description }) => (
        <AccordionItem 
          key={title} 
          aria-label={title} 
          title={title}
          startContent={
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon icon={icon} width={24} />
            </div>
          }
        >
          {description}
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQ;
