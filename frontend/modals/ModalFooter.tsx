import Button from "@/components/button";
import { useModal } from "@/contexts/modal";
import { useScreenSize } from "@/hooks/useScreenSize";
import { twMerge } from "tailwind-merge";

export default function ModalFooter({ cancelText='Cancel', confirmText, loading, closeOnCancel, onConfirm }: {
    cancelText?: string;
    confirmText?: string;
    loading?: boolean;
    closeOnCancel?: boolean;
    onConfirm: () => void;
}) {
    const { close } = useModal();

    const screenSize = useScreenSize();
    const isSmall = ['xs'].includes(screenSize);

    return(
        <div className="p-4 flex justify-end gap-2 bg-light-secondary/40">
            <Button 
                className={twMerge(
                    "bg-transparent text-secondary",
                    isSmall && 'flex-1 py-4'
                )}
                disabled={loading}
                onClick={() => {
                    if(!closeOnCancel) return;
                    close();
                }}
            >
                {cancelText}
            </Button>
            <Button
                onClick={onConfirm}
                disabled={loading}
                className={twMerge(
                    isSmall && 'flex-1 py-4',
                )}
            >
                {confirmText}
            </Button>
        </div>
    )
}