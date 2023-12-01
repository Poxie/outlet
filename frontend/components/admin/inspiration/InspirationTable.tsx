"use client";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { BlogPost } from "../../../../types";
import InspirationSection from "./InspirationSection";
import { ArchiveIcon } from "@/assets/icons/ArchiveIcon";
import { MegaphoneIcon } from "@/assets/icons/MegaphoneIcon";

export default function InspirationTable() {
    const posts: BlogPost[] = [];
    const loading = false;
    const search = '';

    const activePosts = posts.filter(event => (
        !event.archived &&
        Number(event.timestamp) <= new Date().getTime()
    ))
    const scheduledPosts = posts.filter(event => (
        !event.archived &&
        Number(event.timestamp) > new Date().getTime()
    ))
    const archivedPosts = posts.filter(event => event.archived);

    return(
        !loading ? (
            <div>
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
            </div>
        ) : (
            <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                Loading posts...
            </span>
        )
    )
}