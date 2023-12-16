"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useState } from 'react';
import { AuthResponse } from "../../../../types";
import Feedback from "@/components/feedback";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<null | {
        text: string;
        type: 'success' | 'danger';
    }>(null);
    const [info, setInfo] = useState({
        username: '',
        password: '',
    });

    const update = (prop: keyof typeof info, value: string) => {
        setInfo(prev => ({
            ...prev,
            [prop]: value,
        }))
        setFeedback(null);
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { username, password } = info;
        
        if(!username) {
            setFeedback({
                text: 'Username is required.',
                type: 'danger',
            })
            return;
        }
        if(!password) {
            setFeedback({
                text: 'Password is required.',
                type: 'danger',
            })
            return;
        }

        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(!res.ok) {
            const message = (await res.json()).message;
            setFeedback({
                text: message,
                type: 'danger',
            })
            setLoading(false);
            return;
        }
        
        const data = await res.json() as AuthResponse;
        window.localStorage.setItem('token', data.token);
        window.location.href = '/admin';
    }

    return(
        <main className="py-8">
            <h1 className="mb-2 text-center text-4xl font-bold text-light">
                Admin login
            </h1>
            <form 
                className="mx-auto p-4 w-[600px] max-w-main grid gap-2 bg-light rounded-lg"
                onSubmit={onSubmit}
            >
                <Input 
                    placeholder={'Username'}
                    onChange={text => update('username', text)}
                />
                <Input 
                    placeholder={'Password'}
                    onChange={text => update('password', text)}
                    type='password'
                />
                {feedback && (
                    <Feedback 
                        className="mb-2 mx-0"
                        {...feedback}
                    />
                )}
                <Button>
                    {!loading ? 'Sign in' : 'Signing in...'}
                </Button>
            </form>
        </main>
    )
}