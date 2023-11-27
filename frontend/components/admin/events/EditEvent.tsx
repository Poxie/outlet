"use client";
import { useAppDispatch, useAppSelector } from "@/store";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { addEvent, editEvent, selectEventById } from "@/store/slices/events";
import { useState, useRef, useEffect } from "react";
import { Event } from "../../../../types";
import Image from "next/image";
import Input from "@/components/input";
import { getEventImage } from "@/utils";
import { TimeSelector } from "@/components/time-selector";
import { usePopout } from "@/contexts/popout";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

const createDummyEvent: () => Event = () => ({
    id: Math.random().toString(),
    image: '',
    title: '',
    description: '',
    timestamp: Date.now().toString(),
    archived: false,
})

export default function EditEvent({ params: { eventId } }: {
    params: { eventId: string };
}) {
    const router = useRouter();
    const { post, patch } = useAuth();
    const { close: closePopout, setPopout } = usePopout();

    const dispatch = useAppDispatch();
    const event = useAppSelector(state => selectEventById(state, eventId));
    const eventsLoading = useAppSelector(state => state.events.loading);
    
    const [eventInfo, setEventInfo] = useState(event || createDummyEvent());
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

    const onSubmit = async () => {
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
            dispatch(addEvent(createdEvent));

            router.replace(`/admin/events`);
            return;
        }

        const changes: {[prop: string]: Event[keyof Event]} = {};
        Object.entries(eventInfo).forEach(([prop, val]) => {
            const key = prop as keyof Event;
            if(event[key] !== val) changes[key] = val;
        });
        if(!Object.keys(changes).length) return setFeedback({ text: 'No changes have been made.', type: 'danger' });

        setLoading(true);
        const updatedEvent = await patch(`/events/${eventInfo.id}`, changes);
        
        dispatch(editEvent({ eventId, changes: updatedEvent }));
        setFeedback({ text: 'Event has been updated.', type: 'success' });
        setLoading(false);
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

    return(
        <main className="my-12 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    text={eventsLoading ? (
                        'Events'
                    ) : (
                        !isCreatingEvent ? `Event: ${event.title}` : 'Create event'
                    )}
                    backPath={'/admin/events'}
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
                {!eventsLoading ? (
                    <>
                    <div className="p-4 flex gap-3">
                        <div className="flex flex-col">
                            <span className="block text-sm mb-1">
                                Header image
                            </span>
                            <button 
                                className="h-full aspect-video flex items-center justify-center bg-light-secondary/50 border-[1px] border-light-tertiary rounded-md overflow-hidden"
                                onClick={() => headerImageInput.current?.click()}
                            >
                                {eventInfo.image ? (
                                    <Image
                                        width={400}
                                        height={400}
                                        src={eventInfo.image.startsWith('data') ? eventInfo.image : getEventImage(eventInfo.id, eventInfo.image, eventInfo.timestamp)}
                                        className="h-full object-cover"
                                        alt=""
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
                                    if(!e.target.files?.length) return;
                                    updateProperty('image', e.target.files[0]);
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
                    <div className="p-4 flex justify-end bg-light-secondary">
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
        </main>
    )
}