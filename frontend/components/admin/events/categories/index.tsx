"use client";
import Button from "@/components/button";
import AdminHeader from "../../AdminHeader";
import AdminTabs from "../../AdminTabs";
import CategoryTable from "./CategoryTable";
import { useAppSelector } from "@/store";
import { selectCategoriesLoading } from "@/store/slices/categories";

export default function EventCategories() {
    const loading = useAppSelector(selectCategoriesLoading);

    return(
        <div className="bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                backPath={'/admin/events'}
                text={'Events / Categories'}
                options={
                    <Button 
                        className="py-2.5 px-3 mr-1.5"
                        href={'/admin/events/categories/create'}
                    >
                        Create category
                    </Button>
                }
            />
            {!loading ? (
                <CategoryTable />
            ) : (
                <span className="block py-24 text-center">
                    Loading categories...
                </span>
            )}
        </div>
    )
}