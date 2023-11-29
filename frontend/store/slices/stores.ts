import { createSelector, createSlice } from '@reduxjs/toolkit';
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
        updateStore: (state, action) => {
            state.stores = state.stores.map(store => {
                if(store.id !== action.payload.storeId) return store;
                return {
                    ...store,
                    ...action.payload.changes,
                }
            })
        }
    }
})

export const { setStores, addStore, removeStore, updateStore } = storesSlice.actions;

const selectId = (_:RootState, id: string) => id;

export const selectStoresLoading = (state: RootState) => state.stores.loading;
export const selectStores = (state: RootState) => state.stores.stores;

export const selectStoreById = createSelector(
    [selectStores, selectId],
    (stores, storeId) => stores.find(store => store.id === storeId)
)

export default storesSlice.reducer;