import WeeklyDeals from "@/components/weekly-deals";
import { Metadata } from "next";

const title = 'Veckans deal - Åhlens Outlet';
const description = 'Här är denna veckas specialerbjudanden! Gäller till och med söndag. Erbjudanden kan skilja mellan varuhusen. Risk för utsäljning!'
export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        images: [`${process.env.NEXT_PUBLIC_API_ENDPOINT}/weekly-deals/image.png`],
    }
}

export default WeeklyDeals;