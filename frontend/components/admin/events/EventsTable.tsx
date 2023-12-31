import React from "react";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import EventTableSection from "./EventTableSection";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { useEvents } from "@/hooks/useEvents";

export default function EventsTable() {
    const { events } = useEvents();

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
    )
}