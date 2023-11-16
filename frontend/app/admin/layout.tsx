import AuthProvider from "@/contexts/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return(
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}