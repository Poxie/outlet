"use client";
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useState } from 'react';
import Button from "@/components/button";

const DEFAULT_WEEKDAY_HOURS = '10:00 - 20:00';
const DEFAULT_SATURDAY_HOURS = '10:00 - 18:00';
const DEFAULT_SUNDAY_HOURS = '11:00 - 17:00';
export default function AddStore() {
    const [storeInfo, setStoreInfo] = useState({
        name: '',
        address: '',
        phoneNumber: '', 
        email: '',
        weekdays: '',
        saturdays: '',
        sundays: '',
    })
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);

    const updateProperty = (property: keyof typeof storeInfo, value: string) => {
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
                    text={'Add store'}
                />
                <div className="grid grid-cols-[1fr_1px_1fr]">
                    <div className="flex-1">
                        <div className="p-4 flex border-b-[1px] border-b-light-secondary">
                            <span className="text-sm text-secondary">
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
                        </div>
                    </div>
                    <div className="self-stretch bg-light-secondary" />
                    <div className="flex-1">
                        <div className="p-4 flex border-b-[1px] border-b-light-secondary">
                            <span className="text-sm text-secondary">
                                Store opening hours
                            </span>
                        </div>
                        <div className="p-4 grid gap-3">
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Weekdays
                                </span>
                                <Input 
                                    placeholder={'Weekdays opening hours'}
                                    onChange={text => updateProperty('weekdays', text)}
                                    value={storeInfo.weekdays}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Saturdays
                                </span>
                                <Input 
                                    placeholder={'Saturdays opening hours'}
                                    onChange={text => updateProperty('saturdays', text)}
                                    value={storeInfo.saturdays}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Sundays
                                </span>
                                <Input 
                                    placeholder={'Sundays opening hours'}
                                    onChange={text => updateProperty('sundays', text)}
                                    value={storeInfo.sundays}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-light-secondary flex justify-end">
                    <Button>
                        Add store
                    </Button>
                </div>
            </div>
        </main>
    )
}