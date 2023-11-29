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
        <section className="py-8 bg-primary">
            <ul className="w-main max-w-main mx-auto grid sm:grid-cols-2 lg:grid-cols-3 bg-light rounded-lg overflow-hidden">
                {events.map(event => (
                    <EventCard {...event} key={event.id} />
                ))}
            </ul>
        </section>
    )
}