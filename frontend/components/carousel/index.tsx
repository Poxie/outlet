"use client";
import { useState } from 'react';
import Image from "next/image";
import CarouselNavButton from "./CarouselNavButton";

export default function Carousel({ items, itemsPerPage=4 }: {
    items: { id: string, image: string }[];
    itemsPerPage?: number;
}) {
    const [index, setIndex] = useState(0);
    const [translate, setTranslate] = useState(0);

    const next = () => {
        setIndex(prev => prev + 1);

        const start = (translate + 100) / 25;
        const percentage = items.slice(start, start + itemsPerPage).length / itemsPerPage;
        
        setTranslate(prev => prev + percentage * 100);
    }
    const back = () => {
        setIndex(prev => prev - 1);
        setTranslate(prev => prev < 100 ? 0 : prev - 100);
    }

    const atEnd = (translate + 100) / 25 === items.length;
    return(
        <div className="relative">
            {index > 0 && (
                <CarouselNavButton 
                    onClick={back}
                    disabled={index === 0}
                />
            )}
            <div className='overflow-hidden'>
                <ul 
                    className="[--column-count:4] [--spacing:8px] flex transition-transform -mr-[--spacing]"
                    style={{
                        transform: `translateX(${-1 * translate}%)`,
                    }}
                >
                    {items.map(item => {
                        return(
                            <li 
                                key={item.id}
                                className="min-w-[25%] border-r-[8px] border-r-transparent"
                            >
                                <Image 
                                    alt=""
                                    className='rounded-md'
                                    src={item.image}
                                    height={400}
                                    width={400}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
            {!atEnd && (
                <CarouselNavButton
                    onClick={next}
                    disabled={atEnd}
                    className="left-[unset] -right-4 rotate-90"
                />
            )}
        </div>
    )
}