"use client";
import Button from "@/components/button";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectStores, selectStoresLoading, removeStore as _removeStore } from "@/store/slices/stores";
import { EditIcon } from "@/assets/icons/EditIcon";
import { BinIcon } from "@/assets/icons/BinIcon";
import { useAuth } from "@/contexts/auth";
import { useModal } from "@/contexts/modal";
import ConfirmModal from "@/modals/confirm";

export default function Stores() {
    const { _delete } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();

    const loading = useAppSelector(selectStoresLoading);
    const stores = useAppSelector(selectStores);

    const removeStore = async (storeId: string) => {
        const confirmFunction = async () => _delete(`/stores/${storeId}`);
        const onConfirm = () => dispatch(_removeStore(storeId));

        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={'Are you sure you want to remove this store?'}
                subHeader={'Removing this store will remove it permanently. This cannot be undone.'}
                confirmLoadingText={'Removing store...'}
                confirmText={'Remove store'}
                closeOnCancel
            />
        )
    }

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath={'/admin'}
                    text={'Stores'}
                    options={
                        <Button 
                            className="py-2.5 px-3 mr-1.5"
                            href={'/admin/stores/add'}
                        >
                            Add store
                        </Button>
                    }
                />
                {!loading ? (
                    <>
                    <ul>
                        {stores.map(store => (
                            <li 
                                className="px-4 py-2 grid items-center grid-cols-[1fr_4fr_1fr] border-b-[1px] border-b-light-secondary"
                                key={store.id}
                            >
                                <span className="uppercase text-c-primary font-semibold">
                                    {store.name}
                                </span>
                                <span className="text-sm text-secondary">
                                    {store.address}
                                </span>
                                <div className="flex justify-end">
                                    <Link 
                                        href={`/admin/stores/${store.id}`}
                                        className="p-2 block rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                                    >
                                        <EditIcon className="w-4" />
                                    </Link>
                                    <button 
                                        className="p-2 text-c-primary rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                                        onClick={() => removeStore(store.id)}
                                    >
                                        <BinIcon className="w-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="m-4">
                        <Link 
                            className="py-4 block text-center w-full border-[1px] border-light-tertiary rounded-md hover:bg-light-secondary transition-colors"
                            href={'/admin/stores/add'}
                        >
                            Add store
                        </Link>
                    </div>
                    </>
                ) : (
                    <span className="py-12 block text-center text-secondary">
                        Loading stores...
                    </span>
                )}
            </div>
        </main>
    )
}