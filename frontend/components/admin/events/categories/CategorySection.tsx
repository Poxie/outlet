import { ArrowIcon } from '@/assets/icons/ArrowIcon';
import { getReadableDateFromTimestamp } from '@/utils';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CategoryOptions from './CategoryOptions';
import { EventCategory } from '../../../../../types';

export default function CategorySection({ header, headerIcon, categories, search }: {
    headerIcon: React.ReactNode;
    header: string;
    search: string;
    categories: EventCategory[];
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
                            {categories.length} categories {search && '(based on filters)'}
                        </span>
                    </div>
                </div>
            </td>
            <td className="w-[50%] px-4 py-[--spacing] font-bold">
                Associated events
            </td>
            <td className="px-4 py-[--spacing]">
                <div className="flex justify-end">
                    <button 
                        className="p-1"
                        aria-label={expanded ? 'Hide items' : 'Show items'}
                    >
                        <ArrowIcon className={twMerge(
                            "w-4 rotate-90 transition-transform duration-200",
                            expanded && "rotate-180"
                        )} />
                    </button>
                </div>
            </td>
        </tr>
        {expanded && categories.map(category => (
            <tr 
                className="border-b-[1px] border-b-light-secondary/80 last:border-b-0 h-0"
                key={category.id}
            >
                <td className="px-4 py-4">
                    <span className="block text-base font-semibold">
                        {category.name}
                    </span>
                    {category.description && (
                        <span className="text-sm text-secondary">
                            {category.description}
                        </span>
                    )}
                </td>
                <td className="px-4 py-4 text-secondary">
                    <span className="line-clamp-2">
                        {category.eventCount} associated events
                    </span>
                </td>
                <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                        <CategoryOptions 
                            isArchived={category.archived}
                            categoryId={category.id}
                        />
                    </div>
                </td>
            </tr>
        ))}
        </>
    )
}