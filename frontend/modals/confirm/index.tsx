import Button from "@/components/button";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import { useState } from "react";
import { useModal } from "@/contexts/modal";
import ModalFooter from "../ModalFooter";

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

    const handleConfirm = () => {
        setLoading(true);
        confirmFunction().then(data => {
            onConfirm(data);
            close();
        })
    }

    return(
        <Modal>
            <ModalHeader 
                subHeader={subHeader}
                className="text-lg font-semibold"
            >
                {header}
            </ModalHeader>
            <ModalFooter 
                confirmText={!loading ? confirmText : confirmLoadingText}
                onConfirm={handleConfirm}
                loading={loading}
                closeOnCancel
            />
        </Modal>
    )
}