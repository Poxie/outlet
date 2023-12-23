import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { BlogPost } from "../../../types";
import InspirationPost from "./InspirationPost";
import Link from "next/link";

const getInspirationPost = async (inspirationId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/inspiration/${inspirationId}`, { next: { revalidate: 0 } });
    return await res.json() as BlogPost;
}

export default async function Inspiration({ 
    params: { inspirationId },
    searchParams: { photo },
}: {
    params: { inspirationId: string };
    searchParams: { photo?: string };
}) {
    const post = await getInspirationPost(inspirationId);
    return(
        <>
        <div className="py-4 mb-4 bg-light border-b-[1px] border-b-light-secondary">
            <div className="w-main max-w-main mx-auto flex">
                <Link 
                    className="p-2 -m-2 flex items-center gap-2 hover:bg-light-secondary/60 active:bg-light-secondary transition-colors rounded"
                    href={'/inspiration'}
                >
                    <ArrowIcon className="-ml-0.5 w-4 -rotate-90" />
                    Inspiration / {post.title}
                </Link>
            </div>
        </div>
        <div className="w-main max-w-main mx-auto pb-8">
            <InspirationPost 
                {...post}
                activePhotoId={photo}
                active={true}
            />
        </div>
        </>
    )
}