import Image from 'next/image';
import { WeeklyDeal } from '../../../../types';

const getWeeklyDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/veckans-deal`);
    const data = await res.json();
    return data as WeeklyDeal[];
}

export default async function WeeklyDeals() {
    const deals = await getWeeklyDeals();
    
    return(
        <section className=''>
            <ul className='flex'>
                {deals.map(deal => {
                    return(
                        <li key={deal.id}>
                            <Image 
                                alt=""
                                src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/veckans-deal/${deal.image}`}
                                height={400}
                                width={400}
                            />
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}