
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { twMerge } from 'tailwind-merge';

export default function CarouselNavButton({ onClick, className, disabled }: {
    disabled?: boolean;
    onClick: () => void;
    className?: string;
}) {
    return(
        <button
            disabled={disabled}
            onClick={!disabled ? onClick : undefined}
            className={twMerge(
                "p-3 z-10 absolute -left-4 top-2/4 -translate-y-2/4 -rotate-90 rounded-full text-light bg-secondary",
                className,
            )}
        >
            <ArrowIcon className="w-5" />
        </button>
    )
}