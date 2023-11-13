import Image from 'next/image';
import { WeeklyDeal } from '../../../../types';
import Link from 'next/link';
import Carousel from '@/components/carousel';

const getWeeklyDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/veckans-deal`, { next: { revalidate: 0 } });
    const data = await res.json();
    return data as WeeklyDeal[];
}

export default async function WeeklyDeals() {
    const deals = await getWeeklyDeals();

    return(
        <section className='w-main mx-auto'>
            <div className='p-4 bg-light rounded-lg'>
                <Carousel 
                    items={deals.map(deal => ({
                        id: deal.id,
                        image: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/veckans-deal/${deal.image}`
                    }))}
                />
                <div className="flex items-center justify-between text-sm pt-3">
                    <span className="text-secondary">
                        Gäller t.o.m. 12 nov. Risk för utsäljning.
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