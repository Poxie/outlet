"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";

export default function Events() {
    return(
        <main className="my-12 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="relative flex flex-col max-h-[750px] min-h-[500px] rounded-lg overflow-auto bg-light">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Events'}
                />
                <EventPanel />
                <EventsTable />
            </div>
        </main>
    )
}