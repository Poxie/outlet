"use client";
import Image from "next/image";
import ImagePreviewModal from "@/modals/image-preview";
import { useModal } from "@/contexts/modal";
import { twMerge } from "tailwind-merge";
import { useEffect } from 'react';

export default function ExpandableImage({ src, path, width, height, className, alt, defaultActive }: {
    src: string;
    path: string;
    width: number;
    height: number;
    className: string;
    alt: string;
    defaultActive?: boolean;
}) {
    const { setModal } = useModal();

    const showPreview = () => {
        setModal(
            <ImagePreviewModal 
                src={src} 
                path={path}
            />
        );
    }
    useEffect(() => {
        if(defaultActive) showPreview();
    }, [defaultActive]);

    return(
        <Image 
            src={src}
            width={width}
            height={height}
            className={twMerge(
                "cursor-pointer",
                className,
            )}
            onClick={showPreview}
            alt={alt}
        />
    )
}