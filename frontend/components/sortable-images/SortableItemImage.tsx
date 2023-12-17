import Image from "next/image";
import React from "react";

const SortableItemImage = React.memo(({ src }: {
    src: string;
}) => {
    return(
        <Image 
            width={150}
            height={150}
            src={src}
            className="aspect-square w-full h-full object-cover rounded-md"
            draggable={false}
            alt={``}
        />
    )
})
SortableItemImage.displayName = 'SortableItemImage';
export default SortableItemImage;