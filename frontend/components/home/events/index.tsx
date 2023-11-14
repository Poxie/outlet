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
        <section className="py-6 bg-secondary">
            <div className="w-main w-max-main mx-auto">
                <div className="mb-2 relative flex after:absolute after:z-0 after:left-0 after:top-2/4 after:-translate-y-2/4 after:w-full after:h-[1px] after:bg-light">
                    <span className="px-2 ml-4 relative z-[1] uppercase text-xs font-bold text-light bg-secondary">
                        Våra rekommendationer
                    </span>
                </div>
                <ul className="grid grid-cols-3 gap-2">
                    {events.map(event => (
                        <EventCard {...event} key={event.id} />
                    ))}
                </ul>
            </div>
        </section>
    )
}