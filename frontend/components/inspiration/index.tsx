import { BlogPost } from "../../../types";
import InspirationPost from "./InspirationPost";

const getInspiration = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/inspiration`, { next: { revalidate: 0 } });
    return await res.json() as BlogPost[];
}

export default async function Inspiration() {
    const inspiration = await getInspiration();
    return(
        <main>
            <header className="bg-primary py-16 grid gap-4 text-center text-light">
                <h1 className="text-4xl uppercase font-extrabold">
                    Inspiration
                </h1>
                <p className="text-lg w-[660px] max-w-full mx-auto">
                    Här i vår inspirationsblogg visar vi upp nya fynd från varuhuset. Försäljning sker via våra varuhus, vi har tyvärr idag ingen möjlighet att sälja online.
                </p>
            </header>
            <div className="bg-light py-16">
                <div className="grid w-main max-w-main mx-auto">
                    {inspiration.map(post => (
                        <InspirationPost 
                            {...post}
                            key={post.id}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}