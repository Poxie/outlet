"use client";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectUsers, selectUsersLoading, setUsers } from "@/store/slices/users";

export default function People() {
    const { get } = useAuth();

    const dispatch = useAppDispatch();

    const users = useAppSelector(selectUsers);
    const loading = useAppSelector(selectUsersLoading);

    useEffect(() => {
        if(!loading) return;
        
        get('/people').then(users => {
            dispatch(setUsers(users));
        }).catch(console.error)
    }, [loading]);

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath="/admin"
                    text="People"
                />
                {!loading ? (
                    users.map(user => (
                        <div key={user.id}>
                            {user.username}
                        </div>
                    ))
                ) : (
                    <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                        Loading people...
                    </span>
                )}
            </div>
        </main>
    )
}