import React from "react";
import { getEventImage, getReadableDateFromTimestamp, getWeeklyDealImage } from "@/utils";
import Image from "next/image";
import EventTableOptions from "./EventTableOptions";
import { useEvents } from ".";

export default function EventsTable() {
    const { events, removeEvent, search, loading } = useEvents();

    const hasFilters = !!search;
    return(
        events.length ? (
            <table className="[--spacing:.75rem] block p-4 pt-0 w-full text-sm border-spacing-2">
                <thead>
                    <tr className="sticky -top-[1px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light">
                        <th className="py-[--spacing] rounded-l-lg">
                            {!search ? 'On-going events' : `Found ${events.length} results based on filters`}
                        </th>
                        <th className="py-[--spacing]">
                            Description
                        </th>
                        <th className="py-[--spacing]">
                            Date
                        </th>
                        <th className="rounded-r-lg"></th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, key) => (
                        <tr 
                            className="border-b-[1px] border-b-light-secondary/80 last:border-b-0"
                            key={key}
                        >
                            <td className="py-4">
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
                            <td className="py-4 text-secondary w-[50%]">
                                <span className="line-clamp-2">
                                    {event.description}
                                </span>
                            </td>
                            <td className="py-4 text-secondary">
                                {getReadableDateFromTimestamp(event.timestamp)}
                            </td>
                            <td className="py-4">
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
        ) : (
            <span className="-mt-4 flex-1 flex items-center justify-center text-secondary/80">
                {loading ? (
                    'Loading events...'
                ) : (
                    hasFilters ? 'Found no results matching filters.' : 'Create an event to get started.'
                )}
            </span>
        )
    )
}