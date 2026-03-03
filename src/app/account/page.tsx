"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Divider, Button, addToast, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import SectionTitle from "@/components/ui/other/SectionTitle";
import useSupabaseUser from "@/hooks/useSupabaseUser";
import { loadPfpList, getAvatarUrl, randomizePfp } from "@/utils/avatar";
import { Avatar } from "@heroui/react";
import { changePassword, changeUsername, deleteAccount } from "@/actions/auth";
import { queryClient } from "@/app/providers";
import { useNavigate } from "react-router-dom";
import PasswordInput from "@/components/ui/input/PasswordInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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

const AccountPage = () => {
    const navigate = useNavigate();
    const { data: user, isLoading } = useSupabaseUser();
    const [pfpList, setPfpList] = useState<string[]>([]);
    const [avatar, setAvatar] = useState("");
    const [rolling, setRolling] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    
    // Username change state
    const [newUsername, setNewUsername] = useState("");
    const [changingUsername, setChangingUsername] = useState(false);
    
    // Delete account state
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    useEffect(() => {
        loadPfpList().then((list) => {
            setPfpList(list);
            setAvatar(getAvatarUrl(user?.username, list));
        });
    }, [user?.username]);

    const handleRollPfp = () => {
        if (!pfpList.length) return;
        setRolling(true);
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

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            addToast({ title: "Passwords do not match", color: "danger" });
            return;
        }
        if (newPassword.length < 6) {
            addToast({ title: "Password must be at least 6 characters", color: "danger" });
            return;
        }
        
        setChangingPassword(true);
        const { success, message } = await changePassword({ currentPassword, newPassword });
        addToast({ title: message, color: success ? "success" : "danger" });
        
        if (success) {
            setShowPasswordModal(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        setChangingPassword(false);
    };

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) {
            addToast({ title: "Username cannot be empty", color: "danger" });
            return;
        }
        
        setChangingUsername(true);
        const { success, message } = await changeUsername({ username: newUsername });
        addToast({ title: message, color: success ? "success" : "danger" });
        
        if (success) {
            setShowUsernameModal(false);
            setNewUsername("");
            queryClient.invalidateQueries({ queryKey: ["supabase-user"] });
        }
        setChangingUsername(false);
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== "DELETE") {
            addToast({ title: "Please type DELETE to confirm", color: "danger" });
            return;
        }
        
        setDeletingAccount(true);
        const { success, message } = await deleteAccount();
        addToast({ title: message, color: success ? "success" : "danger" });
        
        if (success) {
            queryClient.invalidateQueries({ queryKey: ["supabase-user"] });
            navigate("/");
        }
        setDeletingAccount(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Icon icon="lucide:user-x" className="text-6xl text-default-300" />
                <p className="text-default-500">Please log in to access your account settings</p>
                <Button color="primary" variant="shadow" onPress={() => navigate("/auth")}>
                    Log In
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 py-2 min-h-[70vh] max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-3">
                <SectionTitle>Account</SectionTitle>
                <p className="text-default-500 font-medium leading-relaxed">
                    Manage your account settings and preferences.
                </p>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-default-50/50 border border-divider">
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

            {/* Account Management Section */}
            <SettingSection icon="lucide:user-cog" title="Account Settings">
                <SettingRow label="Username" description="Change your username">
                    <Button
                        size="sm"
                        variant="flat"
                        onPress={() => setShowUsernameModal(true)}
                        startContent={<Icon icon="lucide:edit" className="text-base" />}
                    >
                        Change
                    </Button>
                </SettingRow>
                <SettingRow label="Password" description="Update your password">
                    <Button
                        size="sm"
                        variant="flat"
                        onPress={() => setShowPasswordModal(true)}
                        startContent={<Icon icon="lucide:key" className="text-base" />}
                    >
                        Change
                    </Button>
                </SettingRow>
            </SettingSection>

            <Divider />

            {/* Danger Zone */}
            <SettingSection icon="lucide:alert-triangle" title="Danger Zone">
                <SettingRow label="Delete Account" description="Permanently delete your account and data">
                    <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() => setShowDeleteModal(true)}
                        startContent={<Icon icon="lucide:trash-2" className="text-base" />}
                    >
                        Delete
                    </Button>
                </SettingRow>
            </SettingSection>

            {/* Change Password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} placement="center">
                <ModalContent>
                    <ModalHeader>Change Password</ModalHeader>
                    <ModalBody>
                        <PasswordInput
                            label="Current Password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            isDisabled={changingPassword}
                        />
                        <PasswordInput
                            label="New Password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            isDisabled={changingPassword}
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isDisabled={changingPassword}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setShowPasswordModal(false)} isDisabled={changingPassword}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleChangePassword} isLoading={changingPassword}>
                            Change Password
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Change Username Modal */}
            <Modal isOpen={showUsernameModal} onClose={() => setShowUsernameModal(false)} placement="center">
                <ModalContent>
                    <ModalHeader>Change Username</ModalHeader>
                    <ModalBody>
                        <Input
                            label="New Username"
                            placeholder="Enter new username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            isDisabled={changingUsername}
                            startContent={<Icon icon="lucide:at-sign" />}
                        />
                        <p className="text-xs text-default-400">
                            Current username: @{user?.username}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setShowUsernameModal(false)} isDisabled={changingUsername}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleChangeUsername} isLoading={changingUsername}>
                            Change Username
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Account Modal */}
            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} placement="center">
                <ModalContent>
                    <ModalHeader className="text-danger">Delete Account</ModalHeader>
                    <ModalBody>
                        <p className="text-sm text-foreground">
                            This action is permanent and cannot be undone. All your data will be deleted.
                        </p>
                        <Input
                            label="Type DELETE to confirm"
                            placeholder="DELETE"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            isDisabled={deletingAccount}
                            color="danger"
                            variant="bordered"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setShowDeleteModal(false)} isDisabled={deletingAccount}>
                            Cancel
                        </Button>
                        <Button color="danger" onPress={handleDeleteAccount} isLoading={deletingAccount}>
                            Delete Account
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default AccountPage;
