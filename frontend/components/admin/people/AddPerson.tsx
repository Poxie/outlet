"use client";;
import Input from "@/components/input";
import AdminHeader from "../AdminHeader";
import AdminTabs from "../AdminTabs";
import { useState } from "react";
import Button from "@/components/button";
import Feedback from "@/components/feedback";
import { useAuth } from "@/contexts/auth";
import { AuthResponse } from "../../../../types";
import { addUser, selectUsersLoading } from "@/store/slices/users";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/navigation";

export default function AddPerson() {
    const { post } = useAuth();
    const router = useRouter();

    const dispatch = useAppDispatch();
    const loadingUsers = useAppSelector(selectUsersLoading);

    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    const [info, setInfo] = useState({
        username: '',
        password: '',
        repeatedPassword: '',
    })

    const update = (prop: keyof typeof info, value: string) => {
        setInfo(prev => ({
            ...prev,
            [prop]: value,
        }))
        setFeedback(null);
    }

    const onSubmit = async () => {
        const { username, password, repeatedPassword } = info;
        
        if(!username) {
            setFeedback({
                text: 'Username is required',
                type: 'danger',
            })
            return;
        }
        if(!password) {
            setFeedback({
                text: 'Password is required',
                type: 'danger',
            })
            return;
        }
        if(!repeatedPassword) {
            setFeedback({
                text: 'Repeated password is required',
                type: 'danger',
            })
            return;
        }
        if(password !== repeatedPassword) {
            setFeedback({
                text: 'Passwords don\'t match.',
                type: 'danger',
            })
            return;
        }

        setLoading(true);
        post<AuthResponse>('/people', { username, password })
            .then(data => {
                dispatch(addUser(data.user));
                router.replace('/admin/people');
            })
            .catch(error => {
                setFeedback({
                    text: error.message,
                    type: 'danger',
                })
                setLoading(false);
            })

    }

    return(
        <main className="py-8 w-main max-w-main mx-auto">
            <AdminTabs />
            <div className="bg-light rounded-lg overflow-hidden">
                <AdminHeader 
                    backPath="/admin/people"
                    text="People / Add person"
                />
                {!loadingUsers ? (
                    <>
                    <div className="p-4 grid gap-2">
                        <Input 
                            placeholder="Username"
                            onChange={text => update('username', text)}
                        />
                        <Input  
                            type="password"
                            placeholder="Password"
                            onChange={text => update('password', text)}
                        />
                        <Input  
                            type="password"
                            placeholder="Repeat password"
                            onChange={text => update('repeatedPassword', text)}
                        />
                    </div>
                    {feedback && (
                        <Feedback 
                            {...feedback}
                            className="mb-4"
                        />
                    )}
                    <div className="p-4 flex justify-end gap-2 bg-light-secondary">
                        <Button
                            onClick={onSubmit}
                            disabled={loading}
                        >
                            {!loading ? 'Add person': 'Adding person...'}
                        </Button>
                    </div>
                    </>
                ) : (
                    <span className="py-24 flex-1 flex items-center justify-center text-secondary/80">
                        Loading people...
                    </span>
                )}
            </div>
        </main>
    )
}