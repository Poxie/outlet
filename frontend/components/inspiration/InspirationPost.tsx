import { getBlogImage, getReadableDateFromTimestamp } from "@/utils";
import { BlogPost } from "../../../types";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import Link from "next/link";
import Image from "next/image";
import ExpandableImage from "../expandable-image";

export default function InspirationPost({ id, title, description, timestamp, images }: BlogPost) {
    const date = new Date(Number(timestamp));
    const dateTime = getReadableDateFromTimestamp(timestamp);

    const month = date.toLocaleDateString('default', { month: 'long' });
    return(
        <article className="py-16 border-b-[1px] border-b-light-secondary first-of-type:pt-0 last-of-type:pb-0 last-of-type:border-b-0">
            <header>
                <time 
                    dateTime={dateTime}
                    className="mb-2 flex items-center gap-2 text-sm text-secondary"
                >
                    <MegaphoneIcon className="w-4 -mt-0.5" />
                    <span>
                        {month} {date.getDate()}, {date.getFullYear()}
                    </span>
                </time>
                <h2 className="text-2xl font-bold mb-2">
                    <Link 
                        href={`/inspiration/${id}`}
                        className="visited:text-c-primary hover:text-c-primary transition-colors"
                    >
                        {title}
                    </Link>
                </h2>
                <p className="text-secondary w-[800px] max-w-full">
                    {description}
                </p>
                <div className="grid grid-cols-4 gap-2 mt-4">
                    {images.map((image, key) => (
                        <ExpandableImage
                            alt={`Blog image ${key}`}
                            className="w-full aspect-square rounded-lg"
                            path={`/inspiration/${image.parentId}?photo=${image.id}`}
                            src={getBlogImage(image.parentId, image.id)}
                            width={250}
                            height={250}
                            key={image.id}
                        />
                    ))}
                </div>
            </header>
        </article>
    )
}