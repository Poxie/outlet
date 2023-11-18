import { useRef, useState } from "react";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import Input from "@/components/input";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import Image from "next/image";
import { useModal } from "@/contexts/modal";
import { Event } from "../../../types";

export default function AddEventModal({ onEventAdd }: {
    onEventAdd?: (event: Event) => void;
}) {
    const { post } = useAuth();
    const { close } = useModal();

    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<{
        image: string | null;
        title: string;
        description: string;
    }>({
        image: null,
        title: '',
        description: '',
    });

    const image = useRef<HTMLInputElement>(null);

    const createEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if(loading) return;

        const { title, description, image } = event;
        const createdEvent = await post<Event>(`/events`, {
            title,
            description,
            image,
        });

        close();
        if(onEventAdd) onEventAdd(createdEvent);
    }

    const updateProperty = (property: keyof typeof event, value: string | File | null) => {
        if(value instanceof File) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(value);

            fileReader.onload = () => {
                const image = fileReader.result;
                if(!image) throw new Error('Error reading image.');
                if(typeof image !== 'string') throw new Error('Image was not read properly.');
                
                setEvent(prev => ({...prev, ...{ image }}));
            }
            return;
        }

        setEvent(prev => ({...prev, ...{
            [property]: value,
        }}))
    }

    return(
        <Modal>
            <ModalHeader>
                Create an event
            </ModalHeader>
            <form 
                className="p-4 flex flex-col gap-3"
                onSubmit={createEvent}
            >
                <div className="grid">
                    <span className="mb-0.5 block text-sm text-secondary">
                        Header image
                    </span>
                    <div className="flex items-start gap-1.5">
                        <button
                            type="button" 
                            className="flex items-center justify-center w-40 aspect-video overflow-hidden text-sm text-secondary bg-light-secondary border-[1px] border-light-tertiary rounded-md"
                            onClick={() => image.current?.click()}
                        >
                            {event.image ? (
                                <Image 
                                    width={200}
                                    height={100}
                                    src={event.image}
                                    alt="Event header image"
                                    className="w-full"
                                />
                            ) : (
                                <span>
                                    Upload an image
                                </span>
                            )}
                            <input
                                className="hidden" 
                                type="file" 
                                onChange={e => {
                                    if(!image.current) return;
                                    if(!e.target.files?.length) return updateProperty('image', null);
                                    updateProperty('image', e.target.files[0]);
                                    image.current.value = '';
                                }} 
                                ref={image} 
                            />
                        </button>
                        {event.image && (
                            <>
                            <button
                                type="button" 
                                className="p-2.5 rounded bg-light-secondary hover:bg-light-tertiary transition-colors border-[1px] border-light-tertiary text-xs text-primary"
                                onClick={() => image.current?.click()}
                            >
                                Change image
                            </button>
                            <button
                                type="button" 
                                className="p-2.5 rounded bg-light-secondary hover:bg-light-tertiary transition-colors border-[1px] border-light-tertiary text-xs text-c-primary"
                                onClick={() => updateProperty('image', null)}
                            >
                                Remove image
                            </button>
                            </>
                        )}
                    </div>
                </div>
                <div className="grid">
                    <span className="mb-0.5 block text-sm text-secondary">
                        Title
                    </span>
                    <Input 
                        placeholder={'Title...'}
                        onChange={title => updateProperty('title', title)}
                        value={event.title}
                    />
                </div>
                <div className="grid">
                    <span className="mb-0.5 block text-sm text-secondary">
                        Description
                    </span>
                    <Input 
                        placeholder={'Description...'}
                        onChange={description => updateProperty('description', description)}
                        value={event.description}
                        textArea
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        disabled={loading}
                    >
                        {!loading ? 'Create event' : 'Creating event...'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}