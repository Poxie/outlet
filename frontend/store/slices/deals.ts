import { createSlice } from '@reduxjs/toolkit';
import { Image } from '../../../types';

const initialState: {
    deals: {[date: string]: Image[] | undefined};
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
        addDeals: (state, action) => {
            const date = action.payload.date;
            const deals = action.payload.deals;
            state.deals[date] = state.deals[date]?.concat(deals);
        },
        removeDeals: (state, action) => {
            const date = action.payload.date;
            state.deals[date] = (state.deals[date] || []).filter(deal => !action.payload.ids.includes(deal.id));
        },
        editDeals: (state, action) => {
            const date = action.payload.date;
            const deals = action.payload.deals;
            state.deals[date] = deals;
        },
    }
})

export const { setDeals, addDeals, removeDeals, editDeals } = dealsSlice.actions;

export default dealsSlice.reducer;