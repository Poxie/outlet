export default function NotFound() {
    return(
        <div className="max-w-main mx-auto flex-1 flex gap-4 flex-col items-center justify-center text-light text-center">
            <h1 className="text-4xl font-semibold">
                404 page not found
            </h1>
            <p className="text-xl font-medium">
                The page you are looking for has been moved or did never exist.
            </p>
        </div>
    )
}