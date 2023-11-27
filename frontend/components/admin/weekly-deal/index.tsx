import { WeeklyDeal as WeeklyDealType } from "../../../../types";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import WeeklyDealRow from "./WeeklyDealRow";

const getWeeklyDeals = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/all`, { next: { revalidate: 0 } });
    const deals = await res.json();
    return deals as {[date: string]: WeeklyDealType[]};
}
export default async function WeeklyDeal() {
    const deals = await getWeeklyDeals();

    const dates = Object.keys(deals);
    return(
        <main className="my-12">
            <AdminTabs />
            <div className="flex flex-col gap-6 w-main max-w-main mx-auto bg-light rounded-lg">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Veckans deal'}
                />
                {dates.map((date, index) => {
                    const images = deals[date];

                    let label: 'This week' | 'Next week' | undefined;
                    if(index === 0) label = 'This week';
                    if(index === 1) label = 'Next week';
                    return(
                        <WeeklyDealRow
                            date={date}
                            images={images}
                            label={label}
                            key={date}
                        />
                    )
                })}
            </div>
        </main>
    )
}