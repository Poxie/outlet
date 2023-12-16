"use client";
import React, { useEffect, useState } from "react";
import { User } from "../../../types";
import { useRouter } from "next/navigation";

const AuthContext = React.createContext<null | {
    currentUser: User | null;
    get: <T>(query: string) => Promise<T>;
    put: <T>(query: string, body?: Record<string, any>) => Promise<T>;
    post: <T>(query: string, body?: Record<string, any>) => Promise<T>;
    patch: <T>(query: string, body?: Record<string, any>) => Promise<T>;
    _delete: <T>(query: string, body?: Record<string, any>) => Promise<T>;
}>(null);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if(!context) throw new Error('Component is not wrapped in auth provider.');
    return context;
}

const isAuthError = (message: string) => message === 'Missing or invalid token.';

export default function AuthProvider({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null)

    const getToken = () => window.localStorage.getItem('token');

    useEffect(() => {
        get<User>(`/people/me`).then(setCurrentUser);
    }, []);

    async function request<T>(method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE', query: string, body?: Record<string, any>) {
        const token = getToken();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            method,
            body: method === 'GET' ? undefined : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })

        if(!res.ok) {
            const message = (await res.json()).message;
            if(isAuthError(message)) {
                router.replace('/admin/login');
                return;
            }
            throw new Error(message);
        }

        return await res.json() as T;
    }

    async function get<T>(query: string) {
        const data = await request('GET', query);
        return data as T;
    }
    async function put<T>(query: string, body?: Record<string, any>) {
        const data = await request('PUT', query, body);
        return data as T;
    }
    async function post<T>(query: string, body?: Record<string, any>) {
        const data = await request('POST', query, body);
        return data as T;
    }
    async function patch<T>(query: string, body?: Record<string, any>) {
        const data = await request('PATCH', query, body);
        return data as T;
    }
    async function _delete<T>(query: string, body?: Record<string, any>) {
        const data = await request('DELETE', query, body);
        return data as T;
    }

    const value = {
        get,
        put,
        post,
        patch,
        _delete,
        currentUser,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}