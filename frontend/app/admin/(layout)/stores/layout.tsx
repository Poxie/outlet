"use client";
import { useAuth } from '@/contexts/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectStoresLoading, setStores } from '@/store/slices/stores';
import { useEffect } from 'react';
import { Store } from '../../../../types';

export default function StoresLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectStoresLoading);

    useEffect(() => {
        if(!loading) return;
        
        get<Store[]>('/stores').then(stores => {
            dispatch(setStores(stores));
        })
    }, [loading]);

    return children;
}