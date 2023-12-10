import Image from "next/image";
import { Event, Image as ImageType } from "../../../types";
import { twMerge } from "tailwind-merge";
import { getEventImage } from "@/utils";
import ExpandableImage from "../expandable-image";
import EventContainer from "./EventContainer";

const getEvent = async (eventId: string) => {
    const basePath = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${eventId}`;
    const opts = { next: { revalidate: 0 } };

    const [event, images] = await Promise.all(
        [
            fetch(basePath, opts).then(res => res.json()),
            fetch(`${basePath}/images`, opts).then(res => res.json())
        ]
    )

    return {
        event: event as Event,
        images: images as ImageType[],
    }
}

export default async function Event({ 
    params: { eventId },
    searchParams: { photoId },
}: {
    params: { eventId: string };
    searchParams: { photoId?: string };
}) {
    const { event, images } = await getEvent(eventId);

    return(
        <div className="w-main max-w-main mx-auto py-8">
            <EventContainer 
                photoId={photoId}
                event={{
                    ...event,
                    images,
                }}
            />
        </div>
    )
}