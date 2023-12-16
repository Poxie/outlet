"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { addEvent, editEvent, selectEventById, selectEventImagesById, setEventImages as _setEventImages, addEventImages, removeEventImages, updateEventImagesPosition } from "@/store/slices/events";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Event, Image as ImageType } from "../../../../types";
import Image from "next/image";
import Input from "@/components/input";
import { getEventImage, getImageDiff } from "@/utils";
import { TimeSelector } from "@/components/time-selector";
import { usePopout } from "@/contexts/popout";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { BinIcon } from "@/assets/icons/BinIcon";
import SortableImages, { ImageWithSrc } from "@/components/sortable-images";

const createDummyEvent: () => Event = () => ({
    id: Math.random().toString(),
    image: '',
    title: '',
    description: '',
    timestamp: Date.now().toString(),
    archived: false,
    parentId: null,
})

export default function EditEvent({ params: { eventId } }: {
    params: { eventId: string };
}) {
    const router = useRouter();
    const { get, post, patch, _delete } = useAuth();
    const { close: closePopout, setPopout } = usePopout();

    const dispatch = useAppDispatch();

    const prevImages = useAppSelector(state => selectEventImagesById(state, eventId));
    const event = useAppSelector(state => selectEventById(state, eventId));
    const eventsLoading = useAppSelector(state => state.events.loading);
    
    const [eventInfo, setEventInfo] = useState(event || createDummyEvent());
    const [eventImages, setEventImages] = useState(prevImages || []);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    
    const headerImageInput = useRef<HTMLInputElement>(null);
    const openPopoutButton = useRef<HTMLButtonElement>(null);
    
    const date = new Date(Number(eventInfo.timestamp));
    const isCreatingEvent = !event;

    useEffect(() => {
        if(!event) return;
        setEventInfo(event);
    }, [event]);
    useEffect(() => {
        if(!prevImages && !isCreatingEvent) {
            get<ImageType[]>(`/images/events/${eventId}`).then(images => {
                dispatch(_setEventImages({ eventId, images }));
            })
            return;
        }
        if(!prevImages) return;
        setEventImages(prevImages);
    }, [prevImages, isCreatingEvent]);

    const hasInfodiff = () => Object.keys(getInfoDiff()).length > 0;
    const getInfoDiff = () => {
        if(!event) return {};

        const changes: {[prop: string]: Event[keyof Event]} = {};
        Object.entries(eventInfo).forEach(([prop, val]) => {
            const key = prop as keyof Event;
            if(event[key] !== val) changes[key] = val;
        });
        return changes;
    }
    const hasImageDiff = () => {
        if(!prevImages) {
            return eventImages.length > 0;
        }

        const { addedImages, removedImages, changedPositions } = getImageDiff(prevImages, eventImages);
        return !!(addedImages.length || removedImages.length || changedPositions.length);
    }
    const updateImages = async (eventId: string) => {
        const { addedImages, removedImages, changedPositions } = getImageDiff(prevImages || [], eventImages);
        if(!addedImages.length && !removedImages.length && !changedPositions.length) return;
        
        if(removedImages.length) {
            const imageIds = removedImages.map(i => i.id);
            await _delete(`/images/events/${eventId}`, { imageIds });
            dispatch(removeEventImages({ eventId, ids: imageIds }));
        }
        
        let newlyAddedImages: ImageType[] = [];
        if(addedImages.length) {
            newlyAddedImages = await post<ImageType[]>(`/images/events/${eventId}`, {
                images: addedImages.map(image => image.image)
            });
            dispatch(addEventImages({ eventId, images: newlyAddedImages }));
        }
        if(prevImages && changedPositions.length) {
            const positions = eventImages.map(({ id, position }) => {
                if(id.startsWith('0.')) {
                    const realId = newlyAddedImages.shift()?.id;
                    return {
                        id: realId,
                        position,
                    }
                }
                return { id, position };
            });
            const newImages = await patch<ImageType[]>(`/images/events/${eventId}`, { positions });
            dispatch(_setEventImages({ eventId, images: newImages }));
        }
    }
    const onSubmit = async () => {
        const previousImages = prevImages || [];

        if(isCreatingEvent) {
            const propsToCheck = ['title', 'description', 'image'] as const;
            const invalidProps = propsToCheck.filter(prop => !eventInfo[prop]);
            if(invalidProps.length) {
                const formatter = new Intl.ListFormat('default', { style: 'long', type: 'conjunction' });
                const formattedString = formatter.format(invalidProps)
                const firstLetterUppercase = formattedString.slice(0,1).toUpperCase() + formattedString.slice(1);
                return setFeedback({
                    text: `${firstLetterUppercase} ${invalidProps.length > 1 ? 'are' : 'is'} required.`,
                    type: 'danger',
                });
            }

            setLoading(true);
            const createdEvent = await post<Event>('/events', eventInfo);

            await updateImages(createdEvent.id);

            dispatch(addEvent(createdEvent));
            router.replace('/admin/events');
        } else {
            const hasInfoChanges = hasInfodiff();
            const hasImageChanges = hasImageDiff();

            if(!hasInfoChanges && !hasImageChanges) {
                setFeedback({ text: 'No changes have been made.', type: 'danger' });
                return;
            }

            setLoading(true);
            if(hasInfoChanges) {
                const updatedEvent = await patch(`/events/${eventInfo.id}`, getInfoDiff());
                dispatch(editEvent({ eventId, changes: updatedEvent }));
            }
            if(hasImageChanges) {
                await updateImages(eventId);
            }
            
            setFeedback({ text: 'Event has been updated.', type: 'success' });
            setLoading(false);
        }
    }
    const updateProperty = (property: keyof typeof eventInfo, value: Event[keyof Event] | File) => {
        setFeedback(null);

        if(value instanceof File) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(value);

            fileReader.onload = () => {
                const image = fileReader.result;
                if(typeof image !== 'string') throw new Error('File reader read image incorrectly.');
                setEventInfo(prev => ({...prev, ...{ image }}));
            }
            return;
        }
        setEventInfo(prev => ({...prev, ...{
            [property]: value
        }}))
    }
    const onChange = setEventImages;

    const reset = () => {
        if(!prevImages || !event) return;
        setEventImages(prevImages);
        setEventInfo(event);
    }
    
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

    const hasChanges = !isCreatingEvent && (hasInfodiff() || hasImageDiff());
    const images = useMemo(() => eventImages.map(image => ({
        ...image,
        src: image.image.startsWith('data') ? image.image : getEventImage(eventId, image.id, date.getTime().toString()),
    })), [eventImages])
    return(
        <div className="bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                text={eventsLoading ? (
                    'Events'
                ) : (
                    !isCreatingEvent ? `Events / ${event.title}` : 'Events / Create event'
                )}
                backPath={'/admin/events'}
                options={hasChanges ? (
                    <span className="block text-xs font-semibold p-2 mr-2 rounded-md bg-primary/40 border-[1px] border-c-primary">
                        You have unsaved changes.
                    </span>
                ) : undefined}
            />
            {feedback && (
                <span className={twMerge(
                    "block mx-4 mt-4 p-3 rounded-md text-sm border-[1px]",
                    feedback.type === 'danger' && 'bg-red-400/50 border-red-400',
                    feedback.type === 'success' && 'bg-green-300/50 border-green-300',
                )}>
                    {feedback.text}
                </span>
            )}
            {(!eventsLoading && (!!prevImages || isCreatingEvent)) ? (
                <>
                <div>
                    <div className="p-4 pb-0 flex gap-3 flex-col md:flex-row">
                        <div className="flex flex-col">
                            <span className="block text-sm mb-1">
                                Header image
                            </span>
                            <button 
                                className={twMerge(
                                    "relative aspect-video flex items-center justify-center bg-light-secondary/50 border-[1px] border-light-tertiary rounded-md overflow-hidden",
                                    eventInfo.image && 'after:content-["Change_image"] after:absolute after:w-full after:h-full after:z-[2] after:flex after:items-center after:justify-center after:bg-light-secondary/70 after:opacity-0 hover:after:opacity-100 after:transition-opacity',
                                )}
                                onClick={() => headerImageInput.current?.click()}
                            >
                                {eventInfo.image ? (
                                    <Image
                                        width={400}
                                        height={400}
                                        src={eventInfo.image.startsWith('data') ? eventInfo.image : getEventImage(eventInfo.id, eventInfo.image, eventInfo.timestamp)}
                                        className="h-full object-cover"
                                        alt="Event header image"
                                    />
                                ) : (
                                    <span className="px-40">
                                        Add image
                                    </span>
                                )}
                            </button>
                            <input 
                                type="file"
                                ref={headerImageInput}
                                className="hidden"
                                onChange={e => {
                                    if(!e.target.files?.length || !headerImageInput.current) return;
                                    updateProperty('image', e.target.files[0]);
                                    headerImageInput.current.value = '';
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <span className="block text-sm mb-1">
                                Title
                            </span>
                            <Input 
                                value={eventInfo.title}
                                onChange={title => updateProperty('title', title)}
                                placeholder={'Title...'}
                                className="w-full"
                            />
                            <span className="block text-sm mb-1 mt-2">
                                Description
                            </span>
                            <Input 
                                value={eventInfo.description}
                                onChange={description => updateProperty('description', description)}
                                placeholder={'Description...'}
                                className="w-full"
                                minHeight={71}
                                textArea
                            />
                            <span className="block text-sm mb-1">
                                Event start
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
                    </div>
                    <div className="py-3 mx-4 relative after:z-[1] after:w-full after:h-[1px] after:absolute after:left-0 after:top-2/4 after:-translate-y-2/4 after:bg-light-tertiary">
                        <span className="pr-4 relative z-[2] inline-block text-sm bg-light">
                            Event images
                        </span>
                    </div>
                    <SortableImages 
                        onChange={onChange}
                        parentId={eventId}
                        images={images}
                        className="p-4 pt-0"
                    />
                </div>
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
                        {isCreatingEvent ? (
                            loading ? 'Creating event...' : 'Create event'
                        ) : (
                            loading ? 'Updating event...' : 'Update event'
                        )}
                    </Button>
                </div>
                </>
            ) : (
                <span className="block py-24 text-center">
                    Loading event...
                </span>
            )}
        </div>
    )
}