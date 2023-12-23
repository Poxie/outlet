"use client";
import AdminTabs from "@/components/admin/AdminTabs";
import { useAuth } from "@/contexts/auth";
import { usePathname } from "next/navigation";

const DASHBOARD_PATH = '/admin';
export default function AdminLayout({ children }: {
    children: React.ReactNode;
}) {
    const { currentUser } = useAuth();
    const pathname = usePathname();

    if(!currentUser) {
        return(
            <span className="font-medium text-lg text-light absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4">
                Authenticating...
            </span>
        )
    };

    const isDasboardPath = pathname === DASHBOARD_PATH;
    return(
        <div className="py-8 w-main max-w-main mx-auto">
            {!isDasboardPath && (
                <AdminTabs />
            )}
            {children}
        </div>
    );
}