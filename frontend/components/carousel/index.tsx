"use client";
import { useScreenSize } from '@/hooks/useScreenSize';
import { useState, useEffect } from 'react';
import Image from "next/image";
import CarouselNavButton from "./CarouselNavButton";

export default function Carousel({ items, itemsPerPage }: {
    items: { id: string, image: string }[];
    itemsPerPage: number;
}) {
    const screenSize = useScreenSize();
    const columnCount = ['xs', 'sm'].includes(screenSize) ? (
        screenSize === 'sm' ? 2 : 1
    ) : itemsPerPage;
    const columnPercentage = (1 / columnCount) * 100;

    const [index, setIndex] = useState(0);
    const [translate, setTranslate] = useState(0);

    useEffect(() => {
        setIndex(0);
        setTranslate(0);
    }, [columnCount]);

    const next = () => {
        setIndex(prev => prev + 1);

        const start = (translate + 100) / columnPercentage;
        const percentage = items.slice(start, start + columnCount).length / columnCount;
        
        setTranslate(prev => prev + percentage * 100);
    }
    const back = () => {
        setIndex(prev => prev - 1);
        setTranslate(prev => prev < 100 ? 0 : prev - 100);
    }

    const atEnd = Math.floor((translate + 100) / columnPercentage) === items.length;
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
                    className="[--spacing:8px] flex transition-transform -mr-[--spacing]"
                    style={{
                        transform: `translateX(${-1 * translate}%)`,
                        '--column-count': columnCount,
                    } as React.CSSProperties}
                >
                    {items.map(item => {
                        return(
                            <li 
                                key={item.id}
                                className="min-w-[calc(100%/var(--column-count))] border-r-[8px] border-r-transparent"
                            >
                                <Image 
                                    alt=""
                                    className='rounded-md w-full'
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