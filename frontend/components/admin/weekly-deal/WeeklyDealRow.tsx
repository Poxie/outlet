"use client";
import Button from "@/components/button";
import WeeklyDealHeader from "./WeeklyDealHeader";
import { useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { WeeklyDeal } from "../../../../types";
import Image from "next/image";
import { getWeeklyDealImage } from "@/utils";

const HOURS_IN_A_WEEK = 60*60*24*7;
export default function WeeklyDealRow({ date, images, label }: {
    date: string;
    images: WeeklyDeal[];
    label?: 'This week' | 'Next week';
}) {
    const { post } = useAuth();

    const imageInput = useRef<HTMLInputElement>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || !e.target.files[0]) return;

        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);

        fileReader.onload = async () => {
            const timestamp = new Date(date);
            await post(`/weekly-deals/${timestamp.getTime().toString()}/images`, {
                image: fileReader.result,
            });
        }
    }

    return(
        <div>
            <WeeklyDealHeader text={label || date} />
            <div className="mt-2 grid items-start grid-cols-6">
                {images.map(image => (
                    <Image 
                        alt=""
                        width={250}
                        height={250}
                        src={getWeeklyDealImage(image.id, image.date)}
                        key={image.id}
                    />
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