import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { Event } from "../../../types";
import EventModalContent from "./EventModalContent";

export default function AddEventModal({ onEventAdd }: {
    onEventAdd?: (event: Event) => void;
}) {
    const { post } = useAuth();
    const { close: closeModal } = useModal();

    const [loading, setLoading] = useState(false);
    
    const createEvent = async (event: Event) => {
        if(loading) return;
        setLoading(true);

        const { title, description, image, timestamp } = event;
        const createdEvent = await post<Event>(`/events`, {
            title,
            description,
            image,
            timestamp,
        });

        closeModal();
        if(onEventAdd) onEventAdd(createdEvent);
    }

    return(
        <Modal>
            <ModalHeader>
                Create an event
            </ModalHeader>
            <EventModalContent
            loading={loading} 
                buttonText="Create event"
                buttonLoadingText="Creating event..."
                onSubmit={createEvent}
            />
        </Modal>
    )
}