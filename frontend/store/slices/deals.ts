import { createSlice } from '@reduxjs/toolkit';
import { WeeklyDeal } from '../../../types';

const initialState: {
    deals: {[date: string]: WeeklyDeal[]};
    loading: boolean;
} = {
    deals: {},
    loading: true,
}

export const dealsSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        setDeals: (state, action) => {
            state.deals = action.payload;
            state.loading = false;
        },
        addDeal: (state, action) => {
            state.deals[action.payload.date].unshift(action.payload.deal);
        },
        removeDeal: (state, action) => {
            const date = action.payload.date;
            state.deals[date] = state.deals[date].filter(deal => deal.id !== action.payload.dealId);
        },
        editDeal: (state, action) => {
            const date = action.payload.date;
            state.deals[date] = state.deals[date].map(deal => {
                if(deal.id !== action.payload.dealId) return deal;
                return {...deal, ...action.payload.changes};
            });
        }
    }
})

export const { setDeals, addDeal, removeDeal, editDeal } = dealsSlice.actions;

export default dealsSlice.reducer;