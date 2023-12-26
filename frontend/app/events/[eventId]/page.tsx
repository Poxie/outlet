import Event from "@/components/event";
import { Event as EventType } from "../../../../types";
    import { getEventImage } from "@/utils";

const basePath = (eventId: string) => `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${eventId}`;
const opts = { next: { revalidate: 0 } };

export async function generateMetadata({ 
    params: { eventId },
    searchParams: { imageId },
}: {
    params: { eventId: string };
    searchParams: { imageId?: string };
}) {
    const res = await fetch(basePath(eventId), opts);
    if(!res.ok) return;

    const event = await res.json() as EventType;

    const title = `${event.title} - Åhlens Outlet`;
    const description = event.description;
    return {
        title,
        description,
        openGraph: {
            url: 
            title,
            description,
            images: imageId ? [getEventImage(eventId, imageId, event.timestamp)] : [],
        }
    }
}

export default Event;