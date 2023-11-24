"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import { useEffect } from "react";
import { setEvents } from "@/store/slices/events";
import { useAuth } from "@/contexts/auth";
import { useAppDispatch } from "@/store";

export default function Events() {
    const { get } = useAuth();

    const dispatch = useAppDispatch();

    useEffect(() => {
        get(`/events/all`).then(events => dispatch(setEvents(events)));
    }, []);

    return(
        <main className="relative my-12 flex flex-col max-h-[750px] min-h-[500px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <EventPanel />
            <EventsTable />
        </main>
    )
}