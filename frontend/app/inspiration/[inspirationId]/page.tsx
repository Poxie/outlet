import Inspiration from "@/components/inspiration/Inspiration";
import { BlogPost } from "../../../../types";
import { getBlogImage } from "@/utils";

const basePath = (inspirationId: string) => `${process.env.NEXT_PUBLIC_API_ENDPOINT}/inspiration/${inspirationId}`;
const opts = { next: { revalidate: 0 } };

export async function generateMetadata({ 
    params: { inspirationId },
    searchParams: { photo },
}: {
    params: { inspirationId: string };
    searchParams: { photo?: string };
}) {
    const res = await fetch(basePath(inspirationId), opts);
    const post = await res.json() as BlogPost;

    const title = `${post.title} - Åhlens Outlet`;
    const description = post.description;
    return {
        title,
        description,
        openGraph: {
            url: 
            title,
            description,
            images: photo ? [getBlogImage(post.id, photo)] : [],
        }
    }
}

export default Inspiration;