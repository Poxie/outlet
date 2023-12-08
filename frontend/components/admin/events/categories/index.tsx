import Button from "@/components/button";
import AdminHeader from "../../AdminHeader";
import AdminTabs from "../../AdminTabs";

export default function EventCategories() {
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
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
            </div>
        </main>
    )
}