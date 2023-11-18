"use client";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useRef } from "react";
import EventsTable from "./EventsTable";

export default function Events() {
    const { post } = useAuth();

    const title = useRef<HTMLInputElement>(null);
    const description = useRef<HTMLInputElement>(null);
    const image = useRef<HTMLInputElement>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!image.current?.files?.length) throw new Error('Image is required.');

        const fileReader = new FileReader();
        fileReader.readAsDataURL(image.current?.files[0]);

        fileReader.onload = async () => {
            const event = await post(`/events`, {
                title: title.current?.value,
                description: description.current?.value,
                image: fileReader.result,
            });
            console.log(event);
        }

    }
    return(
        <main className="my-12 w-main max-w-main mx-auto rounded-lg overflow-hidden bg-light">
            <EventsTable />

            <form 
                className="flex p-4"
                onSubmit={onSubmit}
            >
                <input type="file" ref={image} />
                <input placeholder="event title" ref={title} />
                <input placeholder="event description" ref={description} />
                <Button>
                    Create event
                </Button>
            </form>
        </main>
    )
}