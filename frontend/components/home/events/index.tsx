import { twMerge } from "tailwind-merge";
import { Event } from "../../../../types";
import { EventCard } from "./EventCard";

const getEvents = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/events`);
    const data = await res.json();
    return data as Event[];
}

export default async function Events() {
    const events = await getEvents();
    return(
        <section className="py-12 w-main max-w-main mx-auto">
            <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {events.map(event => (
                    <EventCard {...event} key={event.id} />
                ))}
            </ul>
        </section>
    )
}