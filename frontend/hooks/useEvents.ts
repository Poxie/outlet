import { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@/store"
import { useAuth } from '@/contexts/auth';
import { addEvent as _addEvent, removeEvent as _removeEvent } from '@/store/slices/events';
import { Event } from '../../types';

export const useEvents = () => {
    const { get, post, _delete } = useAuth();
    
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.events.events);
    const loading = useAppSelector(state => state.events.loading);

    const [search, setSearch] = useState('');

    const addEvent = async (event: Event) => {
        const { title, description, image, timestamp } = event;
        const createdEvent = await post<Event>(`/events`, {
            title,
            description,
            image,
            timestamp,
        });
        dispatch(_addEvent(createdEvent));
    }
    const removeEvent = async (eventId: string, fetch=true) => {
        if(fetch) await _delete<{}>(`/events/${eventId}`);
        dispatch(_removeEvent(eventId));
    }
    const editEvent = (eventId: string) => {

    }
    const archiveEvent = (eventId: string) => {

    }

    return { events, loading, addEvent, removeEvent, editEvent, archiveEvent, search, setSearch };
}