"use client";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Image from "next/image";
import Button from "@/components/button";
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from "@/store";
import { getDateFromString, getWeeklyDealImage } from "@/utils";
import { WeeklyDeal } from "../../../../types";
import { addDeal, removeDeal } from "@/store/slices/deals";
import { useAuth } from "@/contexts/auth";
import { BinIcon } from "@/assets/icons/BinIcon";

export default function EditWeeklyDeal({ params: { date } }: {
    params: { date: string };
}) {
    const { post, _delete } = useAuth();

    const imageInput = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const deals = useAppSelector(state => state.deals.deals[date]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0]) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);

        fileReader.onload = async () => {
            const timestamp = getDateFromString(date);
            const deal = await post<WeeklyDeal>(`/weekly-deals/${timestamp.getTime().toString()}/images`, {
                image: fileReader.result,
            });
            console.log(deal);
            dispatch(addDeal(deal));
        }
    }
    const onDelete = async (id: string) => {
        const timestamp = getDateFromString(date);
        await _delete(`/weekly-deals/${id}`);
        dispatch(removeDeal({ dealId: id, date }));
    }
    
    const timestamp = new Date(date.split('-').reverse().join('-')).getTime();
    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/veckans-deal'}
                    text={`Veckans deal: ${date}`}
                    options={
                        <Button 
                            className="text-xs px-3 py-2 mr-2 rounded"
                            onClick={() => imageInput.current?.click()}
                        >
                            Add image
                        </Button>
                    }
                />
                {deals ? (
                    <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-1">
                        {deals?.map(deal => (
                            <div 
                                className="group relative aspect-square overflow-hidden rounded-md"
                                key={deal.id}
                            >
                                <Image 
                                    width={200}
                                    height={200}
                                    src={getWeeklyDealImage(deal.id, deal.date)}
                                    className="w-full h-full object-cover"
                                    alt=""
                                />
                                <button 
                                    className="shadow opacity-0 group-hover:opacity-100 p-1 absolute top-2 right-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded"
                                    aria-label="Delete image"
                                    onClick={() => onDelete(deal.id)}
                                >
                                    <BinIcon className="w-5 text-primary" />
                                </button>
                            </div>
                        ))}
                        <button 
                            className="aspect-square border-[1px] border-light-tertiary text-sm text-secondary rounded-md hover:bg-light-secondary/50 transition-colors"
                            onClick={() => imageInput.current?.click()}
                        >
                            Add deal image
                        </button>
                        <input 
                            type="file"
                            ref={imageInput}
                            onChange={onChange}
                            className="hidden"
                        />
                    </div>
                ) : (
                    <span className="block text-center py-12">
                        Loading deals...
                    </span>
                )}
            </div>
        </main>
    )
}