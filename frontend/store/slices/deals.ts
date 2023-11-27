import { createSlice } from '@reduxjs/toolkit';
import { WeeklyDeal } from '../../../types';

const initialState: {
    deals: {[date: string]: WeeklyDeal[] | undefined};
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
            const deals = state.deals[action.payload.date];
            if(!deals) {
                state.deals[action.payload.date] = [action.payload];
                return;
            }

            deals.unshift(action.payload);
        },
        removeDeal: (state, action) => {
            const date = action.payload.date;
            state.deals[date] = (state.deals[date] || []).filter(deal => deal.id !== action.payload.dealId);
        },
        editDeal: (state, action) => {
            const date = action.payload.date;
            state.deals[date] = (state.deals[date] || []).map(deal => {
                if(deal.id !== action.payload.dealId) return deal;
                return {...deal, ...action.payload.changes};
            });
        }
    }
})

export const { setDeals, addDeal, removeDeal, editDeal } = dealsSlice.actions;

export default dealsSlice.reducer;