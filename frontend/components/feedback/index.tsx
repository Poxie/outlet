import { twMerge } from "tailwind-merge";

export default function Feedback({ text, type, className }: {
    text: string;
    type: 'danger' | 'success';
    className?: string;
}) {
    return(
        <span className={twMerge(
            "block mx-4 p-3 rounded-md text-sm border-[1px]",
            type === 'danger' && 'bg-red-400/50 border-red-400',
            type === 'success' && 'bg-green-300/50 border-green-300',
            className,
        )}>
            {text}
        </span>
    )
}