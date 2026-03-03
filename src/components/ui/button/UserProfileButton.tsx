import { signOut } from "@/actions/auth";
import useBreakpoints from "@/hooks/useBreakpoints";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { Logout } from "@/utils/icons";
import { loadPfpList, getAvatarUrl } from "@/utils/avatar";
import { useNavigate, Link } from "react-router-dom";
import {
  addToast,
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Switch,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { queryClient } from "@/app/providers";
import { useTheme } from "next-themes";

const UserProfileButton: React.FC = () => {
  const navigate = useNavigate();
  const [logout, setLogout] = useState(false);
  const [avatar, setAvatar] = useState("");
  const { data: user, isLoading } = useSupabaseUser();
  const { mobile } = useBreakpoints();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Load PFP list once and resolve avatar URL
  useEffect(() => {
    if (!user?.username) return;
    loadPfpList().then((list) => {
      setAvatar(getAvatarUrl(user.username, list));
    });
  }, [user?.username]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    if (logout) return;
    setLogout(true);
    const { success, message } = await signOut();
    addToast({ title: message, color: success ? "primary" : "danger" });
    if (success) {
      queryClient.invalidateQueries({ queryKey: ["supabase-user"] });
      navigate("/");
    }
    setLogout(false);
  };

  if (isLoading) return null;

  // Guest: show a Login button
  if (!user) {
    return (
      <Button
        as={Link}
        to="/auth"
        color="primary"
        variant="shadow"
        size="sm"
        className="font-semibold px-5"
        startContent={!mobile ? <Icon icon="lucide:log-in" className="text-base" /> : undefined}
      >
        {mobile ? <Icon icon="lucide:log-in" className="text-base" /> : "Login"}
      </Button>
    );
  }

  // Logged-in: show avatar dropdown
  return (
    <Dropdown showArrow placement="bottom-end">
      <DropdownTrigger>
        <Button variant="light" isIconOnly className="rounded-full size-11" title={user.username}>
          <Avatar
            showFallback
            src={avatar}
            className="size-10 cursor-pointer ring-2 ring-primary/30 hover:ring-primary/60 transition-all"
            fallback={<Icon icon="lucide:user" className="text-xl" />}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="User profile dropdown"
        variant="flat"
        disabledKeys={logout ? ["Logout"] : []}
      >
        <DropdownItem
          key="profile-info"
          isReadOnly
          showDivider
          className="cursor-default opacity-100 h-auto py-2"
          textValue="user-profile"
        >
          <div className="flex items-center gap-3">
            <Avatar
              showFallback
              src={avatar}
              className="size-10 ring-2 ring-primary/30"
              fallback={<Icon icon="lucide:user" className="text-xl" />}
            />
            <div className="flex flex-col">
              <p className="text-sm font-bold text-foreground">{user.fullName || user.username}</p>
              <p className="text-xs text-default-400">@{user.username}</p>
            </div>
          </div>
        </DropdownItem>
        <DropdownItem
          key="theme-switch"
          isReadOnly
          showDivider
          className="cursor-default opacity-100"
          textValue="theme-switch"
        >
          <div className="flex items-center justify-between gap-3 py-1">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:palette" className="text-lg" />
              <span className="text-sm">Theme</span>
            </div>
            {mounted && (
              <Switch
                isSelected={theme === "dark"}
                onValueChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                size="sm"
                color="primary"
                aria-label="Toggle theme"
                startContent={<Icon icon="lucide:sun" className="text-xs" />}
                endContent={<Icon icon="lucide:moon" className="text-xs" />}
              />
            )}
          </div>
        </DropdownItem>
        <DropdownItem
          key="Account"
          startContent={<Icon icon="lucide:user-cog" className="text-lg" />}
          href="/account"
        >
          Account
        </DropdownItem>
        <DropdownItem
          key="Settings"
          startContent={<Icon icon="lucide:settings" className="text-lg" />}
          href="/settings"
        >
          Settings
        </DropdownItem>
        <DropdownItem
          key="Logout"
          startContent={logout ? <LoadingSpinner size="sm" /> : <Logout />}
          color="danger"
          className="text-danger"
          onPress={handleLogout}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfileButton;
