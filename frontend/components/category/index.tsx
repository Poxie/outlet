import { EventWithImages } from "../../../types";
import EventContainer from "../event/EventContainer";

const getEvents = async (categoryId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/categories/${categoryId}/children`, { next: { revalidate: 0 } });
    return await res.json() as EventWithImages[];
}

export default async function Category({ params: { categoryId } }: {
    params: { categoryId: string };
}) {
    const events = await getEvents(categoryId);
    return(
        <main className="w-main max-w-main mx-auto">
            {events.map(event => (
                <EventContainer 
                    event={event}
                    className="py-8"
                />
            ))}
        </main>
    )
}