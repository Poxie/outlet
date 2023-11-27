import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import Link from "next/link";

export default function AdminHeader({ text, backPath, options }: {
    text: string;
    backPath: string;
    options?: React.ReactNode;
}) {
    return(
        <div className="flex items-center justify-between sticky top-0 z-10 bg-light border-b-[1px] border-b-light-secondary rounded-t-lg">
            <Link 
                href={backPath}
                className="p-3.5 flex items-center gap-1 text-sm hover:bg-light-secondary transition-colors"
                aria-label={text}
            >
                <ArrowIcon className="w-4 -rotate-90 -ml-1 -mt-0.5" />
                {text}
            </Link>
            {options}
        </div>
    )
}