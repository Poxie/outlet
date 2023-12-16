import { createSelector, createSlice } from '@reduxjs/toolkit';
import { User } from '../../../types';
import { RootState } from '..';

const initialState: {
    users: User[]
    loading: boolean;
} = {
    users: [],
    loading: true,
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
            state.loading = false;
        },
        addUser: (state, action) => {
            state.users = [...[action.payload], ...state.users];
        },
        removeUser: (state, action) => {
            state.users = state.users.filter(user => user.id !== action.payload);
        },
        updateUser: (state, action) => {
            state.users = state.users.map(user => {
                if(user.id !== action.payload.userId) return user;
                return {
                    ...user,
                    ...action.payload.changes,
                }
            })
        },
    }
})

export const { setUsers, addUser, removeUser, updateUser } = usersSlice.actions;

const selectId = (_:RootState, id: string) => id;
export const selectUsers = (state: RootState) => state.users.users;

export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUserIds = (state: RootState) => state.users.users.map(user => user.id);
export const selectUserById = createSelector(
    [selectUsers, selectId],
    (users, userId) => users.find(user => user.id === userId),
)

export default usersSlice.reducer;