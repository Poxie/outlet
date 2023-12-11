import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from "@/store"
import { useAuth } from '@/contexts/auth';
import { addEvent as _addEvent, removeEvent as _removeEvent, editEvent as _editEvent, setSearch as _setSearch } from '@/store/slices/events';
import { Event } from '../../types';

export const useEvents = () => {
    const { get, post, _delete } = useAuth();
    
    const dispatch = useAppDispatch();
    const events = useAppSelector(state => state.events.events);
    const loading = useAppSelector(state => state.events.loading);
    const search = useAppSelector(state => state.events.search);
    const categoryId = useAppSelector(state => state.events.categoryId);

    const setSearch = (query: string) => dispatch(_setSearch(query));
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
    const editEvent = (eventId: string, changes: Partial<Event>) => {
        dispatch(_editEvent({ eventId, changes }));
    }
    const archiveEvent = (eventId: string) => editEvent(eventId, { archived: true });
    const unarchiveEvent = (eventId: string) => editEvent(eventId, { archived: false });

    const filteredEvents = useMemo(() => {
        return (
            events
                .filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
                .filter(event => !categoryId || event.parentId === categoryId)
        )
    }, [events, search, categoryId]);

    return { events: filteredEvents, loading, addEvent, removeEvent, editEvent, archiveEvent, unarchiveEvent, search, setSearch, categoryId };
}