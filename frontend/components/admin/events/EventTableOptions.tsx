import { BinIcon } from "@/assets/icons/BinIcon";
import { EditIcon } from "@/assets/icons/EditIcon";

export default function EventTableOptions() {
    return(
        <div className="flex">
            <button className="p-2 flex items-center justify-center text-primary aspect-square rounded-full">
                <EditIcon className="w-4" />
            </button>
            <button className="p-2 flex items-center justify-center text-c-primary aspect-square rounded-full">
                <BinIcon className="w-5" />
            </button>
        </div>
    )
}