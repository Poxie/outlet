"use client";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useEffect, useRef, useState } from "react";
import EventsTable from "./EventsTable";
import { useModal } from "@/contexts/modal";
import AddEventModal from "@/modals/add-event";
import { Event } from "../../../../types";

const getEvents = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/all`, { next: { revalidate: 0 } });
    const events = await res.json();
    return events as Event[];
}

export default function Events() {
    const { post, _delete } = useAuth();
    const { setModal } = useModal();

    const [events, setEvents] = useState<Event[]>([]);

    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const image = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);

    const addEvent = (event: Event) => setEvents(prev => [...[event], ...prev]);
    const removeEvent = async (eventId: string) => {
        await _delete(`/events/${eventId}`);
        setEvents(prev => prev.filter(event => event.id !== eventId));
    }

    const openAddEventModal = () => setModal(
        <AddEventModal 
            onEventAdd={addEvent}
        />
    )

    return(
        <main className="relative my-12 flex flex-col justify-between max-h-[750px] min-h-[500px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <EventsTable 
                events={events}
                removeEvent={removeEvent}
            />

            <div className="p-2 w-full sticky bottom-0 bg-light">
                <div className="p-4 flex justify-end bg-light-secondary rounded-lg">
                    <Button onClick={openAddEventModal}>
                        Create event
                    </Button>
                </div>
            </div>
        </main>
    )
}