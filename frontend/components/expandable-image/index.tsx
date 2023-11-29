"use client";
import Image from "next/image";
import ImagePreviewModal from "@/modals/image-preview";
import { useModal } from "@/contexts/modal";
import { twMerge } from "tailwind-merge";

export default function ExpandableImage({ src, path, width, height, className, alt }: {
    src: string;
    path: string;
    width: number;
    height: number;
    className: string;
    alt: string;
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