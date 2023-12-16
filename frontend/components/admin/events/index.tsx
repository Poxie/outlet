"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useEvents } from "@/hooks/useEvents";
import Button from "@/components/button";

export default function Events() {
    const { loading } = useEvents();
    return(
        <div className="w-main max-w-full relative flex flex-col rounded-lg overflow-hidden bg-light">
            <AdminHeader 
                backPath={'/admin'}
                text={'Events'}
                options={
                    <Button 
                        className="py-2.5 px-3 mr-1.5"
                        href={'/admin/events/create'}
                    >
                        Create event
                    </Button>
                }
            />
            {!loading ? (
                <>
                <EventPanel />
                <EventsTable />
                </>
            ) : (
                <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                    Loading events...
                </span>
            )}
        </div>
    )
}