import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";

export default function EventTableOptions({ onRemoveClick }: {
    onRemoveClick: () => void;
}) {
    return(
        <div className="flex">
            <button className="p-2 flex items-center justify-center text-primary aspect-square rounded-full">
                <EditIcon className="w-4" />
            </button>
            <button 
                className="p-2 flex items-center justify-center text-c-primary aspect-square rounded-full"
                onClick={onRemoveClick}
            >
                <BinIcon className="w-5" />
            </button>
        </div>
    )
}