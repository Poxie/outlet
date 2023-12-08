"use client";
import { useState } from 'react';
import AdminHeader from "../../AdminHeader";
import AdminTabs from "../../AdminTabs";
import Input from '@/components/input';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import Feedback from '@/components/feedback';
import { useRouter } from 'next/navigation';
import { addCategory } from '@/store/slices/categories';
import { useAppDispatch } from '@/store';

export default function CreateEventCategory() {
    const router = useRouter();
    const { post } = useAuth();

    const [categoryInfo, setCategoryInfo] = useState({
        name: '',
    });
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useAppDispatch();

    const updateProperty = (prop: keyof typeof categoryInfo, value: string) => {
        setFeedback(null);
        setCategoryInfo(prev => ({
            ...prev,
            [prop]: value,
        }));
    }

    const onSubmit = async () => {
        if(!categoryInfo.name) {
            setFeedback({
                text: 'Name is required.',
                type: 'danger',
            })
            return;
        }

        setLoading(true);

        const category = await post(`/categories`, categoryInfo);
        dispatch(addCategory(category));
        
        router.replace('/admin/events/categories');
    }

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/events/categories'}
                    text={'Events / Categories / Create'}
                />
                <div className="p-4">
                    <span className="block text-sm mb-1">
                        Category name
                    </span>
                    <Input 
                        value={categoryInfo.name}
                        onChange={name => updateProperty('name', name)}
                        placeholder={'Category name...'}
                        className="w-full"
                    />
                </div>
                {feedback && (
                    <Feedback 
                        className="mb-4"
                        {...feedback}
                    />
                )}
                <div className="p-4 flex justify-end gap-2 bg-light-secondary">
                    <Button
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        {!loading ? 'Create category' : 'Creating category...'}
                    </Button>
                </div>
            </div>
        </main>
    )
}