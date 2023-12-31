"use client";
import { useEffect, useRef, useState } from 'react';
import AdminHeader from "../../AdminHeader";
import AdminTabs from "../../AdminTabs";
import Input from '@/components/input';
import Button from '@/components/button';
import { useAuth } from '@/contexts/auth';
import Feedback from '@/components/feedback';
import { useRouter } from 'next/navigation';
import { addCategory, selectCategoryById, updateCategory } from '@/store/slices/categories';
import { useAppDispatch, useAppSelector } from '@/store';
import { usePopout } from '@/contexts/popout';
import EventsPopout from '@/popouts/events';
import { Event, EventCategory } from '../../../../../types';
import events, { editEvent, selectEventById, selectEventsByParent } from '@/store/slices/events';
import Image from 'next/image';
import { getEventImage } from '@/utils';

const getDummyCategory = () => ({
    name: '',
    description: '',
})
export default function CreateEventCategory({ params: { categoryId } }: {
    params: { categoryId: string };
}) {
    const router = useRouter();
    const { post, patch, put } = useAuth();
    const { setPopout } = usePopout();

    const dispatch = useAppDispatch();
    const prevCategory = useAppSelector(state => selectCategoryById(state, categoryId));
    const prevEventIds = useAppSelector(state => selectEventsByParent(state, categoryId));

    const [categoryInfo, setCategoryInfo] = useState(prevCategory || getDummyCategory());
    const [eventIds, setEventIds] = useState<string[]>(prevEventIds || []);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    const [loading, setLoading] = useState(false);

    const eventsPopoutButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if(!prevCategory) return;
        setCategoryInfo(prevCategory);
    }, [prevCategory]);
    useEffect(() => {
        if(!prevEventIds) return;
        setEventIds(prevEventIds);
    }, [prevEventIds]);
    const reset = () => {
        if(!prevCategory) return;
        setEventIds(prevEventIds);
        setCategoryInfo(prevCategory);
    }

    const openEventsPopout = () => {
        const onChange = (event: Event) => {
            setEventIds(prev => {
                if(prev.includes(event.id)) {
                    return prev.filter(id => id !== event.id);
                }
                return [...[event.id], ...prev];
            });
        }

        setPopout({
            popout: <EventsPopout selectedIds={eventIds} onChange={onChange} />,
            ref: eventsPopoutButton,
            options: { position: 'left' },
        })
    }

    const updateProperty = (prop: keyof typeof categoryInfo, value: string) => {
        setFeedback(null);
        setCategoryInfo(prev => ({
            ...prev,
            [prop]: value,
        }));
    }

    const getChanges = () => {
        if(!prevCategory || !prevEventIds) return {
            categoryChanges: categoryInfo,
            eventChanges: eventIds,
        };

        const categoryChanges: {[key: string]: any} = {};
        for(const [prop, val] of Object.entries(categoryInfo)) {
            if(prevCategory[prop as keyof typeof prevCategory] !== val) {
                categoryChanges[prop] = val;
            }
        }

        const eventChanges = eventIds.toString() === prevEventIds.toString() ? [] : eventIds;

        return { categoryChanges, eventChanges };
    }
    const hasChanges = () => {
        return {
            info: Object.keys(getChanges().categoryChanges).length > 0,
            events: (Object.keys(getChanges().eventChanges).length > 0 || eventIds.length !== prevEventIds.length),
        }
    }
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
            
            const category = await post<EventCategory>(`/categories`, categoryInfo);
            dispatch(addCategory(category));

            
            if(eventIds.length) {
                await put(`/categories/${category.id}/children`, { eventIds: eventIds });
                
                for(const eventId of eventIds) {
                    dispatch(editEvent({ eventId: eventId, changes: { parentId: category.id } }));
                    dispatch(updateCategory({ categoryId: category.id, changes: { eventCount: eventIds.length } }));
                }
            }

            
            router.replace('/admin/events/categories');
            return;
        }

        if(!hasChanges().events && !hasChanges().info) {
            setFeedback({
                text: 'No changes have been made.',
                type: 'danger',
            })
            return;
        }

        setLoading(true);

        const { categoryChanges, eventChanges } = getChanges();
        
        if(hasChanges().info) {
            await patch(`/categories/${prevCategory.id}`, categoryChanges);
            dispatch(updateCategory({ categoryId, changes: categoryChanges }));
        }
        if(hasChanges().events) {
            await put(`/categories/${prevCategory.id}/children`, { eventIds: eventChanges });

            const removedIds = prevEventIds.filter(id => !eventIds.includes(id));
            for(const id of removedIds) {
                dispatch(editEvent({ eventId: id, changes: { parentId: null } }));
            }
            
            for(const event of eventChanges) {
                dispatch(editEvent({ eventId: event, changes: { parentId: categoryId } }));
                dispatch(updateCategory({ categoryId, changes: { eventCount: eventChanges.length } }));
            }

            if(!eventIds.length) {
                dispatch(updateCategory({ categoryId, changes: { eventCount: 0 } }));
            }
        }

        setLoading(false);
        setFeedback({
            text: 'Category has been updated.',
            type: 'success',
        })
    }

    const isCreatingCategory = !prevCategory;
    const canReset = !isCreatingCategory && (hasChanges().events || hasChanges().info);
    return(
        <div className="bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                backPath={'/admin/events/categories'}
                text={`Events / Categories / ${isCreatingCategory ? 'Create category' : prevCategory.name}`}
                options={canReset ? (
                    <span className="block text-xs font-semibold p-2 mr-2 rounded-md bg-primary/40 border-[1px] border-c-primary">
                        You have unsaved changes.
                    </span>
                ) : undefined}
            />
            <div className="flex">
                <div className="p-4 flex-1 border-r-[1px] border-r-light-secondary">
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
                <div className="p-4 flex-1">
                    <span className="block text-sm mb-1">
                        Assigned events
                    </span>
                    <div className="flex flex-col gap-1.5">
                        {eventIds.map(eventId => (
                            <AssignedEvent 
                                id={eventId}
                                key={eventId}
                            />
                        ))}
                        <button 
                            className="p-3 text-center hover:bg-light-secondary/50 transition-colors border-[1px] border-light-tertiary text-secondary rounded-md"
                            onClick={openEventsPopout}
                            ref={eventsPopoutButton}
                        >
                            Assgin event
                        </button>
                    </div>
                </div>
            </div>
            {feedback && (
                <Feedback 
                    className="mb-4"
                    {...feedback}
                />
            )}
            <div className="p-4 flex justify-end gap-2 bg-light-secondary">
                {canReset && (
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
                    {isCreatingCategory ? (
                        !loading ? 'Create category' : 'Creating category...'
                    ) : (
                        !loading ? 'Update category' : 'Updating category...'
                    )}
                </Button>
            </div>
        </div>
    )
}

function AssignedEvent({ id }: {
    id: string;
}) {
    const event = useAppSelector(state => selectEventById(state, id));
    if(!event) return null;

    return(
        <li className="flex gap-3">
            <div className="min-w-[30%] rounded overflow-hidden">
                <Image 
                    width={100}
                    height={100}
                    src={getEventImage(event.id, event.image, event.timestamp)}
                    className="w-full aspect-video object-cover"
                    alt=""
                />
            </div>
            <div className="flex flex-col text-left ">
                <span className="font-semibold">
                    {event.title}
                </span>
                <span className="line-clamp-2 text-sm text-secondary">
                    {event.description}
                </span>
            </div>
        </li>
    )
}