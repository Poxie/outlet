"use client";
import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeBanner, selectBanners, selectBannersLoading, updateBanner } from "@/store/slices/banners";
import { EditIcon } from "@/assets/icons/EditIcon";
import Link from "next/link";
import { BinIcon } from "@/assets/icons/BinIcon";
import { useAuth } from "@/contexts/auth";
import ConfirmModal from "@/modals/confirm";
import { useModal } from "@/contexts/modal";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import { BannersIcon } from "@/assets/icons/BannersIcon";
import { Banner } from "../../../../types";

export default function Banners() {
    const { _delete, patch } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();
    
    const loading = useAppSelector(selectBannersLoading);
    const banners = useAppSelector(selectBanners);

    const toggleActivated = async (bannerId: string) => {
        const isActivated = banners.find(banner => banner.id === bannerId)?.active;

        const confirmFunction = async () => patch(`/banners/${bannerId}`, { active: !isActivated });
        const onConfirm = () => dispatch(updateBanner({ bannerId, changes: { active: !isActivated } }));

        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={`Are you sure you want to ${isActivated ? 'deactivate' : 'activate'} this banner?`}
                subHeader={isActivated ? (
                    'Deactivating this banner will hide it from the site, but will keep it here in the banners panel. Don\'t worry, this can be undone.'
                ) : (
                    'Activating this banner will deactivate any currently active banner and show this banner instead. Don\'t worry, any currently active banner will be saved.'
                )}
                confirmLoadingText={isActivated ? 'Deactivating banner...' : 'Activating banner...'}
                confirmText={isActivated ? 'Deactivate banner' : 'Activate banner'}
                closeOnCancel
            />
        )
    }
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
                                toggleActivated={toggleActivated}
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
                        {inactiveBanners.length > 0 ? (
                            inactiveBanners.map(banner => (
                                <BannerRow 
                                    {...banner}
                                    deleteBanner={deleteBanner}
                                    toggleActivated={toggleActivated}
                                    key={banner.id}
                                />
                            ))
                        ) : (
                            <span className="block text-sm p-4">
                                No banners to show.
                            </span>
                        )}
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

const BannerRow: React.FC<Banner & {
    deleteBanner: (bannerId: string) => void;
    toggleActivated: (bannerId: string) => void;
}> = ({ id, text, active, deleteBanner, toggleActivated }) => {
    return(
        <div className="p-4 flex justify-between items-center">
            <span>
                {text}
            </span>
            <div className="flex">
                {active ? (
                    <Button 
                        className="py-2 px-2.5"
                        onClick={() => toggleActivated(id)}
                    >
                        Deactivate banner
                    </Button>
                ) : (
                    <button
                        className="py-2 px-2.5 rounded border-[1px] border-c-primary text-c-primary hover:bg-primary/10 active:bg-primary/20 text-xs font-semibold transition-colors"
                        onClick={() => toggleActivated(id)}
                    >
                        Activate banner
                    </button>
                )}
                <Link 
                    href={`/admin/banners/${id}`}
                    className="ml-1 p-2 block rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
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