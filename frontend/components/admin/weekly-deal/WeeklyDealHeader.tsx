export default function WeeklyDealHeader({ text }: {
    text: string;
}) {
    return(
        <div className="relative after:bg-light-secondary after:h-[1px] after:w-full after:absolute after:left-0 after:top-2/4 after:-translate-y-2/4">
            <span className="relative z-[1] bg-light pr-4 text-secondary text-sm">
                {text}
            </span>
        </div>
    )
}