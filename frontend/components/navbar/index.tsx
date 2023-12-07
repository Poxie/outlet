"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

const links = [
    { path: '/', text: 'Startsida' },
    { path: '/vara-varuhus', text: 'Våra varuhus' },
    { path: '/inspiration', text: 'Inspiration' },
]
export default function Navbar() {
    const currentPath = usePathname();

    return(
        <nav className="relative py-6 bg-secondary shadow-navbar">
            <div className="w-main max-w-main mx-auto flex items-center justify-between">
                <Link href="/">
                    <Image 
                        className="w-48"
                        alt="Outlet logo"
                        src="/logo.png"
                        width={250}
                        height={50} 
                    />
                </Link>
                <ul className="flex gap-6">
                    {links.map(link => (
                        <li key={link.path}>
                            <Link
                                href={link.path}
                                className={twMerge(
                                    "text-light text-sm"
                                )}
                            >
                                {link.text}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}