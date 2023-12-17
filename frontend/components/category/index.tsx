import { twMerge } from "tailwind-merge";
import { EventWithImages } from "../../../types";
import EventContainer from "../event/EventContainer";

const getEvents = async (categoryId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories/${categoryId}/children`, { next: { revalidate: 0 } });
    if(res.ok) {
        return await res.json() as EventWithImages[];
    }
    return null;
}

export default async function Category({ 
    params: { categoryId },
    searchParams: { photoId },
}: {
    params: { categoryId: string };
    searchParams: { photoId?: string };
}) {
    const events = await getEvents(categoryId);
    if(!events) {
        return(
            <main className="py-24 text-center text-light bg-primary">
                <h1 className="text-5xl font-black mb-3">
                    404: page not found.
                </h1>
                <p className="text-xl">
                    The page you were looking for has been moved or does not exist.
                </p>
            </main>
        )
    }

    return(
        <main className="w-main max-w-main mx-auto">
            {events.map((event, index) => (
                <EventContainer 
                    event={event}
                    photoId={photoId}
                    className={twMerge(
                        "py-8",
                        index !== 0 && 'border-t-[1px] border-t-light-secondary/50',
                    )}
                    key={event.id}
                />
            ))}
        </main>
    )
}