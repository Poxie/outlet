"use client";
import EventsTable from "./EventsTable";
import EventPanel from "./EventPanel";
import { useEffect } from "react";
import { setEvents } from "@/store/slices/events";
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import AdminHeader from "../AdminHeader";

export default function Events() {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const eventLength = useAppSelector(state => state.events.events.length);

    useEffect(() => {
        if(eventLength) return;
        get(`/events/all`).then(events => dispatch(setEvents(events)));
    }, [eventLength]);

    return(
        <main className="relative my-12 flex flex-col max-h-[750px] min-h-[500px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <AdminHeader 
                backPath={'/admin'}
                text={'Events'}
            />
            <EventPanel />
            <EventsTable />
        </main>
    )
}