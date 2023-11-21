import { useRef, useState } from "react";
import { Event } from "../../../types";
import Image from "next/image";
import { usePopout } from "@/contexts/popout";
import { TimeSelector } from "@/components/time-selector";
import Input from "@/components/input";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import Button from "@/components/button";
import { getEventImage } from "@/utils";

export default function EventModalContent({ buttonText, buttonLoadingText, onSubmit, event, loading }: {
    loading: boolean;
    buttonText: string;
    buttonLoadingText: string;
    onSubmit: (eventInfo: Event, changes: Partial<Event>) => void;
    event?: Event;
}) {
    const { setPopout, close: closePopout } = usePopout();

    const [eventInfo, setEventInfo] = useState<Event>({
        id: event?.id || Math.random().toString(),
        title: event?.title || '',
        description: event?.description || '',
        image: event?.image || '',
        timestamp: event?.timestamp || new Date().getTime().toString(),
    })
    const [error, setError] = useState('');

    const imageInput = useRef<HTMLInputElement>(null);
    const openPopoutButton = useRef<HTMLButtonElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const invalidProps = Object.entries(eventInfo).filter(([property, value]) => !value);
        if(invalidProps.length) {
            const formatter = new Intl.ListFormat('default', { style: 'long', type: 'conjunction' });
            const formattedString = formatter.format(invalidProps.map(prop => prop[0]))
            const firstLetterUppercase = formattedString.slice(0,1).toUpperCase() + formattedString.slice(1);
            return setError(`${firstLetterUppercase} ${invalidProps.length > 1 ? 'are' : 'is'} required.`);
        }

        const changes: {[property: string]: Event[keyof Event]} = {};
        Object.keys(eventInfo).forEach(key => {
            if(!event) return;

            const property = key as keyof typeof eventInfo;
            if(event[property] !== eventInfo[property]) changes[property] = eventInfo[property];
        })
        if(!Object.keys(changes).length) return setError('No changes have been made.');

        onSubmit(eventInfo, changes);
    }
    const updateProperty = (property: keyof typeof eventInfo, value: string | File | null) => {
        setError('');

        if(value instanceof File) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(value);

            fileReader.onload = () => {
                const image = fileReader.result;
                if(!image) throw new Error('Error reading image.');
                if(typeof image !== 'string') throw new Error('Image was not read properly.');
                
                setEventInfo(prev => ({...prev, ...{ image }}));
            }
            return;
        }

        setEventInfo(prev => ({...prev, ...{
            [property]: value,
        }}))
    }
    const openTimeSelector = () => {
        const onChange = (date: Date | null) => {
            closePopout();
            if(!date) return updateProperty('timestamp', new Date().getTime().toString());
            updateProperty('timestamp', date.getTime().toString());
        }
        setPopout({
            popout: <TimeSelector onChange={onChange} />,
            ref: openPopoutButton,
        })
    }

    const date = new Date(Number(eventInfo.timestamp));
    return(
        <form 
            className="p-4 flex flex-col gap-3"
            onSubmit={handleSubmit}
        >
            <div className="grid">
                <span className="mb-0.5 block text-sm text-secondary">
                    Header image
                </span>
                <div className="flex items-start gap-1.5">
                    <button
                        type="button" 
                        className="flex items-center justify-center w-40 aspect-video overflow-hidden text-sm text-secondary bg-light-secondary border-[1px] border-light-tertiary rounded-md"
                        onClick={() => imageInput.current?.click()}
                    >
                        {eventInfo.image ? (
                            <Image 
                                width={200}
                                height={100}
                                src={eventInfo.image.startsWith('data') ? eventInfo.image : (
                                    event ? getEventImage(event.id, eventInfo?.image, eventInfo?.timestamp) : ''
                                )}
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
                                if(!imageInput.current) return;
                                if(!e.target.files?.length) return updateProperty('image', null);
                                updateProperty('image', e.target.files[0]);
                                imageInput.current.value = '';
                            }} 
                            ref={imageInput} 
                        />
                    </button>
                    {eventInfo.image && (
                        <>
                        <button
                            type="button" 
                            className="p-2.5 rounded bg-light-secondary hover:bg-light-tertiary transition-colors border-[1px] border-light-tertiary text-xs text-primary"
                            onClick={() => imageInput.current?.click()}
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
                    Event title
                </span>
                <Input 
                    placeholder={'Title...'}
                    onChange={title => updateProperty('title', title)}
                    value={eventInfo.title}
                />
            </div>
            <div className="grid">
                <span className="mb-0.5 block text-sm text-secondary">
                    Event description
                </span>
                <Input 
                    placeholder={'Description...'}
                    onChange={description => updateProperty('description', description)}
                    value={eventInfo.description}
                    textArea
                />
            </div>
            <div className="grid">
                <span className="mb-0.5 block text-sm text-secondary">
                    Event start
                </span>
                <div className="relative">
                    <button 
                        type="button"
                        className="p-3 flex items-center gap-1.5 bg-light-secondary border-[1px] border-light-tertiary rounded text-sm text-secondary"
                        onClick={openTimeSelector}
                        ref={openPopoutButton}
                    >
                        <ClockIcon className="w-4" />
                        {date.toLocaleDateString('default', { dateStyle: 'long' })}
                    </button>
                </div>
            </div>
            {error && (
                <span className="p-3 border-[1px] border-c-secondary/40 bg-secondary/30 rounded-md text-sm">
                    {error}
                </span>
            )}
            <div className="flex justify-end">
                <Button
                    disabled={loading}
                >
                    {!loading ? buttonText : buttonLoadingText}
                </Button>
            </div>
        </form>
    )
}