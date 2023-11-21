import React from "react";
import { getEventImage, getReadableDateFromTimestamp, getWeeklyDealImage } from "@/utils";
import Image from "next/image";
import EventTableOptions from "./EventTableOptions";
import { useEvents } from ".";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import Button from "@/components/button";

export default function EventsTable() {
    const { events, removeEvent, editEvent, search, loading } = useEvents();

    const onGoingEvents = events.filter(event => (
        Number(event.timestamp) <= new Date().getTime()
    ))
    const scheduledEvents = events.filter(event => (
        Number(event.timestamp) > new Date().getTime()
    ))

    const hasFilters = !!search;
    return(
        events.length ? (
            <div>
                <table className="[--spacing:.75rem] w-full text-sm border-spacing-2">
                    <thead>
                        <tr className="sticky -top-[1px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light">
                            <th className="px-4 py-[--spacing] rounded-l-lg">
                                {!search ? (
                                    <div className="flex gap-2">
                                        <MegaphoneIcon className="w-4" />
                                        On-going events
                                    </div>
                                ) : `Found ${events.length} results based on filters`}
                            </th>
                            <th className="px-4 py-[--spacing]">
                                Description
                            </th>
                            <th className="px-4 py-[--spacing]">
                                Date
                            </th>
                            <th className="rounded-r-lg"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {onGoingEvents.map((event, key) => (
                            <tr 
                                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0"
                                key={key}
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
                                    <div className="flex justify-end">
                                        <EventTableOptions 
                                            onRemoveClick={() => removeEvent(event.id)}
                                            onEditClick={() => editEvent(event.id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr className="sticky -top-[1px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light">
                            <td className="px-4 py-[--spacing] font-bold">
                                {!search ? (
                                    <div className="flex gap-2">
                                        <ClockIcon className="w-4 -mt-0.5" />
                                        Scheduled events
                                    </div>
                                ) : `Found ${events.length} results based on filters`}
                            </td>
                            <td className="px-4 py-[--spacing] font-bold">
                                Description
                            </td>
                            <td className="px-4 py-[--spacing] font-bold">
                                Date
                            </td>
                            <td ></td>
                        </tr>
                        {scheduledEvents.map((event, key) => (
                            <tr 
                                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0"
                                key={key}
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
                                        <Button className="px-2 py-1.5">
                                            Start early
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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