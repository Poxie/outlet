import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Button({
    icon, className, onClick, href, disabled, children,
    type='primary'
}: {
    children: React.ReactNode;
    type?: 'primary' | 'transparent';
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}) {
    className = twMerge(
        "flex items-center justify-center gap-1.5 py-3 px-4 text-xs font-bold text-light rounded-md transition-colors hover:bg-opacity-80",
        type === 'primary' && 'bg-secondary',
        type === 'transparent' && 'text-primary hover:bg-light-tertiary/50 active:bg-light-tertiary',
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
            disabled={disabled}
        >
            {children}
            {icon}
        </button>
    )
}