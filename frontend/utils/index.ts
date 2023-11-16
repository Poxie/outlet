export const getWeeklyDealImage = (id: string, date: string) => {
    const year = date.split('-').at(-1);
    const monthAndDay = date.split('-').reverse().slice(1).join('-');
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/${year}/${monthAndDay}/${id}.png`;
}