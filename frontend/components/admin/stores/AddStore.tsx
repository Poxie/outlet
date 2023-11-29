"use client";
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";

export default function AddStore() {
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
                                    onChange={console.log}
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
                                    onChange={console.log}
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
                                    onChange={console.log}
                                />
                            </div>
                            <div className="grid gap-1">
                                <span className="text-sm text-secondary">
                                    Store email
                                </span>
                                <Input 
                                    placeholder={'Store email'}
                                    onChange={console.log}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="self-stretch bg-light-secondary" />
                    <div className="flex-1">

                    </div>
                </div>
            </div>
        </main>
    )
}