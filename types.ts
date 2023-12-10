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
    archived: boolean;
    parentId: string | null;
}
export type EventWithImages = Event & {
    images: Image[];
}
export type EventCategory = {
    id: string;
    name: string;
    description: string | null;
    timestamp: string;
    archived: boolean;
    eventCount: number;
}
export type Image = {
    id: string;
    image: string;
    parentId: string;
    timestamp: string;
    position: number;
}
export type Store = {
    id: string;
    name: string;
    address: string;
    weekdays: string;
    saturdays: string;
    sundays: string;
    addedAt: string;
    phoneNumber: string | undefined;
    email: string | undefined;
    instagram: string | undefined;
}
export type Banner = {
    id: string;
    text: string;
    createdAt: string;
    active: boolean;
}
export type BlogPost = {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    images: Image[];
    archived: boolean;
}