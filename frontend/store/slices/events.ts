import { createSlice } from '@reduxjs/toolkit';
import { Event } from '../../../types';
import { RootState } from '..';

const initialState: {
    search: string;
    events: Event[];
    loading: boolean;
} = {
    search: '',
    events: [],
    loading: true,
}

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setEvents: (state, action) => {
            state.events = action.payload;
            state.loading = false;
        },
        addEvent: (state, action) => {
            state.events.unshift(action.payload);
        },
        removeEvent: (state, action) => {
            state.events = state.events.filter(event => event.id !== action.payload);
        },
        editEvent: (state, action) => {
            state.events = state.events.map(event => {
                if(event.id !== action.payload.eventId) return event;
                return {...event, ...action.payload.changes};
            })
        }
    }
})

export const { setEvents, addEvent, removeEvent, editEvent, setSearch } = eventsSlice.actions;

export const selectEventById = (state: RootState, eventId: string) => state.events.events.find(event => event.id === eventId);

export default eventsSlice.reducer;