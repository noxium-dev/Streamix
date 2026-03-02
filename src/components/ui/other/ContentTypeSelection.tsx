"use client";

import { Tabs, Tab, TabsProps } from "@heroui/react";
import { Play } from "@/utils/icons";

interface ContentTypeSelectionProps extends TabsProps {}

const ContentTypeSelection: React.FC<ContentTypeSelectionProps> = (props) => {
  return (
    <Tabs
      size="lg"
      variant="underlined"
      aria-label="Content Type Selection"
      color="primary"
      classNames={{
        tabContent: "pb-2",
        cursor: "h-1 rounded-full",
      }}
      {...props}
    >
      <Tab
        key="video"
        title={
          <div className="flex items-center space-x-2">
            <Play />
            <span>Videos</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default ContentTypeSelection;
