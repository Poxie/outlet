import React, { useEffect, useState } from "react";
import { Event } from "../../../../types";
import { getDateFromString, getEventImage, getReadableDateFromTimestamp, getWeeklyDealImage } from "@/utils";
import Image from "next/image";
import EventTableOptions from "./EventTableOptions";
import { useAuth } from "@/contexts/auth";

const getEvents = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/all`, { next: { revalidate: 0 } });
    const events = await res.json();
    return events as Event[];
}

export default function EventsTable() {
    const { _delete } = useAuth();

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        getEvents().then(setEvents);
    }, []);
    
    const removeEvent = async (eventId: string) => {
        await _delete(`/events/${eventId}`);
        setEvents(prev => prev.filter(event => event.id !== eventId));
    }

    return(
        !events.length ? null : (
            <table className="[--spacing:12px_16px] w-full text-sm">
                <thead>
                    <tr className="text-left bg-light-secondary">
                        <th className="p-[--spacing]">
                            Nuvarande event
                        </th>
                        <th className="p-[--spacing]">
                            Description
                        </th>
                        <th className="p-[--spacing]">
                            Date
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, key) => (
                        <tr 
                            className="border-b-[1px] border-b-light-secondary/80 last:border-b-0"
                            key={key}
                        >
                            <td className="p-[--spacing] flex items-center gap-2 text-primary font-semibold">
                                <Image 
                                    width={75}
                                    height={60}
                                    src={getEventImage(event.id, event.image, event.timestamp)}
                                    className="aspect-video object-cover rounded-md"
                                    alt=""
                                />
                                {event.title}
                            </td>
                            <td className="p-[--spacing] text-secondary lg:w-[50%]">
                                {event.description}
                            </td>
                            <td className="p-[--spacing] text-secondary">
                                {getReadableDateFromTimestamp(event.timestamp)}
                            </td>
                            <td className="p-[--spacing]">
                                <div className="flex justify-end">
                                    <EventTableOptions 
                                        onRemoveClick={() => removeEvent(event.id)}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    )
}