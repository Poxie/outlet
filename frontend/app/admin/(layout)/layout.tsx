"use client";
import { useAuth } from "@/contexts/auth";

export default function AdminLayout({ children }: {
    children: React.ReactNode;
}) {
    const { currentUser } = useAuth();

    if(!currentUser) return null;

    return children;
}