"use client";
import localFont from 'next/font/local';
import StoreProvider from "@/store/StoreProvider";
import AuthProvider from "./auth";
import { PopoutProvider } from "./popout";
import { ModalProvider } from "./modal";
import { Roboto } from 'next/font/google'
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";
    
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'] });
const font = localFont({
    src: [
        {
            path: '../public/fonts/HKGrotesk-Regular.otf',
            weight: '400',
        },
        {
            path: '../public/fonts/HKGrotesk-Medium.otf',
            weight: '500',
        },
        {
            path: '../public/fonts/HKGrotesk-SemiBold.otf',
            weight: '600',
        },
        {
            path: '../public/fonts/HKGrotesk-Bold.otf',
            weight: '700',
        },
    ],
    variable: '--font-HKGrotesk',
})

const LIGHT_PATHS = ['/inspiration'];
export default function Providers({ children }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLightPath = LIGHT_PATHS.find(path => pathname.startsWith(path));

    return(
        <body className={twMerge(
            font.variable,
            'font-sans',
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