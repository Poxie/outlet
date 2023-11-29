import { Store } from "../../../types";

const getMapsURL = (query: string, zoom?: number) => (
    `${process.env.GOOGLE_MAPS_BASE_URL}/search?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${query.replaceAll(' ', '+')}${zoom ? '&zoom=' + zoom : ''}`
)

const getStores = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/stores`, { next: { revalidate: 0 } });
    return await res.json() as Store[];
}
export default async function Stores() {
    const stores = await getStores();

    return(
        <main className="py-12 w-[800px] max-w-main mx-auto">
            <h1 className="mb-4 text-center text-4xl text-light-secondary font-semibold">
                Här hittar ni oss.
            </h1>
            <iframe 
                src={getMapsURL('Ahlens Outlet Sweden')}
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full aspect-[1.8/1] rounded-lg bg-light"
            />

            <div className="py-4 relative text-sm text-light font-semibold after:bg-light after:h-[1px] after:w-full after:absolute after:left-0 after:top-2/4 after:-translate-2/4">
                <span className="relative z-[2] bg-secondary pr-4">
                    Våra varuhus
                </span>
            </div>

            <ul className="grid gap-3">
                {stores.map(store => (
                    <li 
                        className="sm:flex justify-between bg-light rounded-lg overflow-hidden"
                        key={store.id}
                    >
                        <div className="p-6 flex flex-col">
                            <span className="text-xl text-c-primary uppercase font-semibold">
                                {store.name}
                            </span>
                            <pre className="mt-0.5 font-[inherit]">
                                {store.address}
                            </pre>
                            <span className="mt-3 mb-1 text-primary font-semibold text-sm">
                                Öppettider
                            </span>
                            <span className="text-sm text-secondary">
                                Vardagar {store.weekdays}
                            </span>
                            <span className="text-sm text-secondary">
                                Lördagar: {store.saturdays}
                            </span>
                            <span className="text-sm text-secondary">
                                Söndagar: {store.sundays}
                            </span>
                            <span className="mt-3 block text-sm">
                                Tel-nr: {store.phoneNumber || 'Saknas'}
                            </span>
                            <span className="text-sm text-secondary">
                                {store.email ? (
                                    <a
                                        href={`mailto:${store.email}`}
                                    >
                                        Maila {store.name}
                                    </a>
                                ) : (
                                    'Mail saknas.'
                                )}
                            </span>
                        </div>
                        <iframe 
                            loading="lazy"
                            src={getMapsURL(`Ahlens outlet ${store.name} ${store.address}`, 10)}
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full aspect-video sm:w-2/4 sm:aspect-[unset]"
                        />
                    </li>
                ))}
            </ul>
        </main>
    )
}