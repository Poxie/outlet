export default function ModalHeader({ children, subHeader, className }: {
    children: React.ReactNode;
    subHeader?: React.ReactNode;
    className?: string;
}) {
    return(
        <div className="grid sticky top-0 py-3.5 px-4 bg-lig border-b-[1px] border-b-light-secondary">
            <span 
                className={className}
            >
                {children}
            </span>
            {subHeader && (
                <span className="mt-1 inline-block text-sm text-secondary">
                    {subHeader}
                </span>
            )}
        </div>
    )
}