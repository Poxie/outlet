export default function WeeklyDealHeader({ text }: {
    text: string;
}) {
    return(
        <div className="py-2 -mt-2 sticky z-[2] top-0 bg-light after:bg-light-secondary after:h-[1px] after:w-full after:absolute after:left-0 after:top-2/4 after:-translate-y-2/4">
            <span className="block relative z-[1] bg-light pr-4 text-secondary text-sm">
                {text}
            </span>
        </div>
    )
}