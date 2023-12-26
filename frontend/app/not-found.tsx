export default function NotFound() {
    return(
        <div className="w-full flex-1 flex gap-4 flex-col items-center justify-center bg-secondary text-light text-center">
            <h1 className="text-4xl font-semibold">
                404 page not found
            </h1>
            <p className="max-w-main text-xl font-medium">
                The page you are looking for has been moved or did never exist.
            </p>
        </div>
    )
}