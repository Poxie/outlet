"use client";
import { useAuth } from "@/contexts/auth";
import React, { useEffect, useMemo, useState } from "react";
import EventsTable from "./EventsTable";
import { Event } from "../../../../types";
import EventPanel from "./EventPanel";
import { useRouter, useSearchParams } from "next/navigation";

const EventContext = React.createContext<null | {
    events: Event[];
    removeEvent: (eventId: string) => Promise<void>;
    addEvent: (event: Event) => void;
    search: string;
    setSearch: (query: string) => void;
}>(null);
export const useEvents = () => {
    const context = React.useContext(EventContext);
    if(!context) throw new Error('Component is not wrapped in events provider.');
    return context;
}
export default function Events() {
    const router = useRouter();
    const { get, post, _delete } = useAuth();
    const search = useSearchParams().get('search') || '';

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const getEvents = async () => await get<Event[]>(`/events/all`);
        getEvents().then(setEvents);
    }, []);

    const addEvent = (event: Event) => setEvents(prev => [...[event], ...prev]);
    const removeEvent = async (eventId: string) => {
        await _delete(`/events/${eventId}`);
        setEvents(prev => prev.filter(event => event.id !== eventId));
    };

    const setSearch = (query: string) => {
        if(!query) return router.replace(`/admin/events`);
        router.replace(`/admin/events?search=${query}`);
    }

    const filteredEvents = useMemo(() => events.filter(event => (
        event.title.toLowerCase().includes(search.toLowerCase())
    )), [search, events])

    const value = {
        events: filteredEvents,
        addEvent,
        removeEvent,
        search,
        setSearch,
    }
    return(
        <main className="relative my-12 flex flex-col max-h-[750px] min-h-[500px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <EventContext.Provider value={value}>
                <EventPanel />
                <EventsTable />
            </EventContext.Provider>
        </main>
    )
}