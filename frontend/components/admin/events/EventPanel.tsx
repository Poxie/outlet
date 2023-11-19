import Button from "@/components/button";
import Input from "@/components/input";
import { useEvents } from ".";
import AddEventModal from "@/modals/add-event";
import { useModal } from "@/contexts/modal";

export default function EventPanel() {
    const { setModal } = useModal();
    const { addEvent, search, setSearch } = useEvents();

    const openAddEventModal = () => setModal(
        <AddEventModal 
            onEventAdd={addEvent}
        />
    )

    return(
        <div className="p-4 flex items-center justify-between rounded-lg bg-light shadow-centered mb-[2px]">
            <Input 
                className="px-2 py-2 w-[300px] max-w-full"
                placeholder={'Search'}
                onChange={setSearch}
                value={search}
            />
            <Button 
                onClick={openAddEventModal}
                className="p-3"
            >
                Create event
            </Button>
        </div>
    )
}