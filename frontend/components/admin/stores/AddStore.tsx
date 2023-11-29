import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";

export default function AddStore() {
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="rounded-lg overflow-hidden bg-light">
                <AdminHeader 
                    backPath={'/admin/stores'}
                    text={'Add store'}
                />
                add store
            </div>
        </main>
    )
}