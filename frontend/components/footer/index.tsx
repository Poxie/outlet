"use client";
import Link from "next/link";
import { links } from "../navbar";
import { InstagramIcon } from "@/assets/icons/InstagramIcon";
import { FacebookIcon } from "@/assets/icons/FacebookIcon";
import { usePathname } from "next/navigation";

const socials = [
    { text: 'Facebook', icon: <FacebookIcon className="w-5" />, href: 'https://www.facebook.com/ahlensoutlet/' },
    { text: 'Instagram', icon: <InstagramIcon className="w-5" />, href: 'https://www.instagram.com/ahlens_outlet/' },
]
export default function Footer() {
    const pathname = usePathname();
    if(pathname.startsWith('/admin')) return null;

    return(
        <footer className="py-8 bg-primary shadow-footer">
            <ul className="flex gap-6 justify-center mb-5">
                {socials.map(social => (
                    <li key={social.text}>
                        <a  
                            target="_blank"
                            className="p-3 block bg-light hover:bg-light-secondary active:bg-light-tertiary transition-colors rounded-full text-c-primary"
                            referrerPolicy="no-referrer"
                            aria-label={`Vår ${social.text}`}
                            href={social.href}
                        >
                            {social.icon}
                        </a>
                    </li>
                ))}
            </ul>
            <ul className="w-main max-w-main mx-auto flex gap-6 justify-center">
                {links.map(link => (
                    <li key={link.path}>
                        <Link
                            className="text-xs sm:text-sm text-light font-semibold"
                            href={link.path}
                        >
                            {link.text}
                        </Link>
                    </li>
                ))}
            </ul>
        </footer>
    )
}