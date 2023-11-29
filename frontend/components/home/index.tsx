import Events from './events';
import WeeklyDeals from './weekly-deals';

export default function Home() {
    return (
        <main className="py-8 w-main max-w-main mx-auto">
            <WeeklyDeals />
            <div className="my-6 block w-full h-[1px] bg-light" />
            <Events />
        </main>
    )
}
