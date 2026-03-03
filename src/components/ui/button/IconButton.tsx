import { Tooltip, Button, ButtonProps, TooltipProps } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export interface IconButtonProps extends Omit<ButtonProps, "isIconOnly"> {
  icon: string | React.ReactNode;
  tooltip?: string;
  iconSize?: number;
  to?: string; // Replace href with to for React Router
  tooltipProps?: Omit<TooltipProps, "isDisabled" | "content" | "children">;
}

const IconButton: React.FC<IconButtonProps> = ({
  as,
  icon,
  tooltip,
  iconSize = 24,
  to,
  tooltipProps,
  ...props
}) => {
  return (
    <Tooltip isDisabled={!tooltip} content={tooltip} {...tooltipProps}>
      <Button as={as || (to ? Link : "button")} isIconOnly to={to} {...props}>
        {typeof icon === "string" ? <Icon icon={icon} fontSize={iconSize} /> : icon}
      </Button>
    </Tooltip>
  );
};

export default IconButton;
