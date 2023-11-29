"use client";
import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useAppSelector } from "@/store";
import { selectBanners, selectBannersLoading } from "@/store/slices/banners";

export default function Banners() {
    const loading = useAppSelector(selectBannersLoading);
    const banners = useAppSelector(selectBanners);

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
                    <div className="grid">
                        {banners.map(banner => (
                            <div 
                                className="p-4"
                                key={banner.id}
                            >
                                {banner.text}
                            </div>
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