"use client";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useRef } from "react";
import EventsTable from "./EventsTable";
import { useModal } from "@/contexts/modal";
import AddEventModal from "@/modals/add-event";

export default function Events() {
    const { post } = useAuth();
    const { setModal } = useModal();

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

    const openAddEventModal = () => setModal(
        <AddEventModal />
    )

    return(
        <main className="relative my-12 max-h-[750px] w-main max-w-main mx-auto rounded-lg overflow-auto bg-light">
            <EventsTable />

            <div className="p-2 w-full sticky bottom-0 bg-light">
                <div className="p-4 flex justify-end bg-light-secondary rounded-lg">
                    <Button onClick={openAddEventModal}>
                        Create event
                    </Button>
                </div>
            </div>
        </main>
    )
}