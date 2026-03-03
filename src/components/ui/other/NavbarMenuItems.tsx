import { siteConfig } from "@/config/site";
import { Tab, Tabs, TabsProps } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";

interface NavbarMenuItemsProps extends TabsProps {
  withIcon?: boolean;
  menuArray?: {
    href: string;
    label: string;
    icon?: React.ReactNode;
    activeIcon?: React.ReactNode;
  }[];
}

const NavbarMenuItems: React.FC<NavbarMenuItemsProps> = ({
  menuArray = siteConfig.navItems,
  isVertical,
  withIcon,
  variant = "underlined",
  size = "lg",
}) => {
  const { pathname: pathName } = useLocation();

  return (
    <Tabs
      size={size}
      variant={variant}
      selectedKey={pathName}
      isVertical={isVertical}
      classNames={{
        tabList: isVertical && "gap-5",
        tab: "h-full w-full",
      }}
    >
      {menuArray.map((item) => {
        const isActive = pathName === item.href;
        let title: React.ReactNode = item.label;

        if (withIcon) {
          title = (
            <div className="flex max-h-[45px] flex-col items-center gap-1">
              {isActive ? item.activeIcon : item.icon}
              <p>{item.label}</p>
            </div>
          );
        }

        return (
          <Tab 
            key={item.href} 
            className="text-start" 
            title={
              <Link to={item.href} className="w-full h-full flex items-center">
                {title}
              </Link>
            } 
          />
        );
      })}
    </Tabs>
  );
};

export default NavbarMenuItems;
