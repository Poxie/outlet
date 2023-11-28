
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
                "flex items-center justify-center z-10 h-[15%] aspect-square absolute -left-4 top-2/4 -translate-y-2/4 -rotate-90 rounded-full text-light bg-secondary",
                className,
            )}
        >
            <ArrowIcon className="w-[50%]" />
        </button>
    )
}