"use client";
import StoreProvider from "@/store/StoreProvider";
import AuthProvider from "./auth";
import { PopoutProvider } from "./popout";
import { ModalProvider } from "./modal";

export default function Providers({ children }: {
    children: React.ReactNode;
}) {
    return(
        <StoreProvider>
            <AuthProvider>
                <PopoutProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </PopoutProvider>
            </AuthProvider>
        </StoreProvider>
    )
}