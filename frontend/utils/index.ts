import { Image } from "../../types";

export const getWeeklyDealImage = (id: string, date: string) => {
    const year = date.split('-').at(-1);
    const monthAndDay = date.split('-').reverse().slice(1).join('-');
    return `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/weekly-deals/${year}/${monthAndDay}/${id}.png`;
}
export const getEventImage = (eventId: string, imageId: string, timestamp: string) => {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const image = `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/events/${year}/${eventId}/${imageId}.png`;
    return image;
}
export const getBlogImage = (parentId: string, imageId: string) => (
    `${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/blog/${parentId}/${imageId}.png`
)
export const getDateFromString = (date: string) => new Date(date.split('-').reverse().join('-'));
export const getReadableDateFromTimestamp = (timestamp: string) => {
    const date = new Date(Number(timestamp));
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase();
    const string = `${date.getDate()} ${month}, ${date.getFullYear()}`;
    return string;
}

export const getImageDiff = (prevImages: Image[], currentImages: Image[]) => {
    const previousImages = prevImages || [];

    const prevImagePaths = previousImages.map(prev => prev.id);
    const currentImagePatns = currentImages.map(prev => prev.id);

    const addedImages = currentImages.filter(image => !prevImagePaths.includes(image.id));
    const removedImages = previousImages.filter(image => !currentImagePatns.includes(image.id));

    const prevImagePositions = previousImages.map(image => `${image.id}-${image.position}`);
    const changedPositions = currentImages.filter(image => `${image.id}-${image.position}` !== prevImagePositions[image.position]);

    return { addedImages, removedImages, changedPositions };
}
export const hasImageChanges = (prevImages: Image[], currentImages: Image[]) => {
    const { addedImages, removedImages, changedPositions } = getImageDiff(prevImages, currentImages);
    return !!(addedImages.length || removedImages.length || changedPositions.length);
}