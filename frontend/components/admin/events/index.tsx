"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import EventCategoriesButton from "./EventCategoriesButton";

export default function Events() {
    return(
        <main className="my-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="relative flex flex-col rounded-lg overflow-hidden bg-light">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Events'}
                />
                <EventCategoriesButton />
                <EventPanel />
                <EventsTable />
            </div>
        </main>
    )
}