import { getWeeklyDealImage } from "@/utils";
import Image from "next/image";
import { WeeklyDeal } from "../../../types";
import { twMerge } from "tailwind-merge";
import ExpandableImage from "../expandable-image";

const getActiveDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals`, { next: { revalidate: 0 } });
    return await res.json() as WeeklyDeal[];
}

export default async function WeeklyDeals({ searchParams: { deal: dealId } }: {
    searchParams: { deal: string | undefined };
}) {
    const deals = await getActiveDeals();
    return(
        <div className="w-main max-w-main mx-auto py-8">
            <div className="[--padding:16px] relative p-[--padding] flex flex-col gap-3 rounded-lg bg-light sm:flex-row">
                <Image 
                    className="w-full max-h-[200px] aspect-[2.2/1] rounded-md object-cover sm:w-80 sm:h-[unset]"
                    src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/image.png`}
                    width={400}
                    height={200}
                    alt=""
                />
                <div className={twMerge(
                    "w-[calc(100%-var(--padding)*2)] h-[calc(100%-var(--padding)*2)] flex flex-col justify-center items-center absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4",
                    "before:rounded-md before:bg-black before:bg-opacity-60 before:absolute before:left-0 before:top-0 before:w-full before:h-full",
                    "sm:relative sm:left-0 sm:top-0 sm:translate-x-0 sm:translate-y-0 sm:before:hidden sm:w-[unset] sm:h-[unset] sm:block"
                )}>
                    <h1 className={twMerge(
                        "relative text-2xl font-semibold text-light",
                        "sm:text-xl sm:text-primary"
                    )}>
                        Veckans deal
                    </h1>
                    <p className={twMerge(
                        "relative mt-1 text-sm",
                        "text-center text-light-secondary px-[--padding]",
                        "sm:text-left sm:text-secondary sm:px-0"
                    )}>
                        Här är denna veckas specialerbjudanden! Gäller till och med söndag. Erbjudanden kan skilja mellan varuhusen. Risk för utsäljning! 
                    </p>
                </div>
            </div>
            {deals.length? (
                <ul className="mt-3 p-4 grid gap-2 bg-light rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {deals.map(deal => (
                        <li key={deal.id}>
                            <ExpandableImage 
                                className="w-full aspect-square object-cover rounded-md"
                                src={getWeeklyDealImage(deal.id, deal.date)}
                                path={`/veckans-deal?deal=${deal.id}`}
                                defaultActive={deal.id === dealId}
                                width={150}
                                height={150}
                                alt=""
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="py-3 block text-center text-light text-sm font-semibold">
                    Denna veckas deals kommer snart...
                </span>
            )}
        </div>
    )
}