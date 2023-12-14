"use client";
import { Image } from "../../../../types";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import Link from "next/link";

const HOURS_IN_A_WEEK = 60*60*24*7;
export default function WeeklyDealRow({ date, active, images, label }: {
    date: string;
    active: boolean;
    images: Image[];
    label?: 'This week' | 'Next week';
}) {
    return(
        <Link 
            className="p-4 flex justify-between gap-2 rounded-md border-[1px] border-light-tertiary hover:bg-light-secondary transition-colors"
            href={`/admin/veckans-deal/${date}`}
        >
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-medium">
                        {label || date}
                    </span>
                    {label && (
                        <span className="text-sm text-secondary">
                            ({date})
                        </span>
                    )}
                </div>
                {active && (
                    <span className="text-sm text-secondary">
                        Currently active.
                    </span>
                )}
            </div>
            <div className="flex items-center gap-2 text-secondary text-sm">
                {images.length} images
                <ArrowIcon className="w-5 rotate-90" />
            </div>
        </Link>
    )
}