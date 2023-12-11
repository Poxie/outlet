import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import Button from "@/components/button";
import Input from "@/components/input";
import { useModal } from "@/contexts/modal";
import { usePopout } from "@/contexts/popout";
import { useEvents } from "@/hooks/useEvents";
import AddEventModal from "@/modals/events/AddEventModal";
import CategoryPopout from "@/popouts/categories";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCategoriesLength, selectCategoryById } from "@/store/slices/categories";
import Link from "next/link";
import { useRef } from "react";
import { EventCategory } from "../../../../types";
import { setCategoryId } from "@/store/slices/events";
import { CloseIcon } from "@/assets/icons/CloseIcon";

export default function EventPanel() {
    const { setModal } = useModal();
    const { setPopout } = usePopout();
    const { addEvent, setSearch, categoryId, hasFilters } = useEvents();

    const categoryPopoutButton = useRef<HTMLButtonElement>(null);
    const resetCategoryButton = useRef<HTMLButtonElement>(null);

    const dispatch = useAppDispatch();
    const categoryCount = useAppSelector(selectCategoriesLength);
    const sortByCategory = useAppSelector(state => selectCategoryById(state, categoryId || ''));

    const resetCategoryFilters = () => dispatch(setCategoryId(null));
    const openAddEventModal = () => setModal(
        <AddEventModal 
            onEventAdd={addEvent}
        />
    )
    const openCategoryPopout = (e: React.MouseEvent) => {
        if(resetCategoryButton.current && resetCategoryButton.current.contains(e.target as HTMLElement)) {
            return;
        }

        const onClick = (category: EventCategory) => {
            dispatch(setCategoryId(category.id));
        }
        setPopout({
            popout: <CategoryPopout onClick={onClick} />,
            ref: categoryPopoutButton,
            options: { position: 'right' },
        })
    }
    const resetFilters = () => {
        dispatch(setSearch(''));
        dispatch(setCategoryId(null));
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
                    {sortByCategory ? (
                        <span className="flex items-center gap-1">
                            Category:{' '}
                            {sortByCategory.name}
                            <button
                                className="p-0.5 -mr-0.5"
                                onClick={resetCategoryFilters}
                                aria-label="Remove category filters"
                                ref={resetCategoryButton}
                            >
                                <CloseIcon className="w-4" />
                            </button>
                        </span>
                    ) : (
                        'Sort by category...'
                    )}
                </button>
                {hasFilters && (
                    <button 
                        className="px-3 py-2 text-sm hover:bg-light-secondary/50 active:bg-light-secondary rounded-md transition-colors"
                        onClick={resetFilters}
                    >
                        Reset filters
                    </button>
                )}
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