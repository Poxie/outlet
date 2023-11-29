"use client";
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Button from "@/components/button";
import { useState, useEffect } from 'react';
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { addStore as _addStore, selectStoreById, updateStore } from "@/store/slices/stores";
import { Store } from "../../../../types";
import { InfoIcon } from "@/assets/icons/InfoIcon";
import { ClockIcon } from "@/assets/icons/ClockIcon";

const getDummyStore = () => ({
    name: '',
    address: '',
    weekdays: '',
    saturdays: '',
    sundays: '',
    email: undefined,
    phoneNumber: undefined, 
    instagram: undefined,
})

const compareStoreInfo = (prevStore: Partial<Store>, currentStore: Partial<Store>) => {
    const changes: {[prop: string]: Store[keyof Store]} = {};
    Object.entries(currentStore).forEach(([prop, val]) => {
        const key = prop as keyof Store;
        if(prevStore[key] !== val) changes[key] = val;
    });
    return changes;
}

const DEFAULT_WEEKDAY_HOURS = '10:00 - 20:00';
const DEFAULT_SATURDAY_HOURS = '10:00 - 18:00';
const DEFAULT_SUNDAY_HOURS = '11:00 - 17:00';
export default function AddStore({ params: { storeId } }: {
    params: { storeId: string };
}) {
    const { put, patch } = useAuth();
    const router = useRouter();

    const dispatch = useAppDispatch();

    const prevStore = useAppSelector(state => selectStoreById(state, storeId));

    const [storeInfo, setStoreInfo] = useState(prevStore || getDummyStore());
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);

    useEffect(() => {
        if(!prevStore) return;
        setStoreInfo(prevStore);
    }, [prevStore]);

    const isAddingStore = !prevStore;
    const changes = compareStoreInfo(prevStore || getDummyStore(), storeInfo);

    const addStore = async () => {
        const invalidProps = ['name', 'address'].filter(prop => !storeInfo[prop as keyof typeof storeInfo]);
        if(invalidProps.length) {
            const formatter = new Intl.ListFormat('default', { style: 'long', type: 'conjunction' });
            const formattedString = formatter.format(invalidProps)
            const firstLetterUppercase = formattedString.slice(0,1).toUpperCase() + formattedString.slice(1);
            return setFeedback({
                text: `${firstLetterUppercase} ${invalidProps.length > 1 ? 'are' : 'is'} required.`,
                type: 'danger',
            });
            return;
        }

        const timesAreInvalid = ['weekdays', 'saturdays', 'sundays'].filter(prop => !storeInfo[prop as keyof typeof storeInfo]);
        if(timesAreInvalid.length) {
            return setFeedback({
                text: `Store opening hours are required.`,
                type: 'danger',
            });
            return;
        }

        
        if(isAddingStore) {
            setLoading(true);
            const store = await put('/stores', storeInfo);
            dispatch(_addStore(store));
            router.replace('/admin/stores');
        } else {
            if(!Object.keys(changes).length) {
                setFeedback({
                    text: 'No changes have been made.',
                    type: 'danger',
                })
                return;
            }

            setLoading(true);

            const store = await patch(`/stores/${storeId}`, changes);
            dispatch(updateStore({ storeId, changes }));
            setFeedback({
                text: 'Store has been updated.',
                type: 'success',
            })
            setLoading(false);
        }
    }

    const updateProperty = (property: keyof typeof storeInfo, value: string) => {
        setFeedback(null);
        setStoreInfo(prev => ({...prev, ...{
            [property]: value,
        }}))
    }

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin/stores'}
                    text={isAddingStore ? 'Add store' : `Edit store: ${prevStore.name}`}
                />
                <div className="grid grid-cols-[1fr_1px_1fr]">
                    <div className="flex-1">
                        <div className="p-4 flex gap-1.5 border-b-[1px] border-b-light-secondary text-secondary">
                            <InfoIcon className="w-4 -mt-0.5" />
                            <span className="text-sm">
                                Store info
                            </span>
                        </div>
                        <div className="p-4 grid gap-3">
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store name
                                    {' '}
                                    <span className="text-c-primary">
                                        *
                                    </span>
                                </span>
                                <Input 
                                    placeholder={'Store name'}
                                    onChange={text => updateProperty('name', text)}
                                    value={storeInfo.name}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store address
                                    {' '}
                                    <span className="text-c-primary">
                                        *
                                    </span>
                                </span>
                                <Input 
                                    placeholder={'Store address'}
                                    onChange={text => updateProperty('address', text)}
                                    value={storeInfo.address}
                                    minHeight={80}
                                    textArea
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store phone number
                                </span>
                                <Input 
                                    placeholder={'Store phone number'}
                                    onChange={text => updateProperty('phoneNumber', text)}
                                    value={storeInfo.phoneNumber}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store email
                                </span>
                                <Input 
                                    placeholder={'Store email'}
                                    onChange={text => updateProperty('email', text)}
                                    value={storeInfo.email}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store instagram
                                </span>
                                <Input 
                                    placeholder={'Store instagram link'}
                                    onChange={text => updateProperty('instagram', text)}
                                    value={storeInfo.instagram}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch bg-light-secondary" />
                    <div className="flex-1">
                        <div className="p-4 flex gap-1.5 border-b-[1px] border-b-light-secondary text-secondary">
                            <ClockIcon className="w-4" />
                            <span className="text-sm">
                                Store opening hours
                            </span>
                        </div>
                        <div className="p-4 grid gap-3">
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Weekdays&apos;
                                    {' '}
                                    <span className="text-c-primary">
                                        *
                                    </span>
                                </span>
                                <Input 
                                    placeholder={'Weekdays\' opening hours'}
                                    onChange={text => updateProperty('weekdays', text)}
                                    value={storeInfo.weekdays}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Saturdays&apos;
                                    {' '}
                                    <span className="text-c-primary">
                                        *
                                    </span>
                                </span>
                                <Input 
                                    placeholder={'Saturdays\' opening hours'}
                                    onChange={text => updateProperty('saturdays', text)}
                                    value={storeInfo.saturdays}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Sundays&apos;
                                    {' '}
                                    <span className="text-c-primary">
                                        *
                                    </span>
                                </span>
                                <Input 
                                    placeholder={'Sundays\' opening hours'}
                                    onChange={text => updateProperty('sundays', text)}
                                    value={storeInfo.sundays}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {feedback && (
                    <span className={twMerge(
                        "block mx-4 mb-4 p-3 rounded-md text-sm border-[1px]",
                        feedback.type === 'danger' && 'bg-red-400/50 border-red-400',
                        feedback.type === 'success' && 'bg-green-300/50 border-green-300',
                    )}>
                        {feedback.text}
                    </span>
                )}
                <div className="p-4 bg-light-secondary flex justify-end">
                    <Button 
                        onClick={addStore}
                        disabled={loading}
                    >
                        {isAddingStore ? (
                            !loading ? 'Add store' : 'Adding store...'
                        ) : (
                            !loading ? 'Update store' : 'Updating store...'
                        )}
                    </Button>
                </div>
            </div>
        </main>
    )
}