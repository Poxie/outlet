import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { useEvents } from "@/hooks/useEvents";
import ConfirmModal from "@/modals/confirm";
import EditEventModal from "@/modals/events/EditEventModal";
import { Event } from "../../../../types";

export default function EventTableOptions({ onRemoveClick, onArchiveClick, isArchived, eventId }: {
    onRemoveClick: () => void;
    onArchiveClick: () => void;
    isArchived: boolean;
    eventId: string;
}) {
    const { _delete } = useAuth();
    const { setModal } = useModal();
    const { removeEvent, editEvent } = useEvents();

    const openRemoveModal = () => {
        const onConfirm = () => removeEvent(eventId, false);
        const confirmFunction = async () => {
            _delete<{}>(`/events/${eventId}`);
        }
        setModal(
            <ConfirmModal 
                confirmFunction={confirmFunction}
                header={'Are you sure you want to delete this event?'}
                subHeader='All information associated with this event will be deleted and unretrievable. This action cannot be undone.'
                onConfirm={onConfirm}
            />
        )
    }
    const openEditModal = () => {
        const onConfirm = (event: Event) => editEvent(eventId, event);
        setModal(
            <EditEventModal 
                eventId={eventId}
                onConfirm={onConfirm}
            />
        )
    }

    return(
        <div className="flex">
            {!isArchived && (
                <button 
                    className="p-2 flex items-center justify-center text-primary aspect-square rounded-full"
                    onClick={onArchiveClick}
                    aria-label="Edit event"
                >
                    <ArchiveIcon className="w-4" />
                </button>
            )}
            <button 
                className="p-2 flex items-center justify-center text-primary aspect-square rounded-full"
                onClick={openEditModal}
                aria-label="Edit event"
            >
                <EditIcon className="w-4" />
            </button>
            <button 
                className="p-2 flex items-center justify-center text-c-primary aspect-square rounded-full"
                onClick={openRemoveModal}
            >
                <BinIcon className="w-5" />
            </button>
        </div>
    )
}