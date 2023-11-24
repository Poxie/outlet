import { createSlice } from '@reduxjs/toolkit';
import { Event } from '../../../types';

const initialState: {
    events: Event[];
    loading: boolean;
} = {
    events: [],
    loading: true,
}

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
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

export const { setEvents, addEvent, removeEvent, editEvent } = eventsSlice.actions;

export default eventsSlice.reducer;