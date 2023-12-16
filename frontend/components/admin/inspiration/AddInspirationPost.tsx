"use client";
import { useState, useRef, useEffect } from 'react';
import { BlogPost, Image } from "../../../../types";
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { ClockIcon } from '@/assets/icons/ClockIcon';
import { usePopout } from '@/contexts/popout';
import { TimeSelector } from '@/components/time-selector';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import Feedback from '@/components/feedback';
import { useAppDispatch, useAppSelector } from '@/store';
import { addInspiration, addInspirationImages, editInspiration, removeInspiration, removeInspirationImages, selectInspirationById, setInspirationImages, updateInspirationImagePositions } from '@/store/slices/inspiration';
import { useRouter } from 'next/navigation';
import SortableImages, { ImageWithSrc } from '@/components/sortable-images';
import { getBlogImage, getImageDiff } from '@/utils';

const getDummyPost: () => BlogPost = () => ({
    id: Math.random().toString(),
    title: '',
    description: '',
    timestamp: Date.now().toString(),
    archived: false,
    images: [],
})
export default function AddInspirationPost({ params: { inspirationId } }: {
    params: { inspirationId?: string };
}) {
    const router = useRouter();
    const { post, patch, _delete } = useAuth();
    const { close: closePopout, setPopout } = usePopout();

    const dispatch = useAppDispatch();

    const prevPost = useAppSelector(state => selectInspirationById(state, inspirationId || ''));
    const prevImages = prevPost?.images || [];

    const [loading, setLoading] = useState(false);
    const [postInfo, setPostInfo] = useState(prevPost || getDummyPost());
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'danger' | 'success';
    }>(null);

    const openPopoutButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(!prevPost || (!postInfo && String(postInfo) === String(prevPost))) return;
        setPostInfo(prevPost);
    }, [prevPost]);

    const isCreatingPost = !prevPost;

    const getImageChanges = () => {
        const postImages = postInfo.images;

        const addedImages = postImages.filter(image => image.image.startsWith('data'));

        const newIds = postImages.map(image => image.id);
        const removedImages = prevImages.filter(image => !newIds.includes(image.id));
        
        const prevPositions = prevImages.map(image => `${image.id}-${image.position}`);
        const changedPositions = postImages.filter(image => `${image.id}-${image.position}` !== prevPositions[image.position]);
        
        return { added: addedImages, removed: removedImages, positions: changedPositions };
    }
    const hasImageChanges = () => {
        const { added, removed, positions } = getImageChanges();
        return !!(added.length || removed.length || positions.length);
    }
    const getChanges = () => {
        if(!prevPost) return {};

        const changes: {[prop: string]: BlogPost[keyof BlogPost]} = {};
        Object.entries(postInfo).forEach(([prop, val]) => {
            if(prop === 'images') return;
            
            const key = prop as keyof BlogPost;
            if(prevPost[key] !== val) changes[key] = val;
        });
        return changes;
    }
    const hasInfoChanges = () => {
        const changes = getChanges();
        return Object.keys(changes).length > 0;
    }
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

        if(isCreatingPost) {
            setLoading(true);
            const blogPost = await post('/inspiration', postInfo);
            dispatch(addInspiration(blogPost));
            router.replace('/admin/inspiration');
        } else {
            if(!hasInfoChanges() && !hasImageChanges()) {
                setFeedback({
                    text: 'No changes have been made.',
                    type: 'danger',
                })
                return;
            }

            setLoading(true);
            if(hasInfoChanges()) {
                const changes = getChanges();
                await patch(`/inspiration/${prevPost.id}`, changes);
                dispatch(editInspiration({ inspirationId, changes }));
            }
            await updateImages()

            setLoading(false);
            setFeedback({
                text: 'Post has been updated.',
                type: 'success',
            })
        }
    }
    const updateImages = async () => {
        const { addedImages, removedImages, changedPositions } = getImageDiff(prevImages, postInfo.images);
        if(!addedImages.length && !removedImages.length && !changedPositions.length) return;
        
        if(removedImages.length) {
            const ids = removedImages.map(i => i.id);
            await _delete(`/images/inspiration/${inspirationId}`, { imageIds: ids });
            dispatch(removeInspirationImages({ inspirationId, ids }));
        }
        
        let newlyAddedImages: Image[] = [];
        if(addedImages.length) {
            newlyAddedImages = await post<Image[]>(`/images/inspiration/${inspirationId}`, {
                images: addedImages.map(image => image.image)
            });
            dispatch(addInspirationImages({ inspirationId, images: newlyAddedImages }));
        }
        if(changedPositions.length) {
            const positions = postInfo.images.map(({ id, position }) => {
                if(id.startsWith('0.')) {
                    const realId = newlyAddedImages.shift()?.id;
                    return {
                        id: realId,
                        position,
                    }
                }
                return { id, position };
            });
            const newImages = await patch<Image[]>(`/images/inspiration/${inspirationId}`, { positions });
            dispatch(setInspirationImages({ inspirationId, images: newImages }));
        }
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
    const reset = () => setPostInfo(prevPost || getDummyPost());

    const images: ImageWithSrc[] = postInfo.images.map(image => ({
        ...image,
        src: image.image.startsWith('data') ? image.image : getBlogImage(image.parentId, image.id),
    }))

    const hasChanges = hasInfoChanges() || hasImageChanges();
    const date = new Date(Number(postInfo.timestamp));
    return(
        <div className="bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                backPath={'/admin/inspiration'}
                text={isCreatingPost ? (
                    'Inspiration / Create post'
                ) : (
                    `Inspiration / ${prevPost.title}`
                )}
                options={hasChanges ? (
                    <span className="block text-xs font-semibold p-2 mr-2 rounded-md bg-primary/40 border-[1px] border-c-primary">
                        You have unsaved changes.
                    </span>
                ) : undefined}
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
                <div className="py-3 relative after:z-[1] after:w-full after:h-[1px] after:absolute after:left-0 after:top-2/4 after:-translate-y-2/4 after:bg-light-tertiary">
                    <span className="pr-4 relative z-[2] inline-block text-sm bg-light">
                        Post images
                    </span>
                </div>
                <SortableImages 
                    images={images}
                    onChange={images => updateProperty('images', images)}
                    parentId={postInfo.id}
                />
            </div>
            {feedback && (
                <Feedback 
                    {...feedback}
                    className="mb-4"
                />
            )}
            
            <div className="p-4 flex justify-end gap-2 bg-light-secondary">
                {hasChanges && (
                    <Button 
                        type={'transparent'}
                        onClick={reset}
                    >
                        Reset changes
                    </Button>
                )}
                <Button
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {isCreatingPost ? (
                        !loading ? 'Create post' : 'Creating post...'
                    ) : (
                        !loading ? 'Update post' : 'Updating post...'
                    )}
                </Button>
            </div>
        </div>
    )
}