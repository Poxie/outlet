import Image from "next/image";
import { Event } from "../../../../types";
import Button from "@/components/button";
import { DoubleArrowIcon } from "@/assets/icons/DoubleArrowIcon";
import { getEventImage } from "@/utils";

export const EventCard: React.FC<Event> = ({ id, title, description, image, timestamp, parentId }) => {
    return(
        <li className="p-6 flex flex-col border-[0.5px] border-light-secondary hover:bg-light-secondary/40 transition-colors">
            <Image 
                className="w-full rounded-md aspect-[5/3] object-cover"
                src={getEventImage(id, image, timestamp)}
                width={400}
                height={200}
                alt=""
            />
            <div className="h-full mt-2 flex flex-col">
                <span className="text-lg font-semibold">
                    {title}
                </span>
                
                <span className="text-sm mt-1 text-secondary line-clamp-4">
                    {description}
                </span>
                <div className="flex-1 flex items-end">
                    <Button 
                        className="mt-2 flex-1"
                        icon={<DoubleArrowIcon className="w-4" />}
                        href={parentId ? `/${parentId}#${id}` : `/events/${id}`}
                    >
                        Visa tips
                    </Button>
                </div>
            </div>
        </li>
    )
}