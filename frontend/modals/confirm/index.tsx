import Button from "@/components/button";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { useState } from "react";
import { useModal } from "@/contexts/modal";

export default function ConfirmModal<T>({ header, subHeader, cancelText='Cancel', confirmText='Confirm', confirmLoadingText='Confirming...', confirmFunction, onConfirm, closeOnCancel=false }: {
    header: string;
    subHeader?: string;
    cancelText?: string;
    confirmText?: string;
    confirmLoadingText?: string;
    confirmFunction: () => Promise<T>;
    onConfirm: (data: T) => void;
    closeOnCancel?: boolean;
}) {
    const { close } = useModal();

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        const data = await confirmFunction();
        onConfirm(data);
        close();
    }

    return(
        <Modal>
            <ModalHeader 
                subHeader={subHeader}
                className="text-lg font-semibold"
            >
                {header}
            </ModalHeader>
            <div className="p-4 flex justify-end gap-2 bg-light-secondary/40">
                <Button 
                    className="bg-transparent text-secondary"
                    disabled={loading}
                    onClick={() => {
                        if(!closeOnCancel) return;
                        close();
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {!loading ? confirmText : confirmLoadingText}
                </Button>
            </div>
        </Modal>
    )
}