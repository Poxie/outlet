import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { useAppSelector } from "@/store";
import { selectCategoriesLength } from "@/store/slices/categories";
import Link from "next/link";

export default function EventCategoriesButton() {
    const count = useAppSelector(selectCategoriesLength);
    return(
        <Link 
            href={'/admin/events/categories'}
            className="mb-4 flex justify-between p-4 text-sm transition-colors duration-200 hover:bg-light-secondary/60 border-b-[1px] border-b-light-secondary"
        >
            <span className="font-semibold">
                {count} categories
            </span>
            <span className="flex gap-2 text-secondary">
                View categories
                <ArrowIcon className="w-4 rotate-90" />
            </span>
        </Link>
    )
}