"use client";
import Link from "next/link";
import { adminLinks, dashboardLinks } from ".";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import LogoutButton from "./LogoutButton";

export default function AdminTabs() {
    const pathname = usePathname();

    const links = dashboardLinks.concat(adminLinks);
    return(
        <div className="mb-2 flex gap-2 items-start justify-between">
            <ul className="flex-1 grid grid-cols-2 gap-1 sm:grid-cols-3 md:flex md:gap-2 flex-wrap">
                {links.map(link => {
                    const active = pathname.startsWith(link.path);
                    return(
                        <li key={link.path}>
                            <Link 
                                className={twMerge(
                                    "p-3 flex gap-2 bg-light rounded-md text-sm active:bg-light-tertiary transition-colors",
                                    !active && 'hover:bg-light-secondary ',
                                    active && 'bg-light-tertiary',
                                )}
                                href={link.path}
                            >
                                {link.icon}
                                {link.text}
                            </Link>
                        </li>
                    )
                })}
            </ul>
            <LogoutButton 
                className="fixed bottom-4 right-4 z-10 shadow-lg md:relative md:bottom-[unset] md:right-[unset]" 
                iconClassName="min-w-[1.6rem] text-c-primary md:min-w-[unset] md:text-secondary"
                textClassName="hidden md:block"
            />
        </div>
    )
}