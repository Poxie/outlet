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
    active: boolean;
    images?: Image[];
}
export type Image = {
    id: string;
    eventId: string;
    image: string;
}