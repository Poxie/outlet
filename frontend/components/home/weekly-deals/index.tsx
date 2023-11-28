import Image from 'next/image';
import { WeeklyDeal } from '../../../../types';
import Link from 'next/link';
import Carousel from '@/components/carousel';
import { getWeeklyDealImage } from '@/utils';
import { ArrowIcon } from '@/assets/icons/ArrowIcon';

const getWeeklyDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals`, { next: { revalidate: 0 } });
    const data = await res.json();
    return data as WeeklyDeal[];
}

const DAYS_OF_WEEK = 7;
export default async function WeeklyDeals() {
    const deals = await getWeeklyDeals();
    console.log(deals);

    const date = new Date();
    const daysUntilEnd = DAYS_OF_WEEK - date.getDay();
    date.setDate(date.getDate() + daysUntilEnd);

    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const endString = `${date.getDate()} ${month}`;

    return(
        <section className='py-12 bg-primary'>
            <div className='p-4 w-main max-w-main mx-auto bg-light rounded-lg'>
                <Carousel 
                    items={deals.map(deal => ({
                        id: deal.id,
                        image: getWeeklyDealImage(deal.id, deal.date),
                    }))}
                    itemsPerPage={3}
                />
            </div>
            <div className="mt-1.5 p-2 w-main max-w-main mx-auto flex items-center justify-between text-sm bg-light rounded-lg">
                <span className="p-2 text-secondary">
                    Gäller t.o.m. {endString}. Risk för utsäljning.
                </span>
                <Link 
                    className="p-2 flex gap-1 text-c-primary rounded hover:bg-light-secondary/60 active:bg-light-tertiary/60 transition-colors"
                    href={`/veckans-deal`}
                >
                    Visa alla deals
                    <ArrowIcon className="-mr-0.5 w-4 rotate-90" />
                </Link>
            </div>
        </section>
    )
}