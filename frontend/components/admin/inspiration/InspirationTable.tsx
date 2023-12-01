import { ClockIcon } from "@/assets/icons/ClockIcon";
import InspirationSection from "./InspirationSection";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";
import { useAppSelector } from "@/store";
import { selectInspirationPosts } from "@/store/slices/inspiration";

export default function InspirationTable() {
    const posts = useAppSelector(selectInspirationPosts);

    const search = '';

    const activePosts = posts.filter(post => (
        !post.archived &&
        Number(post.timestamp) <= new Date().getTime()
    ))
    const scheduledPosts = posts.filter(post => (
        !post.archived &&
        Number(post.timestamp) > new Date().getTime()
    ))
    const archivedPosts = posts.filter(post => post.archived);

    return(
        <table className="[--spacing:.75rem] w-full text-sm border-spacing-2">
            <tbody>
                <InspirationSection 
                    header={'Active posts'}
                    headerIcon={<MegaphoneIcon className="w-4" />}
                    posts={activePosts}
                    search={search}
                />
                <InspirationSection
                    header={'Scheduled posts'}
                    headerIcon={<ClockIcon className="w-4" />}
                    posts={scheduledPosts}
                    search={search}
                />
                <InspirationSection
                    header={'Archived posts'}
                    headerIcon={<ArchiveIcon className="w-4" />}
                    posts={archivedPosts}
                    search={search}
                />
            </tbody>
        </table>
    )
}