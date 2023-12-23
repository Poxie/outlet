import { Image } from '../../../../types';
import Link from 'next/link';
import Carousel from '@/components/carousel';
import { getWeeklyDealImage } from '@/utils';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';

const getWeeklyDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals`, { next: { revalidate: 0 } });
    const data = await res.json();
    return data as Image[];
}

const DAYS_OF_WEEK = 7;
export default async function WeeklyDeals() {
    const deals = await getWeeklyDeals();
    if(!deals.length) return null;

    const date = new Date();
    const daysUntilEnd = DAYS_OF_WEEK - date.getDay();
    date.setDate(date.getDate() + daysUntilEnd);

    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const endString = `${date.getDate()} ${month}`;

    return(
        <section className="overflow-hidden">
            <div className="py-8 w-main max-w-main mx-auto">
                <div className="py-4 sm:py-2 px-4 grid sm:flex sm:gap-3 items-center text-sm bg-light rounded-t-lg border-b-[1px] border-b-light-secondary">
                    <span className="text-2xl sm:text-xl font-semibold">
                        Veckans deal
                    </span>
                    <span className="text-secondary mt-1">
                        Gäller t.o.m. {endString}. Risk för utsäljning.
                    </span>
                    <div className="flex-1 flex sm:justify-end mt-1 sm:mt-0">
                        <Link 
                            className="p-2 -ml-2 sm:ml-0 -mb-2 sm:mb-0 sm:-mr-2 flex items-center gap-1 text-secondary rounded hover:bg-light-secondary/80 active:bg-light-tertiary/80 transition-colors"
                            href={`/veckans-deal`}
                        >
                            Visa alla deals
                            <ArrowIcon className="-mr-0.5 w-4 rotate-90" />
                        </Link>
                    </div>
                </div>
                <div className='p-4 bg-light rounded-b-lg mb-[calc(3rem+.5rem)] md:mb-0'>
                    <Carousel 
                        items={deals.map(deal => ({
                            id: deal.id,
                            image: getWeeklyDealImage(deal.id, deal.parentId),
                            path: `/veckans-deal?deal=${deal.id}`,
                        }))}
                        itemsPerPage={3}
                    />
                </div>
            </div>
        </section>
    )
}