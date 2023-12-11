import { useAppSelector } from "@/store"
import { selectCategories, selectCategoriesLength } from "@/store/slices/categories"
import { EventCategory } from "../../../types";
import { AddIcon } from "@/assets/icons/AddIcon";
import Link from "next/link";
import { usePopout } from "@/contexts/popout";

export default function CategoryPopout({ onClick, closeOnSelect=true }: {
    onClick: (category: EventCategory) => void;
    closeOnSelect?: boolean;
}) {
    const { close } = usePopout();

    const categories = useAppSelector(selectCategories);
    const count = useAppSelector(selectCategoriesLength);

    return(
        <div>
            <div className="p-3 border-b-[1px] border-b-light-tertiary flex items-center justify-between">
                <span>
                    {count} categories
                </span>
                <Link 
                    onClick={close}
                    className="p-1 hover:bg-light-secondary active:bg-light-tertiary/80 transition-colors rounded-md"
                    href={'/admin/events/categories/create'}
                    aria-label="Create category"
                >
                    <AddIcon className="w-5" />
                </Link>
            </div>
            <ul className="p-2">
                {categories.map(category => (
                    <li key={category.id}>
                        <button
                            className="p-2 w-full text-left hover:bg-light-secondary/50 active:bg-light-secondary transition-colors rounded-md"
                            onClick={() => {
                                onClick(category)
                                if(closeOnSelect) close();
                            }}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}