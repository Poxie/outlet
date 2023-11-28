import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Event, Image } from '../../../types';
import { RootState, useAppSelector } from '..';

const initialState: {
    search: string;
    events: Event[];
    images: Image[];
    loading: boolean;
} = {
    search: '',
    events: [],
    images: [],
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

const selectId = (_:RootState, id: string) => id;

const selectEvents = (state: RootState) => state.events.events;
const selectEventImages = (state: RootState) => state.events.images;

export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventById = (state: RootState, eventId: string) => state.events.events.find(event => event.id === eventId);
export const selectEventImagesById = createSelector(
    [selectEventImages, selectId],
    (images, eventId) => images.filter(image => image.parentId === eventId)
)

export default eventsSlice.reducer;