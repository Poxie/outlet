"use client";
import { useEffect, useState } from 'react';
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Button from '@/components/button';
import Feedback from '@/components/feedback';
import { useAuth } from '@/contexts/auth';
import { Banner } from '../../../../types';
import { useAppDispatch, useAppSelector } from '@/store';
import { addBanner, selectBannerById, selectBannersLoading, updateBanner } from '@/store/slices/banners';
import { useRouter } from 'next/navigation';

export default function CreateBanner({ params: { bannerId } }: {
    params: { bannerId: string | undefined };
}) {
    const router = useRouter();
    const { post, patch } = useAuth();

    const dispatch = useAppDispatch();
    const bannersLoading = useAppSelector(selectBannersLoading);
    const prevBanner = useAppSelector(state => selectBannerById(state, bannerId || ''));

    const [bannerText, setBannerText] = useState(prevBanner?.text || '');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);

    useEffect(() => {
        if(!prevBanner) return;
        setBannerText(prevBanner.text);
    }, [prevBanner]);

    const isCreatingBanner = !prevBanner;

    const createBanner = async () => {
        if(!isCreatingBanner && prevBanner.text === bannerText) {
            setFeedback({
                text: 'No changes have been made.',
                type: 'danger',
            })
            return;
        }
        if(!bannerText) {
            setFeedback({
                text: 'Banner text is required.',
                type: 'danger',
            });
            return;
        }

        setLoading(true);
        if(isCreatingBanner) {
            const banner = await post<Banner>(`/banners`, { text: bannerText });
            dispatch(addBanner(banner));
            router.replace('/admin/banners');
        } else {
            const banner = await patch<Banner>(`/banners/${bannerId}`, { text: bannerText });
            dispatch(updateBanner({ bannerId, text: bannerText }));
            setLoading(false);
            setFeedback({
                text: 'Banner has been updated.',
                type: 'success',
            })
        }
    }
    const onChange = (text: string) => {
        setFeedback(null);
        setBannerText(text);
    }

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    text={isCreatingBanner ? 'Create banner' : 'Edit banner: ' + prevBanner.text}
                    backPath={'/admin/banners'}
                />
                {!bannersLoading ? (
                    <>
                    <div className="p-4 grid">
                        <span className="block text-sm text-secondary mb-1">
                            Banner text
                        </span>
                        <Input 
                            placeholder={'Banner text'}
                            onChange={onChange}
                            value={bannerText}
                            minHeight={70}
                            textArea
                        />
                    </div>
                    {feedback && (
                        <Feedback 
                            {...feedback}
                            className="mb-4"
                        />
                    )}
                    <div className="p-4 flex justify-end bg-light-secondary">
                        <Button onClick={createBanner}>
                            {isCreatingBanner ? 'Create banner' : 'Update banner'}
                        </Button>
                    </div>
                    </>
                ) : (
                    <span className="py-12 block text-center">
                        Loading banner...
                    </span>
                )}
            </div>
        </main>
    )
}