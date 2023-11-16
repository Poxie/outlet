"use client";
import React from "react";

const AuthContext = React.createContext<null | {
    get: <T>(query: string) => Promise<T>;
    post: <T>(query: string, body?: Record<string, any>) => Promise<T>;
    _delete: <T>(query: string, body?: Record<string, any>) => Promise<T>;
}>(null);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if(!context) throw new Error('Component is not wrapped in auth provider.');
    return context;
}

export default function AuthProvider({ children }: {
    children: React.ReactNode;
}) {
    async function request<T>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', query: string, body?: Record<string, any>) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${query}`, {
            method,
            body: method === 'GET' ? undefined : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if(!res.ok) throw new Error((await res.json()).message);
        return await res.json() as T;
    }

    async function get<T>(query: string) {
        const data = await request('GET', query);
        return data as T;
    }
    async function post<T>(query: string, body?: Record<string, any>) {
        const data = await request('POST', query, body);
        return data as T;
    }
    async function _delete<T>(query: string, body?: Record<string, any>) {
        const data = await request('DELETE', query, body);
        return data as T;
    }

    const value = {
        get,
        post,
        _delete,
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}