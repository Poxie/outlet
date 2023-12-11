import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import Button from "@/components/button";
import Input from "@/components/input";
import { useModal } from "@/contexts/modal";
import { usePopout } from "@/contexts/popout";
import { useEvents } from "@/hooks/useEvents";
import AddEventModal from "@/modals/events/AddEventModal";
import CategoryPopout from "@/popouts/categories";
import { useAppSelector } from "@/store";
import { selectCategoriesLength } from "@/store/slices/categories";
import Link from "next/link";
import { useRef } from "react";

export default function EventPanel() {
    const { setModal } = useModal();
    const { setPopout } = usePopout();
    const { addEvent, setSearch } = useEvents();

    const categoryPopoutButton = useRef<HTMLButtonElement>(null);

    const categoryCount = useAppSelector(selectCategoriesLength);

    const openAddEventModal = () => setModal(
        <AddEventModal 
            onEventAdd={addEvent}
        />
    )
    const openCategoryPopout = () => {
        setPopout({
            popout: <CategoryPopout onClick={console.log} />,
            ref: categoryPopoutButton,
            options: { position: 'right' },
        })
    }

    return(
        <div className="p-4 flex items-center justify-between rounded-lg bg-light shadow-centered mb-[2px]">
            <div className="flex gap-2">
                <Input 
                    className="px-2 py-2 w-[300px] max-w-full"
                    placeholder={'Search'}
                    onChange={setSearch}
                />
                <button 
                    className="px-2 text-secondary text-sm border-[1px] bg-light-secondary hover:bg-light-tertiary/80 transition-colors border-light-tertiary rounded-md"
                    onClick={openCategoryPopout}
                    ref={categoryPopoutButton}
                >
                    Sort by category...
                </button>
            </div>
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