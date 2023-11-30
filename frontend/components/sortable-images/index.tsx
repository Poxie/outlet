import Image from "next/image";
import { useRef } from 'react';
import { BinIcon } from "@/assets/icons/BinIcon";
import { twMerge } from "tailwind-merge";
import SortableImageItem from "./SortableImageItem";

export type SortableImageProps = {
    id: string;
    src: string;
    position: number;
}
export default function SortableImages({ images, onImageAdd, onImageRemove, className, addImageLabel='Add image' }: {
    images: SortableImageProps[];
    onImageAdd: (image: string) => void;
    onImageRemove: (image: string) => void;
    addImageLabel?: string;
    className?: string;
}) {
    const addImageInput = useRef<HTMLInputElement>(null);

    const handleAdd = (files: FileList) => {
        for(let i = 0; i < files.length; i++) {
            const file = files[i];

            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                const image = fileReader.result;
                if(typeof image !== 'string') throw new Error('File reader read images incorrectly.');
                onImageAdd(image);
            }
        }
    }
    const handleRemove = (image: string) => onImageRemove(image);

    return(
        <div className={twMerge(
            "grid grid-cols-6 gap-2",
            className,
        )}>
            {images.map((image, key) => (
                <SortableImageItem 
                    handleRemove={handleRemove}
                    {...image}
                    key={image.id}
                />
            ))}
            <button 
                className="aspect-square rounded-md border-[1px] border-light-tertiary hover:bg-light-secondary/50 transition-colors"
                onClick={() => addImageInput.current?.click()}
            >
                Add image
            </button>
            <input 
                multiple
                type="file"
                className="hidden"
                ref={addImageInput}
                onChange={e => {
                    if(!e.target.files?.length) return;
                    handleAdd(e.target.files);
                }}
            />
        </div>
    )
}