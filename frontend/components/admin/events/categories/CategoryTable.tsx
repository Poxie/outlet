"use client";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import CategorySection from "./CategorySection";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import { useAppSelector } from "@/store";
import { selectCategories } from "@/store/slices/categories";

export default function CategoryTable() {
    const categories = useAppSelector(selectCategories);

    const search = '';

    const activeCategories = categories.filter(category => !category.archived);
    const archivedCategories = categories.filter(category => category.archived);

    return(
        <table className="[--spacing:.75rem] w-full text-sm border-spacing-2">
            <tbody>
                <CategorySection 
                    header={'Active categories'}
                    headerIcon={<MegaphoneIcon className="w-4" />}
                    categories={activeCategories}
                    search={search}
                />
                <CategorySection
                    header={'Archived categories'}
                    headerIcon={<ArchiveIcon className="w-4" />}
                    categories={archivedCategories}
                    search={search}
                />
            </tbody>
        </table>
    )
}