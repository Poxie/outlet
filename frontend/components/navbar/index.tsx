"use client";
import { HamIcon } from "@/assets/icons/HamIcon";
import { useScreenSize } from "@/hooks/useScreenSize";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export const links = [
    { path: '/', text: 'Startsida' },
    { path: '/veckans-deal', text: 'Veckans deal'},
    { path: '/vara-varuhus', text: 'Våra varuhus' },
    { path: '/inspiration', text: 'Inspiration' },
]
export default function Navbar() {
    const screenSize = useScreenSize();
    const [open, setOpen] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isSmall = ['xs', 'sm'].includes(screenSize);
    useEffect(() => {
        close();

        if(!isSmall) return;
        const handleClickOutside = (e: Event) => {
            // @ts-ignore: this works
            if(buttonRef.current && buttonRef.current.contains(e.target)) {
                return;
            }
            // @ts-ignore: this works
            if(listRef.current && !listRef.current.contains(e.target)) {
                close()
            }
        }

        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside)
    }, [isSmall]);

    const close = () => setOpen(false);

    return(
        <nav className="relative py-6 bg-secondary shadow-navbar">
            <div className="w-main max-w-main mx-auto flex items-center justify-between">
                <Link href="/">
                    <Image 
                        className="w-[11.5rem] sm:w-48"
                        alt="Outlet logo"
                        src="/logo.png"
                        width={250}
                        height={50} 
                    />
                </Link>
                <button 
                    className={twMerge(
                        "p-1.5 -m-1.5 text-light hover:bg-primary transition-colors rounded-md",
                        "block md:hidden"
                    )}
                    onClick={() => setOpen(!open)}
                    ref={buttonRef}
                    aria-label={open ? 'Stäng navigeringsmenyn' : 'Öppna navigeringsmenyn'}
                >
                    <HamIcon className="w-7" strokeWidth={3} />
                </button>
                <div className={twMerge(
                    "grid grid-rows-[0fr] absolute top-full left-0 w-full z-20 overflow-hidden transition-[grid-template-rows,box-shadow] duration-500",
                    "md:flex md:relative md:top-[unset] md:left-[unset] md:w-[unset] md:overflow-[unset]",
                    open && 'grid-rows-[1fr] shadow-lg',
                )}>
                    <ul 
                        className={twMerge(
                            "min-h-0 grid gap-6 place-items-center bg-primary transition-[padding] duration-500",
                            'md:flex md:gap-4 md:bg-transparent md:place-items-[unset]',
                            open && 'p-6'
                        )}
                        ref={listRef}
                    >
                        {links.map(link => (
                            <li key={link.path}>
                                <Link
                                    href={link.path}
                                    onClick={close}
                                    className={twMerge(
                                        "text-light text-lg md:text-sm font-semibold",
                                    )}
                                >
                                    {link.text}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}