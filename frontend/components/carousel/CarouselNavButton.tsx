
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
                "[--from-container:24px] flex items-center justify-center z-10 h-[15%] aspect-square absolute right-[calc(100%+var(--from-container))] top-2/4 -translate-y-2/4 -rotate-90 rounded-full bg-light active:bg-light-secondary text-c-primary transition-[background-color,opacity]",
                disabled && 'opacity-0',
                className,
            )}
        >
            <ArrowIcon strokeWidth={2} className="w-[50%]" />
        </button>
    )
}