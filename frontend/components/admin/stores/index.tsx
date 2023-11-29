import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Link from "next/link";

export default function Stores() {
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Stores'}
                    options={
                        <Button 
                            className="py-2.5 px-3 mr-1.5"
                            href={'/admin/stores/add'}
                        >
                            Add store
                        </Button>
                    }
                />
                {/* Add stores list */}
                <div className="m-4">
                    <Link 
                        className="py-4 block text-center w-full border-[1px] border-light-tertiary rounded-md hover:bg-light-secondary transition-colors"
                        href={'/admin/stores/add'}
                    >
                        Add store
                    </Link>
                </div>
            </div>
        </main>
    )
}