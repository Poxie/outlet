import Image from "next/image";
import { useRef, useState } from 'react';
import { SortableImageProps } from ".";
import { BinIcon } from "@/assets/icons/BinIcon";
import { HamIcon } from "@/assets/icons/HamIcon";
import { twMerge } from "tailwind-merge";

export default function SortableImageItem({ id, src, position, handleRemove }: SortableImageProps & {
    handleRemove: (id: string) => void;
}) {
    const [dragging, setDragging] = useState(false);

    const container = useRef<HTMLDivElement>(null);
    const initialMousePos = useRef<null | {
        top: number;
        left: number;
    }>(null);

    const onMouseDown = (e: React.MouseEvent) => {
        setDragging(true);

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        document.body.style.userSelect = 'none';

        if(!container.current) return;
        container.current.style.pointerEvents = 'none';
        container.current.style.zIndex = '3';
        document.body.style.cursor = 'grab';
    }
    const onMouseUp = (e: MouseEvent) => {
        setDragging(false);

        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        document.body.style.userSelect = '';
        initialMousePos.current = null;

        if(!container.current) return;
        container.current.style.transform = '';
        container.current.style.pointerEvents = '';
        container.current.style.zIndex = '';
        document.body.style.cursor = '';
    }
    const onMouseMove = (e: MouseEvent) => {
        if(!container.current) return;
        if(!initialMousePos.current) {
            initialMousePos.current = {
                top: e.clientY,
                left: e.clientX,
            }
        }

        const { left: containerLeft, top: containerTop } = container.current.getBoundingClientRect();
        const mousePosOffsetX = e.clientX - containerLeft;
        const mousePosOffsetY = e.clientY - containerTop;
        
        const translateX = -(initialMousePos.current.left - containerLeft - mousePosOffsetX);
        const translateY = -(initialMousePos.current.top - containerTop - mousePosOffsetY);

        container.current.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    return(
        <div 
            className="group relative"
            ref={container}
        >
            <div 
                className={twMerge(
                    "shadow opacity-0 focus:opacity-100 group-hover:opacity-100 p-1 cursor-grab absolute top-2 left-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded",
                    dragging && 'opacity-100',
                )}
                onMouseDown={onMouseDown}
            >
                <HamIcon className="w-5 text-primary" />
            </div>
            <Image 
                width={150}
                height={150}
                src={src}
                className="aspect-square w-full h-full object-cover rounded-md"
                draggable={false}
                alt={`Image ${position + 1}`}
            />
            <button 
                className="shadow opacity-0 focus:opacity-100 group-hover:opacity-100 p-1 absolute top-2 right-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded"
                aria-label="Delete image"
                onClick={() => handleRemove(id)}
            >
                <BinIcon className="w-5 text-primary" />
            </button>
        </div>
    )
}