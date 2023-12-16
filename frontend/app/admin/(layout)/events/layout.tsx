"use client";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { setEvents } from '@/store/slices/events';
import { Event } from '../../../../types';
import { setCategories } from '@/store/slices/categories';

export default function EventsLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.events.loading);
    
    useEffect(() => {
        const reqs = [
            get<Event[]>('/events/all'),
            get<Event[]>('/categories'),
        ]
        Promise.all(reqs)
            .then(([events, categories]) => {
                dispatch(setEvents(events))
                dispatch(setCategories(categories));
            })
    }, [loading]);

    return children;
}