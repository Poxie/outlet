import React from "react";
import { useEvents } from ".";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import EventTableSection from "./EventTableSection";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";

export default function EventsTable() {
    const { events, loading } = useEvents();

    const onGoingEvents = events.filter(event => (
        !event.archived &&
        Number(event.timestamp) <= new Date().getTime()
    ))
    const scheduledEvents = events.filter(event => (
        !event.archived &&
        Number(event.timestamp) > new Date().getTime()
    ))
    const archivedEvents = events.filter(event => event.archived);

    return(
        !loading ? (
            <div>
                <table className="[--spacing:.75rem] w-full text-sm border-spacing-2">
                    <tbody>
                        <EventTableSection 
                            header={'On-going events'}
                            headerIcon={<MegaphoneIcon className="w-4" />}
                            events={onGoingEvents}
                        />
                        <EventTableSection
                            header={'Scheduled events'}
                            headerIcon={<ClockIcon className="w-4" />}
                            events={scheduledEvents}
                        />
                        <EventTableSection
                            header={'Archived events'}
                            headerIcon={<ArchiveIcon className="w-4" />}
                            events={archivedEvents}
                        />
                    </tbody>
                </table>
            </div>
        ) : (
            <span className="-mt-4 flex-1 flex items-center justify-center text-secondary/80">
                Loading events...
            </span>
        )
    )
}