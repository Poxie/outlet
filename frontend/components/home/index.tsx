import Events from './events';
import WeeklyDeals from './weekly-deals';

export default function Home() {
    return (
        <main>
            <WeeklyDeals />
            <Events />
        </main>
    )
}
