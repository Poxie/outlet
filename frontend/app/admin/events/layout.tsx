"use client";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { setEvents } from '@/store/slices/events';
import { Event } from '../../../../types';

export default function EventsLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.events.loading);
    
    useEffect(() => {
        get<Event[]>('/events/all').then(events => dispatch(setEvents(events)));
    }, [loading]);

    return children;
}