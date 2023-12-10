import { useAppSelector } from "@/store"
import { selectEventById, selectEventIds } from "@/store/slices/events";
import { getEventImage } from "@/utils";
import Image from "next/image";
import { Event } from "../../../types";
import { useState } from "react";

export default function EventsPopout({ onChange, selectedIds }: {
    onChange: (event: Event) => void;
    selectedIds?: string[];
}) {
    const eventIds = useAppSelector(selectEventIds);

    return(
        <div>
            <span className="block p-4 border-b-[1px] border-b-light-secondary">
                Assign an event
            </span>
            <ul className="p-2 w-[450px]">
                {eventIds.map(id => (
                    <EventsPopoutItem 
                        id={id}
                        onClick={onChange}
                        active={selectedIds ? selectedIds.includes(id) : undefined}
                        key={id}
                    />
                ))}
            </ul>
        </div>
    )
}

function EventsPopoutItem({ id, onClick, active: _active }: {
    id: string;
    onClick: (event: Event) => void;
    active?: boolean;
}) {
    const [active, setActive] = useState(_active);

    const event = useAppSelector(state => selectEventById(state, id));
    if(!event) return null;

    return(
        <li>
            <button 
                className="p-2 w-full flex gap-3 hover:bg-light-secondary transition-colors rounded"
                onClick={() => {
                    onClick(event);
                    if(active === undefined) return;
                    setActive(prev => !prev);
                }}
            >
                <div className="min-w-[30%] rounded overflow-hidden">
                    <Image 
                        width={100}
                        height={100}
                        src={getEventImage(event.id, event.image, event.timestamp)}
                        className="w-full aspect-video object-cover"
                        alt=""
                    />
                </div>
                <div className="flex flex-col text-left ">
                    <span className="font-semibold">
                        {event.title}
                    </span>
                    <span className="line-clamp-2 text-sm text-secondary">
                        {event.description}
                    </span>
                </div>
                {active && (
                    <span>
                        Active
                    </span>
                )}
            </button>
        </li>
    )
}