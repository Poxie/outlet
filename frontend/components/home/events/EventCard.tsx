import Image from "next/image";
import { Event } from "../../../../types";
import Button from "@/components/button";
import { DoubleArrowIcon } from "@/assets/icons/DoubleArrowIcon";

export const EventCard: React.FC<Event> = ({ id, title, description, image }) => {
    return(
        <li className="p-4 bg-light rounded-lg">
            <Image 
                className="rounded-md aspect-[5/3] object-cover"
                src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${image}`}
                width={400}
                height={200}
                alt=""
            />
            <div className="flex flex-col mt-2">
                <span className="text-lg font-semibold">
                    {title}
                </span>
                <span className="text-sm mt-1 text-secondary">
                    {description}
                </span>
                <Button 
                    className="mt-2"
                    icon={<DoubleArrowIcon className="w-4" />}
                    href={`/events/${id}`}
                >
                    Visa tips
                </Button>
            </div>
        </li>
    )
}