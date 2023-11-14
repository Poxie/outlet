export type WeeklyDeal = {
    id: string;
    image: string;
}
export type Event = {
    id: string;
    title: string;
    description: string;
    image: string;
    active: boolean;
}
export type Image = {
    id: string;
    eventId: string;
    image: string;
}