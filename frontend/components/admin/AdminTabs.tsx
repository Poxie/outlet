"use client";
import Link from "next/link";
import { dashboardLinks } from ".";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function AdminTabs() {
    const pathname = usePathname();
    return(
        <div className="mb-2 flex items-center justify-between">
            <ul className="flex gap-2">
                {dashboardLinks.map(link => {
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
        </div>
    )
}