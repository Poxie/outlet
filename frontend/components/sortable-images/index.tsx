import React, { useRef, useState, useEffect } from 'react';
import { twMerge } from "tailwind-merge";
import SortableImageItem from "./SortableImageItem";
import { Image } from '../../../types';

export const SORTABLE_IMAGE_TEMP_ID = 10;
export type SortableImageProps = {
    id: string;
    src: string;
    position: number;
    parentId: string;
}
function SortableImages({ parentId, images, className, onChange, addImageLabel='Add image' }: {
    parentId: string;
    images: SortableImageProps[];
    onChange: (images: SortableImageProps[]) => void;
    addImageLabel?: string;
    className?: string;
}) {
    const [sortableImages, setSortableImages] = useState(images);

    const addImageInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(!images) return;
        setSortableImages(images);
    }, [images]);
    useEffect(() => {
        if(sortableImages.toString() === images.toString()) return;
        onChange(sortableImages);
    }, [sortableImages]);

    const handleAdd = async (files: FileList) => {
        const addedImages: SortableImageProps[] = [];
        for(let i = 0; i < files.length; i++) {
            await new Promise((res, rej) => {
                const file = files[i];

                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);

                fileReader.onload = () => {
                    const image = fileReader.result;
                    if(typeof image !== 'string') throw new Error('File reader read images incorrectly.');

                    const newImage: SortableImageProps = {
                        id: Math.random().toString(),
                        parentId,
                        src: image,
                        position: sortableImages.length + i,
                    }
                    addedImages.push(newImage);
                    res(newImage);
                }
            })
        }
        setSortableImages(prev => prev.concat(addedImages));
    }
    const handleRemove = (id: string) => setSortableImages(prev => prev.filter(image => image.id !== id))

    const handleOrderChange: ({}: {
        hovered: { id: string, position: number };
        dragged: { id: string, position: number };
    }) => void = ({ 
        hovered: { id: hoveredId, position: hoveredPosition },
        dragged: { id: draggedId, position: draggedPosition },
    }) => {
        const hovered = sortableImages.find(image => image.id === hoveredId);
        const dragged = sortableImages.find(image => image.id === draggedId);
        if(!hovered || !dragged) return;

        const draggedIsLarger = dragged.position > hovered.position;
        const isBulkSwap = draggedIsLarger ? (
            hovered.position !== dragged.position - 1
        ) : (
            hovered.position !== dragged.position + 1
        )

        setSortableImages(prev => {
            let newHoveredPosition = dragged.position;
            let newDraggedPosition = hovered.position;
            let newSortedImages = prev
                .filter(image => ![hovered.id, dragged.id].includes(image.id))
                .map(image => {
                    if(isBulkSwap) {
                        if(draggedIsLarger) {
                            newHoveredPosition = hovered.position + 1;
                            if(image.position > hovered.position && image.position < dragged.position) {
                                return {...image, position: image.position + 1};
                            }
                        } else {
                            newHoveredPosition = hovered.position - 1;
                            if(image.position < hovered.position && image.position > dragged.position) {
                                return {...image, position: image.position - 1};
                            }
                        }
                    }
                    return image;
                })

            newSortedImages = newSortedImages.concat({...hovered, position: newHoveredPosition}, {...dragged, position: newDraggedPosition});

            return newSortedImages.toSorted((a,b) => a.position - b.position);
        })
    }
    const onMouseUp = () => onChange(sortableImages);

    return(
        <div className={twMerge(
            "grid gap-2 -grid-cols-2 md:grid-cols-4 lg:grid-cols-6",
            className,
        )}>
            {sortableImages.map((image, key) => (
                <SortableImageItem 
                    onMouseUp={onMouseUp}
                    handleRemove={handleRemove}
                    onOrderChange={handleOrderChange}
                    {...image}
                    key={image.id}
                />
            ))}
            <button 
                className="aspect-square rounded-md border-[1px] border-light-tertiary hover:bg-light-secondary/50 transition-colors"
                onClick={() => addImageInput.current?.click()}
            >
                {addImageLabel}
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
export default React.memo(SortableImages);