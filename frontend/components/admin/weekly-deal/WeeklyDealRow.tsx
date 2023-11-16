"use client";
import Button from "@/components/button";
import WeeklyDealHeader from "./WeeklyDealHeader";
import { useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { WeeklyDeal } from "../../../../types";
import Image from "next/image";
import { getWeeklyDealImage } from "@/utils";
import { useRouter } from "next/navigation";
import { BinIcon } from "@/assets/icons/BinIcon";

const HOURS_IN_A_WEEK = 60*60*24*7;
export default function WeeklyDealRow({ date, images, label }: {
    date: string;
    images: WeeklyDeal[];
    label?: 'This week' | 'Next week';
}) {
    const router = useRouter();
    const { post } = useAuth();

    const imageInput = useRef<HTMLInputElement>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0]) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);

        fileReader.onload = async () => {
            const parts = date.split('-');
            const timestamp = new Date(Number(parts.at(-1)), Number(parts.at(1)) - 1, Number(parts.at(0)));
            console.log(timestamp);
            const deal = await post<WeeklyDeal>(`/weekly-deals/${timestamp.getTime().toString()}/images`, {
                image: fileReader.result,
            });
            router.refresh();
        }
    }

    return(
        <div>
            <WeeklyDealHeader text={label || date} />
            <div className="grid items-start grid-cols-6">
                {images.map((image, index) => (
                    <div className="group h-full relative rounded-md overflow-hidden">
                        <Image 
                            alt={`Weekly deal ${index + 1}.`}
                            width={250}
                            height={250}
                            src={getWeeklyDealImage(image.id, image.date)}
                            key={image.id}
                        />
                        <button 
                            className="shadow opacity-0 group-hover:opacity-100 p-1 absolute top-3 right-3 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded"
                            aria-label="Delete image"
                        >
                            <BinIcon className="w-5 text-primary" />
                        </button>
                    </div>
                ))}
                <Button 
                    className="block"
                    onClick={() => imageInput.current?.click()}
                >
                    Add image
                </Button>
            </div>
            <input onChange={onChange} type="file" className="hidden" ref={imageInput} />
        </div>
    )
}