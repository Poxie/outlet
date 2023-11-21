import { ClockIcon } from "@/assets/icons/ClockIcon";
import { useEvents } from "."
import { Event } from "../../../../types";
import Image from "next/image";
import { getEventImage, getReadableDateFromTimestamp } from "@/utils";
import EventTableOptions from "./EventTableOptions";
import Button from "@/components/button";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function EventTableSection({ events, header }: {
    events: Event[];
    header: React.ReactNode;
}) {
    const { search, removeEvent, editEvent } = useEvents();

    const [expanded, setExpanded] = useState(true);

    const toggleExpanded = () => setExpanded(prev => !prev);

    return(
        <>
        <tr 
            className="sticky -top-[1px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light hover:bg-light-secondary/40 transition-colors"
            onClick={toggleExpanded}
        >
            <td className="px-4 py-[--spacing] font-bold">
                {!search ? header : `Found ${events.length} results based on filters`}
            </td>
            <td className="w-[50%] px-4 py-[--spacing] font-bold">
                Description
            </td>
            <td className="px-4 py-[--spacing] font-bold">
                Date
            </td>
            <td className="px-4 py-[--spacing]">
                <div className="flex justify-end">
                    <button 
                        className="p-1"
                        aria-label={expanded ? 'Hide events' : 'Show events'}
                    >
                        <ArrowIcon className={twMerge(
                            "w-4 rotate-90 transition-transform duration-200",
                            expanded && "rotate-180"
                        )} />
                    </button>
                </div>
            </td>
        </tr>
        {expanded && events.map(event => (
            <tr 
                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0 h-0"
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
                <td className="px-4 py-4 text-secondary">
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