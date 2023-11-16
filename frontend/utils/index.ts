export const getWeeklyDealImage = (id: string, date: string) => {
    const year = date.split('-').at(-1);
    const monthAndDay = date.split('-').reverse().slice(1).join('-');
    return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/${year}/${monthAndDay}/${id}.png`;
}
export const getDateFromString = (date: string) => {
    const parts = date.split('-');
    return new Date(Number(parts.at(-1)), Number(parts.at(1)) - 1, Number(parts.at(0)));
}