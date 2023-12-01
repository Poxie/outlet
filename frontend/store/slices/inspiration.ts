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
        editInspiration: (state, action) => {
            state.posts = state.posts.map(post => {
                if(post.id !== action.payload.inspirationId) return post;
                return {
                    ...post,
                    ...action.payload.changes,
                }
            })
        }
    }
})

export const { setInspiration, addInspiration, editInspiration } = inspirationSlice.actions;

const selectId = (_:RootState, id: string) => id;

export const selectInspirationLoading = (state: RootState) => state.inspiration.loading;
export const selectInspirationPosts = (state: RootState) => state.inspiration.posts;

export const selectInspirationById = createSelector(
    [selectInspirationPosts, selectId],
    (posts, postId) => posts.find(post => post.id === postId)
)

export default inspirationSlice.reducer;