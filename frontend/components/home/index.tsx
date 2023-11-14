import Events from './events';
import Temp from './temp';
import WeeklyDeals from './weekly-deals';

export default function Home() {
    return (
        <main>
            <WeeklyDeals />
            <Events />
            {/* <Temp /> */}
        </main>
    )
}
