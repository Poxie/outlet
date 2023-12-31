"use client";
import { useAppSelector } from "@/store";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import WeeklyDealRow from "./WeeklyDealRow";

export default function WeeklyDeal() {
    const deals = useAppSelector(state => state.deals.deals);

    const dates = Object.keys(deals);
    return(
        <div className="flex flex-col bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                backPath={'/admin'}
                text={'Veckans deal'}
            />
            <div className="p-4 grid gap-2">
                {!dates.length && (
                    <span className="block text-center py-24">
                        Loading deals...
                    </span>
                )}
                {dates.map((date, index) => {
                    const images = deals[date];
                    if(!images) return null;

                    let label: 'This week' | 'Next week' | undefined;
                    if(index === 0) label = 'This week';
                    if(index === 1) label = 'Next week';
                    return(
                        <WeeklyDealRow
                            active={index === 0}
                            date={date}
                            images={images}
                            label={label}
                            key={date}
                        />
                    )
                })}
            </div>
        </div>
    )
}