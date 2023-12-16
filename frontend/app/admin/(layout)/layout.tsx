"use client";
import { useAuth } from "@/contexts/auth";

export default function AdminLayout({ children }: {
    children: React.ReactNode;
}) {
    const { currentUser } = useAuth();

    if(!currentUser) {
        return(
            <span className="font-medium text-lg text-light absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4">
                Authenticating...
            </span>
        )
    };

    return children;
}