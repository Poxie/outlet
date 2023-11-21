import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import EventModalContent from "./EventModalContent";
import { useState } from "react";
import { Event } from "../../../types";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";

export default function EditEventModal({ onConfirm, event }: {
    onConfirm: (event: Event) => void;
    event: Event;
}) {
    const { patch } = useAuth();
    const { close: closeModal } = useModal();

    const [loading, setLoading] = useState(false);

    const editEvent = async (event: Event, changes: Partial<Event>) => {
        setLoading(true);

        const updatedEvent = await patch<Event>(`/events/${event.id}`, changes);
        onConfirm(updatedEvent);

        closeModal();
    }

    return(
        <Modal>
            <ModalHeader>
                Edit event
            </ModalHeader>
            <EventModalContent 
                onSubmit={editEvent}
                buttonText="Update event"
                buttonLoadingText="Updating event..."
                loading={loading}
                event={event}
            />
        </Modal>
    )
}