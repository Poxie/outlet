"use client";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Button from "@/components/button";
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store";
import { getDateFromString, getImageDiff, getWeeklyDealImage, hasImageChanges } from "@/utils";
import { editDeals, addDeals, removeDeals } from "@/store/slices/deals";
import { useAuth } from "@/contexts/auth";
import SortableImages, { ImageWithSrc } from "@/components/sortable-images";
import Feedback from "@/components/feedback";
import { Image } from "../../../../types";

export default function EditWeeklyDeal({ params: { date } }: {
    params: { date: string };
}) {
    const { post, patch, _delete } = useAuth();

    const imageInput = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const prevDeals = useAppSelector(state => state.deals.deals[date]);

    const [deals, setDeals] = useState(prevDeals || []);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);

    useEffect(() => {
        if(!prevDeals) return;
        setDeals(prevDeals);
    }, [prevDeals]);

    const onChange = (images: Image[]) => {
        setFeedback(null);
        setDeals(images);
    };
    const reset = () => setDeals(prevDeals || []);
    const onSubmit = async () => {
        if(!hasImageChanges(prevDeals || [], deals)) {
            setFeedback({ text: 'No changes have been made.', type: 'danger' });
            return
        }

        const { addedImages, removedImages, changedPositions } = getImageDiff(prevDeals || [], deals);

        setLoading(true);
        if(removedImages.length) {
            const imageIds = removedImages.map(i => i.id);
            await _delete(`/images/deals/${date}`, { imageIds });
            dispatch(removeDeals({ date, ids: imageIds }));
        }
        
        let newlyAddedImages: Image[] = [];
        if(addedImages.length) {
            newlyAddedImages = await post<Image[]>(`/images/deals/${date}`, {
                images: addedImages.map(image => image.image)
            });
            dispatch(addDeals({ date, deals: newlyAddedImages }));
        }
        if(changedPositions.length) {
            const positions = deals.map(({ id, position }) => {
                if(id.startsWith('0.')) {
                    const realId = newlyAddedImages.shift()?.id;
                    return {
                        id: realId,
                        position,
                    }
                }
                return { id, position };
            });
            const newImages = await patch<Image[]>(`/images/deals/${date}`, { positions });
         
            dispatch(editDeals({ date, deals: newImages }));
        }

        setLoading(false);
        setFeedback({
            text: 'Deals have been updated.',
            type: 'success',
        });
    }
    
    const hasChanges = prevDeals && (hasImageChanges(prevDeals, deals));
    const images: ImageWithSrc[] = deals?.map(deal => ({
        ...deal,
        src: deal.image.startsWith('data') ? deal.image : getWeeklyDealImage(deal.id, deal.parentId),
    })) || [];
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/veckans-deal'}
                    text={`Veckans deal / ${date}`}
                />
                {deals ? (
                    <>
                    <SortableImages 
                        className="p-4"
                        images={images}
                        onChange={onChange}
                        parentId={date}
                    />
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
                            {loading ? 'Updating deals...' : 'Update deals'}
                        </Button>
                    </div>
                    </>
                ) : (
                    <span className="block text-center py-12">
                        Loading deals...
                    </span>
                )}
            </div>
        </main>
    )
}