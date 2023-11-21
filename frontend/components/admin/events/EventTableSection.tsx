import { ClockIcon } from "@/assets/icons/ClockIcon";
import { useEvents } from "."
import { Event } from "../../../../types";
import Image from "next/image";
import { getEventImage, getReadableDateFromTimestamp } from "@/utils";
import EventTableOptions from "./EventTableOptions";
import Button from "@/components/button";

export default function EventTableSection({ events, header }: {
    events: Event[];
    header: React.ReactNode;
}) {
    const { search, removeEvent, editEvent } = useEvents();

    return(
        <>
        <tr className="sticky -top-[1px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light">
            <td className="px-4 py-[--spacing] font-bold">
                {!search ? header : `Found ${events.length} results based on filters`}
            </td>
            <td className="px-4 py-[--spacing] font-bold">
                Description
            </td>
            <td className="px-4 py-[--spacing] font-bold">
                Date
            </td>
            <td></td>
        </tr>
        {events.map(event => (
            <tr 
                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0"
                key={event.id}
            >
                <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                        <Image 
                            width={75}
                            height={60}
                            src={getEventImage(event.id, event.image, event.timestamp)}
                            className="aspect-video object-cover rounded"
                            alt=""
                        />
                        {event.title}
                    </div>
                </td>
                <td className="px-4 py-4 text-secondary w-[50%]">
                    <span className="line-clamp-2">
                        {event.description}
                    </span>
                </td>
                <td className="px-4 py-4 text-secondary">
                    {getReadableDateFromTimestamp(event.timestamp)}
                </td>
                <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                        <EventTableOptions 
                            onRemoveClick={() => removeEvent(event.id)}
                            onEditClick={() => editEvent(event.id)}
                        />
                    </div>
                </td>
            </tr>
        ))}
        </>
    )
}