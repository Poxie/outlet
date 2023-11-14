import { twMerge } from "tailwind-merge";
import { Event } from "../../../../types";
import { EventCard } from "./EventCard";

const getEvents = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/events?with_images=true`);
    const data = await res.json();
    return data as Event[];
}

export default async function Events() {
    const events = await getEvents();
    return(
        <section className="py-6">
            <div className="w-main max-w-main mx-auto">
                <div className="mb-2 relative flex after:absolute after:z-0 after:left-0 after:top-2/4 after:-translate-y-2/4 after:w-full after:h-[1px] after:bg-light">
                    <span className={twMerge(
                        "px-2 mx-auto relative z-[1] uppercase text-xs font-bold text-light bg-secondary",
                        "md:ml-4",
                    )}>
                        Våra rekommendationer
                    </span>
                </div>
                <ul className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {events.map(event => (
                        <EventCard {...event} key={event.id} />
                    ))}
                </ul>
            </div>
        </section>
    )
}