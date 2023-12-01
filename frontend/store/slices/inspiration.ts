import { createSelector, createSlice } from '@reduxjs/toolkit';
import { BlogPost } from '../../../types';
import { RootState } from '..';

const initialState: {
    posts: BlogPost[];
    loading: boolean;
} = {
    posts: [],
    loading: true,
}

export const inspirationSlice = createSlice({
    name: 'inspiration',
    initialState,
    reducers: {
        setInspiration: (state, action) => {
            state.posts = action.payload;
            state.loading = false;
        },
        addInspiration: (state, action) => {
            state.posts.unshift(action.payload);
        },
    }
})

export const { setInspiration, addInspiration } = inspirationSlice.actions;

const selectId = (_:RootState, id: string) => id;

export const selectInspirationLoading = (state: RootState) => state.inspiration.loading;
export const selectInspirationPosts = (state: RootState) => state.inspiration.posts;

export default inspirationSlice.reducer;