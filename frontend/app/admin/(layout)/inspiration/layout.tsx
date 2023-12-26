"use client";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectInspirationLoading, setInspiration } from "@/store/slices/inspiration";
import { BlogPost } from '../../../../../types';

export default function InspirationLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectInspirationLoading);

    useEffect(() => {
        if(!loading) return;
        get<BlogPost[]>(`/inspiration/all`).then(posts => dispatch(setInspiration(posts)));
    }, [loading]);

    
    return children;
}