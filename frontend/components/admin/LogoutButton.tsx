"use client";
import { LogoutIcon } from "@/assets/icons/LogoutIcon";
import { useModal } from "@/contexts/modal";
import ConfirmModal from "@/modals/confirm";
import { twMerge } from "tailwind-merge";

export default function LogoutButton({ className, iconClassName, textClassName }: {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}) {
    const { setModal } = useModal();

    const openConfirmModal = () => {
        const confirmFunction = async () => new Promise((res,rej) => res({}));
        const onConfirm = () => {
            window.localStorage.removeItem('token');
            window.location.href = '/admin/login';
        }

        setModal(
            <ConfirmModal 
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                header={'Logout'}
                subHeader={'Are you sure you want to logout?'}
                confirmText="Log out"
                confirmLoadingText="Logging out..."
            />
        )
    }

    return(
        <button 
            className={twMerge(
                "p-3 flex items-center gap-2 bg-light rounded-md text-sm transition-colors hover:bg-light-secondary",
                className,
            )}
            onClick={openConfirmModal}
        >
            <LogoutIcon className={twMerge(
                "w-4",
                iconClassName,
            )} />
            <span className={textClassName}>
                Sign out
            </span>
        </button>
    )

}