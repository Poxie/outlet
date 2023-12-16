"use client";
import { useEffect } from 'react';
import { useAuth } from "@/contexts/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { setDeals } from "@/store/slices/deals";
import { WeeklyDeal } from "../../../../types";

export default function WeeklyDealsLayout({ children }: {
    children: React.ReactNode;
}) {
    const { get } = useAuth();

    const dispatch = useAppDispatch();
    const loading = useAppSelector(state => state.deals.loading);

    useEffect(() => {
        if(!loading) return;
        get<WeeklyDeal[]>('/weekly-deals/all').then(deals => dispatch(setDeals(deals)));
    }, [loading]);

    return children;
}