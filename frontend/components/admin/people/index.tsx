"use client";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeUser, selectUsers, selectUsersLoading, setUsers } from "@/store/slices/users";
import Button from "@/components/button";
import { BinIcon } from "@/assets/icons/BinIcon";
import ConfirmModal from "@/modals/confirm";
import { useModal } from "@/contexts/modal";

export default function People() {
    const { get, _delete, currentUser } = useAuth();
    const { setModal } = useModal();

    const dispatch = useAppDispatch();

    const users = useAppSelector(selectUsers);
    const loading = useAppSelector(selectUsersLoading);

    useEffect(() => {
        if(!loading) return;
        
        get('/people').then(users => {
            dispatch(setUsers(users));
        });
    }, [loading]);

    const openRemoveModal = (userId: string) => {
        const onConfirm = () => dispatch(removeUser(userId));
        const confirmFunction = async () => {
            _delete<{}>(`/people/${userId}`);
        }
        setModal(
            <ConfirmModal 
                onConfirm={onConfirm}
                confirmFunction={confirmFunction}
                header={'Are you sure you want to delete this user?'}
                subHeader='All information associated with this user will be deleted and unretrievable. This action cannot be undone.'
                closeOnCancel
            />
        )
    }

    return(
        <div className="bg-light rounded-lg overflow-hidden">
            <AdminHeader 
                backPath="/admin"
                text="People"
                options={
                    <Button 
                        className="py-2.5 px-3 mr-1.5"
                        href={'/admin/people/add'}
                    >
                        Add person
                    </Button>
                }
            />
            {!loading ? (
                <ul>
                    {users.map(user => (
                        <li 
                            className="flex items-center justify-between px-4 py-3 border-b-[1px] border-b-light-secondary last-of-type:border-b-0"
                            key={user.id}
                        >
                            {user.username}

                            {user.id !== currentUser?.id ? (
                                <button 
                                    className="p-2 -m-2 text-c-primary rounded hover:bg-light-secondary/60 active:bg-light-secondary transition-colors"
                                    onClick={() => openRemoveModal(user.id)}
                                >
                                    <BinIcon className="w-5" />
                                </button>
                            ) : (
                                <span className="text-sm text-secondary">
                                    You
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                    Loading people...
                </span>
            )}
        </div>
    )
}