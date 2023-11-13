import Temp from './temp';
import WeeklyDeals from './weekly-deals';

export default function Home() {
    return (
        <main className="flex items-center justify-center">
            <WeeklyDeals />
            {/* <Temp /> */}
        </main>
    )
}
