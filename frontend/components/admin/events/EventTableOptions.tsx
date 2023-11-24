import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { useEvents } from "@/hooks/useEvents";
import ConfirmModal from "@/modals/confirm";

export default function EventTableOptions({ onRemoveClick, onEditClick, onArchiveClick, isArchived, eventId }: {
    onRemoveClick: () => void;
    onEditClick: () => void;
    onArchiveClick: () => void;
    isArchived: boolean;
    eventId: string;
}) {
    const { _delete } = useAuth();
    const { setModal } = useModal();
    const { removeEvent } = useEvents();

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
                onClick={onEditClick}
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