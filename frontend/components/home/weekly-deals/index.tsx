import Image from 'next/image';
import { WeeklyDeal } from '../../../../types';
import Link from 'next/link';
import Carousel from '@/components/carousel';
import { getWeeklyDealImage } from '@/utils';

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
                <div className="flex items-center justify-between text-sm pt-3">
                    <span className="text-secondary">
                        Gäller t.o.m. {endString}. Risk för utsäljning.
                    </span>
                    <Link 
                        className="text-c-primary"
                        href={`/veckans-deal`}
                    >
                        Visa alla deals
                    </Link>
                </div>
            </div>
        </section>
    )
}