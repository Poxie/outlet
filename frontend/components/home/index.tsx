import Temp from './temp';
import WeeklyDeals from './weekly-deals';

export default function Home() {
    return (
        <main className="h-[100vh] flex items-center justify-center">
            <WeeklyDeals />
            <Temp />
        </main>
    )
}
