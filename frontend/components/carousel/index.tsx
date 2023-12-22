"use client";
import { useScreenSize } from '@/hooks/useScreenSize';
import { useState, useEffect } from 'react';
import Image from "next/image";
import CarouselNavButton from "./CarouselNavButton";
import ExpandableImage from '../expandable-image';

export default function Carousel({ items, itemsPerPage }: {
    items: { id: string, image: string, path: string }[];
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

    const atEnd = items.length < columnCount || Math.floor((translate + 100) / columnPercentage) === items.length;
    return(
        <div className="[--space-from-edge:1rem] [--button-width:3rem] [--padding:.5rem] relative">
            <div className="pointer-events-none flex justify-between absolute w-full top-[calc(100%+var(--button-width)/2+var(--padding))] md:w-[calc(100%+var(--button-width)*2+var(--padding)*2+var(--space-from-edge)*2)] md:-left-[calc(var(--button-width)+var(--padding)+var(--space-from-edge))] md:top-2/4 md:-translate-y-2/4 z-20">
                <CarouselNavButton 
                    onClick={back}
                    disabled={index === 0}
                    ariaLabel='Gå till föregående slide'
                />
                <CarouselNavButton
                    onClick={next}
                    disabled={atEnd}
                    className="left-[calc(100%+var(--from-container))] rotate-90"
                    ariaLabel='Gå till nästa slide'
                />
            </div>
            <div className='overflow-hidden'>
                <ul 
                    className="flex transition-transform -mr-[--padding]"
                    style={{
                        transform: `translateX(${-1 * translate}%)`,
                        '--column-count': columnCount,
                    } as React.CSSProperties}
                >
                    {items.map(item => {
                        return(
                            <li 
                                key={item.id}
                                className="flex-1 min-w-[calc(100%/var(--column-count))] border-r-[8px] border-r-transparent"
                            >
                                <ExpandableImage 
                                    alt=""
                                    className='rounded-md w-full aspect-square object-cover'
                                    path={item.path}
                                    src={item.image}
                                    height={400}
                                    width={400}
                                />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}