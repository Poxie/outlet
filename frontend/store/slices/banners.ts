import { createSelector, createSlice } from '@reduxjs/toolkit';
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
        updateBanner: (state, action) => {
            state.banners = state.banners.map(banner => {
                if(banner.id !== action.payload.bannerId) {
                    return {
                        ...banner,
                        active: action.payload.changes.active ? false : banner.active,
                    }
                };
                return {
                    ...banner,
                    ...action.payload.changes,
                }
            })
        },
    }
})

export const { setBanners, addBanner, removeBanner, updateBanner } = bannersSlice.actions;

const selectId = (_:RootState, id: string) => id;

export const selectBannersLoading = (state: RootState) => state.banners.loading;
export const selectBanners = (state: RootState) => state.banners.banners;

export const selectBannerById = createSelector(
    [selectBanners, selectId],
    (banners, bannerId) => banners.find(banner => banner.id === bannerId)
)

export default bannersSlice.reducer;