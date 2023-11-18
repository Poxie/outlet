export const getWeeklyDealImage = (id: string, date: string) => {
    const year = date.split('-').at(-1);
    const monthAndDay = date.split('-').reverse().slice(1).join('-');
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/${year}/${monthAndDay}/${id}.png`;
}
export const getEventImage = (eventId: string, imageId: string, timestamp: string) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const image = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/events/${year}/${eventId}/${imageId}.png`;
    return image;
}
export const getDateFromString = (date: string) => {
    const parts = date.split('-');
    return new Date(Number(parts.at(-1)), Number(parts.at(1)) - 1, Number(parts.at(0)));
}
export const getReadableDateFromTimestamp = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const string = `${date.getDate()} ${month}, ${date.getFullYear()}`;
    return string;
}