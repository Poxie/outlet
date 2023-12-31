import { Event } from "../../../../types";
import Image from "next/image";
import { getEventImage, getReadableDateFromTimestamp } from "@/utils";
import EventTableOptions from "./EventTableOptions";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useEvents } from "@/hooks/useEvents";

export default function EventTableSection({ events, header, headerIcon }: {
    events: Event[];
    header: string;
    headerIcon: React.ReactNode;
}) {
    const { hasFilters } = useEvents();

    const [expanded, setExpanded] = useState(true);

    const toggleExpanded = () => setExpanded(prev => !prev);

    return(
        <>
        <tr 
            className="sticky top-[48px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light hover:bg-light-secondary transition-colors"
            onClick={toggleExpanded}
        >
            <td className="px-4 py-[--spacing] font-bold">
                <div className="flex items-start gap-2">
                    <div className="mt-[.06rem]">
                        {headerIcon}
                    </div>
                    <div className="grid">
                        <span>
                            {header}
                        </span>
                        <span className="text-xs font-normal text-secondary">
                            {events.length} events {hasFilters && '(based on filters)'}
                        </span>
                    </div>
                </div>
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
                        <span style={{ wordBreak: 'break-word' }}>
                            {event.title}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-4 text-secondary">
                    <span className="line-clamp-2" style={{ wordBreak: 'break-word' }}>
                        {event.description}
                    </span>
                </td>
                <td className="px-4 py-4 text-secondary">
                    {getReadableDateFromTimestamp(event.timestamp)}
                </td>
                <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                        <EventTableOptions 
                            isArchived={event.archived}
                            eventId={event.id}
                        />
                    </div>
                </td>
            </tr>
        ))}
        </>
    )
}