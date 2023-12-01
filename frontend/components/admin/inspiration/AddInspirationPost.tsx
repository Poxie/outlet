"use client";
import { useState, useRef } from 'react';
import { BlogPost } from "../../../../types";
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { ClockIcon } from '@/assets/icons/ClockIcon';
import { usePopout } from '@/contexts/popout';
import { TimeSelector } from '@/components/time-selector';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import Feedback from '@/components/feedback';

const getDummyPost: () => BlogPost = () => ({
    id: Math.random().toString(),
    title: '',
    description: '',
    timestamp: Date.now().toString(),
    archived: false,
    images: [],
})
export default function AddInspirationPost() {
    const { post } = useAuth();
    const { close: closePopout, setPopout } = usePopout();

    const [loading, setLoading] = useState(false);
    const [postInfo, setPostInfo] = useState(getDummyPost());
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'danger' | 'success';
    }>(null);

    const openPopoutButton = useRef<HTMLButtonElement>(null);

    const onSubmit = async () => {
        const propsToCheck = ['title', 'description', 'timestamp'] as const;
        const invalidProps = propsToCheck.filter(prop => !postInfo[prop]);
        if(invalidProps.length) {
            const formatter = new Intl.ListFormat('default', { style: 'long', type: 'conjunction' });
            const formattedString = formatter.format(invalidProps)
            const firstLetterUppercase = formattedString.slice(0,1).toUpperCase() + formattedString.slice(1);
            return setFeedback({
                text: `${firstLetterUppercase} ${invalidProps.length > 1 ? 'are' : 'is'} required.`,
                type: 'danger',
            });
        }

        await post('/inspiration', postInfo);
    }

    const updateProperty = (property: keyof BlogPost, value: BlogPost[keyof BlogPost]) => setPostInfo(prev => ({
        ...prev,
        [property]: value,
    }))

    const openTimeSelector = () => {
        const onChange = (date: Date | null) => {
            closePopout();
            if(!date) return updateProperty('timestamp', new Date().getTime().toString());
            updateProperty('timestamp', date.getTime().toString());
        }
        setPopout({
            popout: <TimeSelector onChange={onChange} />,
            ref: openPopoutButton,
            options: { position: 'right' }
        })
    }

    const date = new Date(Number(postInfo.timestamp));
    return(
        <main className="py-8 w-main w-max-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/inspiration'}
                    text={'Inspiration: Create post'}
                />
                <div className="p-4">
                    <span className="block text-sm mb-1">
                        Title
                    </span>
                    <Input 
                        value={postInfo.title}
                        onChange={title => updateProperty('title', title)}
                        placeholder={'Title...'}
                        className="w-full"
                    />
                    <span className="block text-sm mt-2">
                        Description
                    </span>
                    <Input 
                        value={postInfo.description}
                        onChange={description => updateProperty('description', description)}
                        placeholder={'Description...'}
                        className="w-full block"
                        minHeight={70}
                        textArea
                    />
                    <span className="block text-sm mt-2">
                        Date
                    </span>
                    <button 
                        type="button"
                        className="p-3 flex items-center gap-1.5 bg-light-secondary border-[1px] border-light-tertiary rounded text-sm text-secondary"
                        onClick={openTimeSelector}
                        ref={openPopoutButton}
                    >
                        <ClockIcon className="w-4" />
                        {date.toLocaleDateString('default', { dateStyle: 'long' })}
                    </button>
                </div>
                {feedback && (
                    <Feedback 
                        {...feedback}
                        className="mb-4"
                    />
                )}
                <div className="p-4 flex justify-end gap-2 bg-light-secondary">
                    <Button
                        onClick={onSubmit}
                        disabled={loading}
                    >
                        Create post
                    </Button>
                </div>
            </div>
        </main>
    )
}