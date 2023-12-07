"use client";
import StoreProvider from "@/store/StoreProvider";
import AuthProvider from "./auth";
import { PopoutProvider } from "./popout";
import { ModalProvider } from "./modal";
import { Roboto } from 'next/font/google'
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });

const LIGHT_PATHS = ['/inspiration'];
export default function Providers({ children }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLightPath = LIGHT_PATHS.find(path => pathname.startsWith(path));

    return(
        <body className={twMerge(
            roboto.className,
            isLightPath ? 'bg-light' : 'bg-secondary',
        )}>
            <StoreProvider>
                <AuthProvider>
                    <PopoutProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </PopoutProvider>
                </AuthProvider>
            </StoreProvider>
        </body>
    )
}