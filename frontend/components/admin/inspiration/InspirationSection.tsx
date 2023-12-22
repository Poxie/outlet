import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { getReadableDateFromTimestamp } from '@/utils';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import InspirationOptions from './InspirationOptions';
import { BlogPost } from '../../../../types';

export default function InspirationSection({ header, headerIcon, posts, search }: {
    headerIcon: React.ReactNode;
    header: string;
    search: string;
    posts: BlogPost[];
}) {
    const [expanded, setExpanded] = useState(true);

    const toggleExpanded = () => setExpanded(prev => !prev);

    return(
        <>
        <tr 
            className="sticky top-[48px] text-left rounded-lg border-b-[1px] border-b-light-secondary bg-light hover:bg-light-secondary transition-colors"
            onClick={toggleExpanded}
        >
            <td className="px-4 py-[--spacing] font-bold">
                <div className="flex items-start gap-2">
                    <div className="mt-[.06rem]">
                        {headerIcon}
                    </div>
                    <div className="grid">
                        <span>
                            {header}
                        </span>
                        <span className="text-xs font-normal text-secondary">
                            {posts.length} posts {search && '(based on filters)'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="w-[50%] px-4 py-[--spacing] font-bold">
                Description
            </td>
            <td className="px-4 py-[--spacing] font-bold">
                Date
            </td>
            <td className="px-4 py-[--spacing]">
                <div className="flex justify-end">
                    <button 
                        className="p-1"
                        aria-label={expanded ? 'Hide posts' : 'Show posts'}
                    >
                        <ArrowIcon className={twMerge(
                            "w-4 rotate-90 transition-transform duration-200",
                            expanded && "rotate-180"
                        )} />
                    </button>
                </div>
            </td>
        </tr>
        {expanded && posts.map(post => (
            <tr 
                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0 h-0"
                key={post.id}
            >
                <td className="px-4 py-4">
                    <span style={{ wordBreak: 'break-word' }}>
                        {post.title}
                    </span>
                </td>
                <td className="px-4 py-4 text-secondary">
                    <span className="line-clamp-2" style={{ wordBreak: 'break-word' }}>
                        {post.description}
                    </span>
                </td>
                <td className="px-4 py-4 text-secondary">
                    {getReadableDateFromTimestamp(post.timestamp)}
                </td>
                <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                        <InspirationOptions 
                            isArchived={post.archived}
                            postId={post.id}
                        />
                    </div>
                </td>
            </tr>
        ))}
        </>
    )
}