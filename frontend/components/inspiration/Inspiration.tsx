import { BlogPost } from "../../../types";
import InspirationPost from "./InspirationPost";

const getInspirationPost = async (inspirationId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/inspiration/${inspirationId}`, { next: { revalidate: 0 } });
    return await res.json() as BlogPost;
}

export default async function Inspiration({ params: { inspirationId } }: {
    params: { inspirationId: string }
}) {
    const post = await getInspirationPost(inspirationId);
    return(
        <main className="bg-light py-8">
            <div className="w-main max-w-main mx-auto">
                <InspirationPost 
                    {...post}
                    active={true}
                />
            </div>
        </main>
    )
}