import Image from "next/image";
import { EventWithImages } from "../../../types";
import { getEventImage } from "@/utils";
import { twMerge } from "tailwind-merge";
import ExpandableImage from "../expandable-image";

export default function EventContainer({ event, photoId, className }: {
    event: EventWithImages;
    photoId?: string;
    className?: string;
}) {
    return(
        <div 
            className={className}
            id={event.id}
        >
            <div className="[--padding:16px] relative p-[--padding] flex flex-col gap-3 rounded-lg bg-light sm:flex-row">
                <Image 
                    className="w-full max-h-[200px] aspect-[1.7/1] rounded-md object-cover sm:w-60 sm:h-[unset]"
                    src={getEventImage(event.id, event.image, event.timestamp)}
                    width={400}
                    height={200}
                    alt=""
                />
                <div className={twMerge(
                    "w-[calc(100%-var(--padding)*2)] h-[calc(100%-var(--padding)*2)] flex flex-col justify-center items-center absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4",
                    "before:rounded-md before:bg-black before:bg-opacity-60 before:absolute before:left-0 before:top-0 before:w-full before:h-full",
                    "sm:relative sm:left-0 sm:top-0 sm:translate-x-0 sm:translate-y-0 sm:before:hidden sm:w-[unset] sm:h-[unset] sm:block"
                )}>
                    <h1 className={twMerge(
                        "relative text-2xl font-semibold text-light",
                        "sm:text-xl sm:text-primary"
                    )}>
                        {event.title}
                    </h1>
                    <p className={twMerge(
                        "relative mt-1 text-sm",
                        "text-center text-light-secondary px-[--padding]",
                        "sm:text-left sm:text-secondary sm:px-0"
                    )}>
                        {event.description}
                    </p>
                </div>
            </div>
            {event.images.length? (
                <ul className="mt-2 p-4 grid gap-2 bg-light rounded-lg sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {event.images.map(image => (
                        <li 
                            key={image.id}
                        >
                            <ExpandableImage 
                                className="w-full aspect-square object-cover rounded-md"
                                src={getEventImage(event.id, image.id, event.timestamp)}
                                path={`/events/${event.id}?photoId=${image.id}`}
                                defaultActive={image.id === photoId}
                                width={150}
                                height={150}
                                alt=""
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="py-3 block text-center text-light text-sm font-semibold">
                    This event has no images yet.
                </span>
            )}
        </div>
    )
}