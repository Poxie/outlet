import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Button({
    icon, className, onClick, href, children
}: {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
}) {
    className = twMerge(
        "flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-bold text-light bg-secondary rounded-md transition-colors hover:bg-opacity-80",
        className,
    );

    // If button is a link
    if(href) {
        return(
            <Link 
                href={href}
                className={className}
            >
                {children}
                {icon}
            </Link>
        )
    }

    // Else its normal button
    return(
        <button 
            className={className}
            onClick={onClick}
        >
            {children}
            {icon}
        </button>
    )
}