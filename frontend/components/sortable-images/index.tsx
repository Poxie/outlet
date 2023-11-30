import Image from "next/image";
import { useRef } from 'react';
import { BinIcon } from "@/assets/icons/BinIcon";
import { twMerge } from "tailwind-merge";

export default function SortableImages({ images, onImageAdd, onImageRemove, className, addImageLabel='Add image' }: {
    images: {
        id: string;
        src: string;
    }[];
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
                <div className="group relative" key={key}>
                    <Image 
                        width={150}
                        height={150}
                        src={image.src}
                        className="aspect-square w-full h-full object-cover rounded-md"
                        alt={`Image ${key + 1}`}
                    />
                    <button 
                        className="shadow opacity-0 focus:opacity-100 group-hover:opacity-100 p-1 absolute top-2 right-2 z-[1] bg-light hover:bg-opacity-80 transition-[background-color,opacity] rounded"
                        aria-label="Delete image"
                        onClick={() => handleRemove(image.id)}
                    >
                        <BinIcon className="w-5 text-primary" />
                    </button>
                </div>
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