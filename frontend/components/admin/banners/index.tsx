"use client";
import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeBanner, selectBanners, selectBannersLoading } from "@/store/slices/banners";
import { EditIcon } from "@/assets/icons/EditIcon";
import Link from "next/link";
import { BinIcon } from "@/assets/icons/BinIcon";
import { useAuth } from "@/contexts/auth";
import ConfirmModal from "@/modals/confirm";
import { useModal } from "@/contexts/modal";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import { BannersIcon } from "@/assets/icons/BannersIcon";

export default function Banners() {
    const { _delete } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();
    
    const loading = useAppSelector(selectBannersLoading);
    const banners = useAppSelector(selectBanners);

    const deleteBanner = async (bannerId: string) => {
        const confirmFunction = async () => _delete(`/banners/${bannerId}`);
        const onConfirm = () => dispatch(removeBanner(bannerId));

        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={'Are you sure you want to remove this banner?'}
                subHeader={'Removing this banner will remove it permanently. This cannot be undone.'}
                confirmLoadingText={'Removing banner...'}
                confirmText={'Remove banner'}
                closeOnCancel
            />
        )
    }

    const activeBanner = banners.find(banner => banner.active);
    const inactiveBanners = banners.filter(banner => !banner.active);

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    text="Banners"
                    backPath={'/admin'}
                    options={
                        <Button 
                            className="py-2.5 px-3 mr-1.5"
                            href={'/admin/banners/create'}
                        >
                            Create banner
                        </Button>
                    }
                />
                {!loading ? (
                    <div>
                        <div className="p-4 flex items-start gap-2 border-b-[1px] border-b-light-secondary text-c-primary">
                            <MegaphoneIcon className="w-5 mt-[.06rem]" />
                            <span>
                                Active banner
                            </span>
                        </div>
                        {activeBanner ? (
                            <BannerRow 
                                {...activeBanner}
                                deleteBanner={deleteBanner}
                            />
                        ) : (
                            <span className="block text-sm p-4">
                                No banners are currently active.
                            </span>
                        )}
                        <div className="p-4 flex items-start gap-2 border-y-[1px] border-t-light-tertiary border-b-light-secondary text-secondary">
                            <BannersIcon className="w-5" />
                            <span>
                                All banners
                            </span>
                        </div>
                        {banners.map(banner => (
                            <BannerRow 
                                {...banner}
                                deleteBanner={deleteBanner}
                                key={banner.id}
                            />
                        ))}
                    </div>
                ) : (
                    <span className="py-24 block text-center">
                        Loading banners...
                    </span>
                )}
            </div>
        </main>
    )
}

const BannerRow: React.FC<{
    id: string;
    text: string;
    deleteBanner: (bannerId: string) => void;
}> = ({ id, text, deleteBanner }) => {
    return(
        <div className="p-4 flex justify-between items-center">
            <span>
                {text}
            </span>
            <div className="flex">
                <Link 
                    href={`/admin/banners/${id}`}
                    className="p-2 block rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                >
                    <EditIcon className="w-4" />
                </Link>
                <button 
                    className="p-2 text-c-primary rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                    onClick={() => deleteBanner(id)}
                >
                    <BinIcon className="w-4" />
                </button>
            </div>
        </div>
    )
}