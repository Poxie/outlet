import Link from "next/link";
import ConfirmModal from "@/modals/confirm";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { UnarchiveIcon } from "@/assets/icons/UnarchiveIcon";
import { useAppDispatch } from "@/store";
import { updateCategory, removeCategory } from "@/store/slices/categories";
import { EventCategory } from "../../../../../types";

export default function CategoryOptions({ isArchived, categoryId }: {
    isArchived: boolean;
    categoryId: string;
}) {
    const { _delete, patch } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();

    const openRemoveModal = () => {
        const onConfirm = () => dispatch(removeCategory(categoryId));
        const confirmFunction = async () => {
            _delete<{}>(`/categories/${categoryId}`);
        }
        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={'Are you sure you want to delete this category?'}
                subHeader='Events associated with this category will not be deleted.'
                closeOnCancel
            />
        )
    }
    const openArchiveModal = () => {
        const onConfirm = (category: EventCategory) => dispatch(updateCategory({ categoryId: categoryId, changes: { archived: true } }));
        const confirmFunction = async () => {
            const data = await patch<EventCategory>(`/categories/${categoryId}`, { archived: true });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to archive this category?'}
                subHeader={`Archiving this category will also archive the events associated with the category.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Archive category'}
                confirmLoadingText={'Archiving category...'}
                closeOnCancel
            />
        )
    }
    const openUnarchiveModal = () => {
        const onConfirm = (category: EventCategory) => dispatch(updateCategory({ categoryId: categoryId, changes: { archived: false } }));
        const confirmFunction = async () => {
            const data = await patch<EventCategory>(`/categories/${categoryId}`, { archived: false });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to restore this category?'}
                subHeader={`Restoring this category will make all events associated with it visible.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Restore category'}
                confirmLoadingText={'Restoring category...'}
                closeOnCancel
            />
        )
    }

    return(
        <div className="flex items-center">
            <Link
                className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                aria-label="Edit category"
                href={`/admin/events/categories/${categoryId}`}
            >
                <EditIcon className="w-4" />
            </Link>
            {!isArchived ? (
                <button 
                    className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                    onClick={openArchiveModal}
                    aria-label="Edit category"
                >
                    <ArchiveIcon className="w-4" />
                </button>
            ) : (
                <button 
                    className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                    onClick={openUnarchiveModal}
                    aria-label="Edit category"
                >
                    <UnarchiveIcon className="w-4" />
                </button>
            )}
            <button 
                className="p-2 text-c-primary rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                onClick={openRemoveModal}
            >
                <BinIcon className="w-5" />
            </button>
        </div>
    )
}