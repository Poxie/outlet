import { createSlice } from '@reduxjs/toolkit';
import { Banner, WeeklyDeal } from '../../../types';
import { RootState } from '..';

const initialState: {
    banners: Banner[];
    loading: boolean;
} = {
    banners: [],
    loading: true,
}

export const bannersSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        setBanners: (state, action) => {
            state.banners = action.payload;
            state.loading = false;
        },
        addBanner: (state, action) => {
            state.banners.unshift(action.payload);
        },
    }
})

export const { setBanners, addBanner } = bannersSlice.actions;

export const selectBannersLoading = (state: RootState) => state.banners.loading;
export const selectBanners = (state: RootState) => state.banners.banners;

export default bannersSlice.reducer;