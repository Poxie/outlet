import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import Button from "@/components/button";
import Input from "@/components/input";
import { useModal } from "@/contexts/modal";
import { useEvents } from "@/hooks/useEvents";
import AddEventModal from "@/modals/events/AddEventModal";
import { useAppSelector } from "@/store";
import { selectCategoriesLength } from "@/store/slices/categories";
import Link from "next/link";

export default function EventPanel() {
    const { setModal } = useModal();
    const { addEvent, setSearch } = useEvents();

    const categoryCount = useAppSelector(selectCategoriesLength);

    const openAddEventModal = () => setModal(
        <AddEventModal 
            onEventAdd={addEvent}
        />
    )

    return(
        <div className="p-4 flex items-center justify-between rounded-lg bg-light shadow-centered mb-[2px]">
            <Input 
                className="px-2 py-2 w-[300px] max-w-full"
                placeholder={'Search'}
                onChange={setSearch}
            />
            <Link 
                className="px-3 py-2 flex items-center gap-2 text-secondary hover:bg-light-secondary/50 active:bg-light-secondary transition-colors rounded-md"
                href={`/admin/events/categories`}
            >
                {categoryCount} categories
                <ArrowIcon className="w-4 rotate-90" />
            </Link>
        </div>
    )
}