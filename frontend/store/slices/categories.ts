import { createSelector, createSlice } from '@reduxjs/toolkit';
import { EventCategory } from '../../../types';
import { RootState } from '..';

const initialState: {
    categories: EventCategory[];
    loading: boolean;
} = {
    categories: [],
    loading: true,
}

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
            state.loading = false;
        },
        addCategory: (state, action) => {
            state.categories.unshift(action.payload);
        },
        removeCategory: (state, action) => {
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
        updateCategory: (state, action) => {
            state.categories = state.categories.map(category => {
                if(category.id !== action.payload.categoryId) {
                    return category;
                };
                return {
                    ...category,
                    ...action.payload.changes,
                }
            })
        },
    }
})

export const { setCategories, addCategory, removeCategory, updateCategory } = categoriesSlice.actions;

const selectId = (_:RootState, id: string) => id;

export const selectCategoriesLoading = (state: RootState) => state.categories.loading;
export const selectCategories = (state: RootState) => state.categories.categories;

export const selectcategoryById = createSelector(
    [selectCategories, selectId],
    (categories, categoryId) => categories.find(category => category.id === categoryId)
)

export default categoriesSlice.reducer;