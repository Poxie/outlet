export default function ModalHeader({ children }: {
    children: React.ReactNode;
}) {
    return(
        <div className="py-3.5 px-4 border-b-[1px] border-b-light-secondary">
            {children}
        </div>
    )
}