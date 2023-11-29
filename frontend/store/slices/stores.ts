import { createSlice } from '@reduxjs/toolkit';
import { Store } from '../../../types';
import { RootState } from '..';

const initialState: {
    stores: Store[]
    loading: boolean;
} = {
    stores: [],
    loading: true,
}

export const storesSlice = createSlice({
    name: 'deals',
    initialState,
    reducers: {
        setStores: (state, action) => {
            state.stores = action.payload;
            state.loading = false;
        },
        addStore: (state, action) => {
            state.stores = [...[action.payload], ...state.stores];
        },
        removeStore: (state, action) => {
            state.stores = state.stores.filter(store => store.id !== action.payload);
        },
    }
})

export const { setStores, addStore, removeStore } = storesSlice.actions;

export const selectStoresLoading = (state: RootState) => state.stores.loading;
export const selectStores = (state: RootState) => state.stores.stores;

export default storesSlice.reducer;