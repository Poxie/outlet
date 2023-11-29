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
        removeBanner: (state, action) => {
            state.banners = state.banners.filter(banner => banner.id !== action.payload);
        },
    }
})

export const { setBanners, addBanner, removeBanner } = bannersSlice.actions;

export const selectBannersLoading = (state: RootState) => state.banners.loading;
export const selectBanners = (state: RootState) => state.banners.banners;

export default bannersSlice.reducer;