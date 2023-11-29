"use client";
import { useState } from 'react';
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Button from '@/components/button';
import Feedback from '@/components/feedback';
import { useAuth } from '@/contexts/auth';
import { Banner } from '../../../../types';
import { useAppDispatch } from '@/store';
import { addBanner } from '@/store/slices/banners';

export default function CreateBanner() {
    const { post } = useAuth();

    const [bannerText, setBannerText] = useState('');
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);

    const dispatch = useAppDispatch();

    const createBanner = async () => {
        if(!bannerText) {
            setFeedback({
                text: 'Banner text is required.',
                type: 'danger',
            });
            return;
        }

        const banner = await post<Banner>(`/banners`, { text: bannerText });
        dispatch(addBanner(banner));
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
                    text={'Create banner'}
                    backPath={'/admin/banners'}
                />
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
                        Create banner
                    </Button>
                </div>
            </div>
        </main>
    )
}