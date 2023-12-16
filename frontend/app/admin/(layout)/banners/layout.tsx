"use client";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectBannersLoading, setBanners } from "@/store/slices/banners";
import { Banner } from '../../../../types';

export default function BannersLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectBannersLoading);

    useEffect(() => {
        if(!loading) return;

        get<Banner[]>('/banners').then(banners => {
            dispatch(setBanners(banners));
        })
    }, [loading]);

    return children;
}