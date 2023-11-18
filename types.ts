export type WeeklyDeal = {
    id: string;
    image: string;
    date: string;
    timestamp: string;
}
export type Event = {
    id: string;
    title: string;
    description: string;
    image: string;
    timestamp: string;
}
export type Image = {
    id: string;
    eventId: string;
    image: string;
}