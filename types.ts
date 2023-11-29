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
}
export type Image = {
    id: string;
    parentId: string;
    timestamp: string;
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
}
export type Banner = {
    id: string;
    text: string;
    createdAt: string;
}