import Image from "next/image";
import React, { useRef, useState, useEffect } from 'react';
import { ImageWithSrc } from ".";
import { BinIcon } from "@/assets/icons/BinIcon";
import { HamIcon } from "@/assets/icons/HamIcon";
import { twMerge } from "tailwind-merge";
import { Image as ImageType } from "../../../types";
import SortableItemImage from "./SortableItemImage";

export default function SortableImageItem({ id, src, position, onMouseUp: _onMouseUp, handleRemove, onOrderChange }: ImageWithSrc & {
    onMouseUp: () => void;
    handleRemove: (id: string) => void;
    onOrderChange: ({}: { hovered: {
        id: string;
        position: number;
    }, dragged: {
        id: string;
        position: number;
    } }) => void;
}) {
    const [dragging, setDragging] = useState(false);

    const onMouseUpRef = useRef(_onMouseUp);
    const onChangeRef = useRef(onOrderChange);
    const container = useRef<HTMLDivElement>(null);
    const initialContainerPos = useRef<null | {
        top: number;
        left: number;
    }>(null);
    const initialMousePos = useRef<null | {
        top: number;
        left: number;
    }>(null);

    useEffect(() => {
        onChangeRef.current = onOrderChange;
    }, [onOrderChange, position]);
    useEffect(() => {
        onMouseUpRef.current = _onMouseUp;
    }, [_onMouseUp])
    
    const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setDragging(true);

        if('touches' in e) {
            document.body.style.overflow = 'hidden';
        }

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchstart', onMouseUp);
        document.addEventListener('touchmove', onMouseMove);
        document.body.style.userSelect = 'none';

        if(!container.current) return;
        const { width, height } = container.current.getBoundingClientRect();
        container.current.style.width = `${width}px`;
        container.current.style.height = `${height}px`;
        container.current.style.pointerEvents = 'none';
        container.current.style.zIndex = '3';
        document.body.style.cursor = 'grab';
    }
    const onMouseUp = (e: MouseEvent | TouchEvent) => {
        onMouseUpRef.current();
        setDragging(false);

        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchstart', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.body.style.userSelect = '';
        initialMousePos.current = null;
        initialContainerPos.current = null;

        if(!container.current) return;
        container.current.style.height = '';
        container.current.style.width = '';
        container.current.style.top = '';
        container.current.style.left = '';
        container.current.style.pointerEvents = '';
        container.current.style.zIndex = '';
        document.body.style.cursor = '';
        document.body.style.overflow = '';
    }
    const onMouseMove = (e: MouseEvent | TouchEvent) => {
        if(!container.current) return;

        const isTouchEvent = 'touches' in e;

        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        const { left: containerLeft, top: containerTop, width: containerWidth, height: containerHeight } = container.current.getBoundingClientRect();

        if(!initialMousePos.current) {
            initialMousePos.current = {
                top: clientY,
                left: clientX,
            }
        }
        if(!initialContainerPos.current) {
            initialContainerPos.current = {
                top: containerTop,
                left: containerLeft,
            }
        }
            
        const mousePosOffsetX = initialMousePos.current.left - initialContainerPos.current.left;
        const mousePosOffsetY = initialMousePos.current.top - initialContainerPos.current.top;
        
        const left = clientX - mousePosOffsetX;
        const top = clientY - mousePosOffsetY;

        container.current.style.left = `${left}px`;
        // window.scrollY to counteract scroll offset
        container.current.style.top = `${top + window.scrollY}px`;

        const pointX = left + containerWidth / 2;
        const pointY = top + containerHeight / 2;
        const elementAtPoint = document.elementFromPoint(pointX, pointY);

        let hoveredPosition: null | number = null;
        const element = [elementAtPoint, elementAtPoint?.parentElement].find(element => {
            const posAttr = element?.getAttribute('data-position');
            if(posAttr) hoveredPosition = Number(posAttr);
            return posAttr;
        });
        const hoveredId = element?.getAttribute('data-image-id');
        if(hoveredId === null || hoveredId === undefined || hoveredPosition === null || !element) return;

        onChangeRef.current({
            hovered: { id: hoveredId, position: hoveredPosition },
            dragged: { id, position },
        });
    }

    return(
        <div className={twMerge(
            dragging && 'bg-light-secondary/70 border-[1px] border-light-tertiary rounded-md'
        )}>
            <div 
                data-image-id={id}
                data-position={position}
                className={twMerge(
                    "group relative",
                    dragging && 'absolute',
                )}
                ref={container}
            >
                <div 
                    className={twMerge(
                        "shadow md:opacity-0 focus:opacity-100 group-hover:opacity-100 p-1 cursor-grab absolute top-2 left-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded-md",
                        dragging && 'opacity-100',
                    )}
                    onMouseDown={onMouseDown}
                    onTouchStart={onMouseDown}
                    draggable
                >
                    <HamIcon className="w-5 text-primary" />
                </div>
                <SortableItemImage src={src} />
                <button 
                    className="p-1 shadow md:opacity-0 focus:opacity-100 group-hover:opacity-100 absolute top-2 right-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded"
                    aria-label="Delete image"
                    onClick={() => handleRemove(id)}
                >
                    <BinIcon className="w-5 text-primary" />
                </button>
            </div>
        </div>
    )
}