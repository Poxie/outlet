import { BlogPost } from "../../../types";
import InspirationPost from "./InspirationPost";

const getInspiration = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/inspiration`, { next: { revalidate: 0 } });
    return await res.json() as BlogPost[];
}

export default async function Inspiration() {
    const inspiration = await getInspiration();
    return(
        <>
        <header className="py-12 sm:py-12 flex flex-col gap-4 border-b-[1px] border-b-light-secondary">
            <div className="w-main max-w-main mx-auto">
                <h1 className="text-4xl font-extrabold mb-4">
                    Inspiration
                </h1>
                <p className="sm:w-3/4 text-secondary">
                    Här i vår inspirationsblogg visar vi upp nya fynd från varuhuset. Försäljning sker via våra varuhus, vi har tyvärr idag ingen möjlighet att sälja online.
                </p>
            </div>
        </header>
        <div className="py-12 sm:py-12">
            <div className="grid w-main max-w-main mx-auto">
                {inspiration.map(post => (
                    <InspirationPost 
                        {...post}
                        key={post.id}
                    />
                ))}
            </div>
        </div>
        </>
    )
}