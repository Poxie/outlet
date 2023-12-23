import { ArrowIcon } from "@/assets/icons/ArrowIcon"
import { BannersIcon } from "@/assets/icons/BannersIcon"
import { EventsIcon } from "@/assets/icons/EventsIcon"
import { InspirationIcon } from "@/assets/icons/InspirationIcon"
import { PeopleIcon } from "@/assets/icons/PeopleIcon"
import { StoresIcon } from "@/assets/icons/StoresIcon"
import { WeeklyDealIcon } from "@/assets/icons/WeeklyDealIcon"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export const dashboardLinks = [
    { text: 'Veckans deal', path: '/admin/veckans-deal', icon: <WeeklyDealIcon className="w-5 h-5" /> },
    { text: 'Events', path: '/admin/events', icon: <EventsIcon className="w-5 h-5" /> },
    { text: 'Inspiration', path: '/admin/inspiration', icon: <InspirationIcon className="w-5 h-5" /> },
    { text: 'Banners', path: '/admin/banners', icon: <BannersIcon className="w-5 h-5" /> },
]
export const adminLinks = [
    { text: 'Stores', path: '/admin/stores', icon: <StoresIcon className="w-5 -mt-0.5" /> },
    { text: 'People', path: '/admin/people', icon: <PeopleIcon className="w-5 -mt-0.5" /> },
]

export default function Admin() {
    return(
        <div className="w-[900px] max-w-full mx-auto">
            <h1 className="text-light font-bold text-4xl text-center mb-3">
                Admin Panel
            </h1>
            <div className="bg-light p-4 rounded-lg">
                <ul className="grid sm:grid-cols-2 gap-2">
                    {dashboardLinks.map(link => (
                        <li key={link.path}>
                            <Link
                                className="flex items-center justify-between p-7 border-[1px] border-light-tertiary bg-light-secondary hover:shadow-md transition-shadow rounded-md font-medium text-primary text-lg"
                                href={link.path}
                            >
                                {link.text}
                                {link.icon}
                            </Link>
                        </li>
                    ))}
                </ul>
                <hr className="my-4 h-[1px] bg-light-secondary" />
                <ul className="grid gap-1.5">
                    {adminLinks.map(link => (
                        <li key={link.path}>
                            <Link
                                className="p-3 flex items-center justify-between border-[1px] border-light-tertiary bg-light-secondary hover:shadow-md transition-shadow rounded-md font-medium text-primary"
                                href={link.path}
                            >
                                <div className="flex items-center gap-2">
                                    {link.icon}
                                    {link.text}
                                </div>
                                <ArrowIcon className="w-4 rotate-90" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-2 flex justify-end">
                <LogoutButton />
            </div>
        </div>
    )
}