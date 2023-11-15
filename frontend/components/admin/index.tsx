import { ArrowIcon } from "@/assets/icons/ArrowIcon"
import Link from "next/link"

const adminLinks = [
    { text: 'Veckans deal', path: '/veckans-deal' },
    { text: 'Events', path: '/events' },
    { text: 'Banners', path: '/banners' },
]

export default function Admin() {
    return(
        <main className="py-12 w-[900px] max-w-main mx-auto">
            <h1 className="text-light font-bold text-4xl text-center mb-4">
                Admin Panel
            </h1>
            <ul className="grid gap-2 bg-light p-6 rounded-lg">
                {adminLinks.map(link => (
                    <li key={link.path}>
                        <Link
                            className="flex items-center justify-between p-5 bg-light-secondary hover:shadow-md transition-shadow rounded-md font-semibold text-lg"
                            href={`/admin/${link.path}`}
                        >
                            {link.text}
                            <ArrowIcon className="w-5 rotate-90" />
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    )
}