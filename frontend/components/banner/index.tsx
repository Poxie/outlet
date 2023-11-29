import { Banner as BannerType } from "../../../types";

const getActiveBanner = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/banner`, { next: { revalidate: 0 } });
    const banner = await res.json();
    return banner as BannerType | Object;
}

export default async function Banner() {
    const banner = await getActiveBanner();
    if(!('text' in banner)) return null;

    return(
        <span className="py-4 block text-center text-sm text-light font-semibold bg-primary">
            {banner.text}
        </span>
    )
}