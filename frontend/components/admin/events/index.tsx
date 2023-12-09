"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import EventCategoriesButton from "./EventCategoriesButton";
import { useEvents } from "@/hooks/useEvents";

export default function Events() {
    const { loading } = useEvents();
    return(
        <main className="my-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="relative flex flex-col rounded-lg overflow-hidden bg-light">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Events'}
                />
                {!loading ? (
                    <>
                    <EventCategoriesButton />
                    <EventPanel />
                    <EventsTable />
                    </>
                ) : (
                    <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                        Loading events...
                    </span>
                )}
            </div>
        </main>
    )
}