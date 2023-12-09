"use client";
import { useEffect, useState } from 'react';
import AdminHeader from "../../AdminHeader";
import AdminTabs from "../../AdminTabs";
import Input from '@/components/input';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import Feedback from '@/components/feedback';
import { useRouter } from 'next/navigation';
import { addCategory, selectCategoryById, updateCategory } from '@/store/slices/categories';
import { useAppDispatch, useAppSelector } from '@/store';

const getDummyCategory = () => ({
    name: '',
    description: '',
})
export default function CreateEventCategory({ params: { categoryId } }: {
    params: { categoryId: string };
}) {
    const router = useRouter();
    const { post, patch } = useAuth();

    const dispatch = useAppDispatch();
    const prevCategory = useAppSelector(state => selectCategoryById(state, categoryId));

    const [categoryInfo, setCategoryInfo] = useState(prevCategory || getDummyCategory());
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!prevCategory) return;
        setCategoryInfo(prevCategory);
    }, [prevCategory]);

    const updateProperty = (prop: keyof typeof categoryInfo, value: string) => {
        setFeedback(null);
        setCategoryInfo(prev => ({
            ...prev,
            [prop]: value,
        }));
    }

    const getChanges = () => {
        if(!prevCategory) return categoryInfo;

        const changes: {[key: string]: any} = {};
        for(const [prop, val] of Object.entries(categoryInfo)) {
            if(prevCategory[prop as keyof typeof prevCategory] !== val) {
                changes[prop] = val;
            }
        }
        return changes;
    }
    const hasChanges = () => Object.keys(getChanges()).length > 0;
    const onSubmit = async () => {
        if(!categoryInfo.name) {
            setFeedback({
                text: 'Name is required.',
                type: 'danger',
            })
            return;
        }

        if(!prevCategory) {
            setLoading(true);
            
            const category = await post(`/categories`, categoryInfo);
            dispatch(addCategory(category));
            
            router.replace('/admin/events/categories');
            return;
        }

        if(!hasChanges()) {
            setFeedback({
                text: 'No changes have been made.',
                type: 'danger',
            })
            return;
        }

        setLoading(true);

        const changes = getChanges();
        await patch(`/categories/${prevCategory.id}`, changes);

        dispatch(updateCategory({ categoryId, changes }));
        setLoading(false);
        setFeedback({
            text: 'Category has been updated.',
            type: 'success',
        })
    }

    const isCreatingCategory = !prevCategory;
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/events/categories'}
                    text={`Events / Categories / ${isCreatingCategory ? 'Create' : prevCategory.name}`}
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
                    <span className="block text-sm mb-1 mt-2">
                        Category description
                    </span>
                    <Input 
                        value={categoryInfo.description || ''}
                        onChange={description => updateProperty('description', description)}
                        placeholder={'Category description...'}
                        className="w-full"
                        textArea
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
                        {isCreatingCategory ? (
                            !loading ? 'Create category' : 'Creating category...'
                        ) : (
                            !loading ? 'Update category' : 'Updating category...'
                        )}
                    </Button>
                </div>
            </div>
        </main>
    )
}