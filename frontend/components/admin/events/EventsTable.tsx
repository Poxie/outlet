import React from "react";
import { getEventImage, getReadableDateFromTimestamp, getWeeklyDealImage } from "@/utils";
import Image from "next/image";
import EventTableOptions from "./EventTableOptions";
import { useEvents } from ".";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import Button from "@/components/button";
import EventTableSection from "./EventTableSection";

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
                    <tbody>
                        <EventTableSection 
                            header={
                                <div className="flex gap-2">
                                    <MegaphoneIcon className="w-4" />
                                    On-going events
                                </div>
                            }
                            events={onGoingEvents}
                        />
                        <EventTableSection 
                            header={
                                <div className="flex gap-2">
                                    <ClockIcon className="w-4" />
                                    Scheduled events
                                </div>
                            }
                            events={scheduledEvents}
                        />
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