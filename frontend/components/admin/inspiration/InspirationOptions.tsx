import Link from "next/link";
import ConfirmModal from "@/modals/confirm";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import { UnarchiveIcon } from "@/assets/icons/UnarchiveIcon";
import { useAppDispatch } from "@/store";
import { editInspiration, removeInspiration } from "@/store/slices/inspiration";
import { BlogPost } from "../../../../types";

export default function InspirationOptions({ isArchived, postId }: {
    isArchived: boolean;
    postId: string;
}) {
    const { _delete, patch } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();

    const openRemoveModal = () => {
        const onConfirm = () => dispatch(removeInspiration(postId));
        const confirmFunction = async () => {
            _delete<{}>(`/inspiration/${postId}`);
        }
        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={'Are you sure you want to delete this post?'}
                subHeader='All information associated with this post will be deleted and unretrievable. This action cannot be undone.'
                closeOnCancel
            />
        )
    }
    const openArchiveModal = () => {
        const onConfirm = (event: BlogPost) => dispatch(editInspiration({ inspirationId: postId, changes: { archived: true } }));
        const confirmFunction = async () => {
            const data = await patch<BlogPost>(`/inspiration/${postId}`, { archived: true });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to archive this post?'}
                subHeader={`Archiving this post will leave it here in the post panel, but will be hidden from visitors to the site. Don't worry, this can be undone.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Archive post'}
                confirmLoadingText={'Archiving post...'}
                closeOnCancel
            />
        )
    }
    const openUnarchiveModal = () => {
        const onConfirm = (post: BlogPost) => dispatch(editInspiration({ inspirationId: postId, changes: { archived: false } }));
        const confirmFunction = async () => {
            const data = await patch<BlogPost>(`/inspiration/${postId}`, { archived: false });
            return data;
        }

        setModal(
            <ConfirmModal 
                header={'Are you sure you want to restore this post?'}
                subHeader={`Restoring this post will make it visible to users visiting the site again, as long as it\'s not scheduled.`}
                confirmFunction={confirmFunction}
                onConfirm={onConfirm}
                confirmText={'Restore post'}
                confirmLoadingText={'Restoring post...'}
                closeOnCancel
            />
        )
    }

    return(
        <div className="flex items-center">
            <Link
                className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                aria-label="Edit event"
                href={`/admin/inspiration/${postId}`}
            >
                <EditIcon className="w-4" />
            </Link>
            {!isArchived ? (
                <button 
                    className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                    onClick={openArchiveModal}
                    aria-label="Edit event"
                >
                    <ArchiveIcon className="w-4" />
                </button>
            ) : (
                <button 
                    className="p-2 rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                    onClick={openUnarchiveModal}
                    aria-label="Edit event"
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