
import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { twMerge } from 'tailwind-merge';

export default function CarouselNavButton({ onClick, className, disabled, ariaLabel }: {
    disabled?: boolean;
    onClick: () => void;
    className?: string;
    ariaLabel: string;
}) {
    return(
        <button
            disabled={disabled}
            onClick={!disabled ? onClick : undefined}
            className={twMerge(
                "pointer-events-auto flex items-center justify-center z-10 w-[--button-width] aspect-square -rotate-90 rounded-full bg-light active:bg-light-secondary text-c-primary transition-[background-color,opacity]",
                disabled && 'opacity-0',
                className,
            )}
            aria-label={ariaLabel}
        >
            <ArrowIcon strokeWidth={2} className="w-[50%]" />
        </button>
    )
}