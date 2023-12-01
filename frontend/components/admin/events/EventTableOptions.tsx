import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { useEvents } from "@/hooks/useEvents";
import ConfirmModal from "@/modals/confirm";
import { Event } from "../../../../types";
import Link from "next/link";
import { UnarchiveIcon } from "@/assets/icons/UnarchiveIcon";

export default function EventTableOptions({ isArchived, eventId }: {
    isArchived: boolean;
    eventId: string;
}) {
    const { _delete, patch } = useAuth();
    const { setModal } = useModal();
    const { removeEvent, editEvent, archiveEvent, unarchiveEvent } = useEvents();

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
                closeOnCancel
            />
        )
    }
    const openArchiveModal = () => {
        const onConfirm = (event: Event) => archiveEvent(event.id);
        const confirmFunction = async () => {
            const data = await patch<Event>(`/events/${eventId}`, { archived: true });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to archive this event?'}
                subHeader={`Archiving this event will leave it here in the event panel, but will be hidden from visitors to the site. Don't worry, this can be undone.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Archive event'}
                confirmLoadingText={'Archiving event...'}
                closeOnCancel
            />
        )
    }
    const openUnarchiveModal = () => {
        const onConfirm = (event: Event) => unarchiveEvent(event.id);
        const confirmFunction = async () => {
            const data = await patch<Event>(`/events/${eventId}`, { archived: false });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to restore this event?'}
                subHeader={`Restoring this event will make it visible to users visiting the site again, as long as it\'s not scheduled.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Restore event'}
                confirmLoadingText={'Restoring event...'}
                closeOnCancel
            />
        )
    }

    return(
        <div className="flex">
            <Link
                className="p-2 flex items-center justify-center text-primary aspect-square rounded-full"
                aria-label="Edit event"
                href={`/admin/events/${eventId}`}
            >
                <EditIcon className="w-4" />
            </Link>
            {!isArchived ? (
                <button 
                    className="p-2 flex items-center justify-center text-primary aspect-square rounded-full"
                    onClick={openArchiveModal}
                    aria-label="Edit event"
                >
                    <ArchiveIcon className="w-4" />
                </button>
            ) : (
                <button 
                    className="p-2 flex items-center justify-center text-primary aspect-square rounded-full"
                    onClick={openUnarchiveModal}
                    aria-label="Edit event"
                >
                    <UnarchiveIcon className="w-4" />
                </button>
            )}
            <button 
                className="p-2 flex items-center justify-center text-c-primary aspect-square rounded-full"
                onClick={openRemoveModal}
            >
                <BinIcon className="w-5" />
            </button>
        </div>
    )
}