"use client";
import { useAuth } from "@/contexts/auth";
import React, { useEffect, useState } from "react";
import EventsTable from "./EventsTable";
import { Event } from "../../../../types";
import EventPanel from "./EventPanel";

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
    const { get, post, _delete } = useAuth();

    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState('');

    const getEvents = async () => await get<Event[]>(`/events/all`);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    const addEvent = (event: Event) => setEvents(prev => [...[event], ...prev]);
    const removeEvent = async (eventId: string) => {
        await _delete(`/events/${eventId}`);
        setEvents(prev => prev.filter(event => event.id !== eventId));
    }

    const value = {
        events,
        addEvent,
        removeEvent,
        search,
        setSearch,
    }
    return(
        <main className="relative my-12 max-h-[750px] min-h-[500px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <EventContext.Provider value={value}>
                <EventPanel />
                <EventsTable />
            </EventContext.Provider>
        </main>
    )
}