import { createSelector, createSlice } from '@reduxjs/toolkit';
import { Event, Image } from '../../../types';
import { RootState, useAppSelector } from '..';

const initialState: {
    search: string;
    events: Event[];
    images: {[parentId: string]: Image[] | undefined};
    loading: boolean;
} = {
    search: '',
    events: [],
    images: {},
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
        },
        setEventImages: (state, action) => {
            state.images[action.payload.eventId] = action.payload.images;
        },
        addEventImages: (state, action) => {
            if(!state.images[action.payload.eventId]) {
                state.images[action.payload.eventId] = action.payload.images;
                return;
            }

            state.images[action.payload.eventId] = [...action.payload.images, ...(state.images[action.payload.eventId] || [])];
        },
        removeEventImages: (state, action) => {
            const eventId = action.payload.eventId;
            const ids = action.payload.ids;
            
            let newImages = state.images[eventId];
            if(!newImages) return;
            
            for(const id of ids) {
                const imageToRemove = state.images[eventId]?.find(image => image.id === id);
                if(!imageToRemove) continue;

                newImages = newImages
                    .filter(image => image.id !== id)
                    .map(image => {
                        if(image.position > imageToRemove.position) {
                            return {...image, position: image.position - 1};
                        }
                        return image;
                    })
            }

            state.images[eventId] = newImages;
        },
        updateEventImagesPosition: (state, action) => {
            const eventId = action.payload.eventId;
            const positions: {id: string, position: number}[] = action.payload.positions;
            
            state.images[eventId] = state.images[eventId]?.map(image => {
                const position = positions.find(i => i.id === image.id)?.position;
                if(position === undefined) return image;

                return {
                    ...image,
                    position,
                }
            })
        }
    }
})

export const { setEvents, addEvent, removeEvent, editEvent, setSearch, setEventImages, addEventImages, removeEventImages, updateEventImagesPosition } = eventsSlice.actions;

const selectId = (_:RootState, id: string) => id;

const selectEvents = (state: RootState) => state.events.events;
const selectEventImages = (state: RootState) => state.events.images;

export const selectEventIds = (state: RootState) => state.events.events.map(event => event.id);

export const selectEventsLoading = (state: RootState) => state.events.loading;
export const selectEventById = (state: RootState, eventId: string) => state.events.events.find(event => event.id === eventId);
export const selectEventImagesById = createSelector(
    [selectEventImages, selectId],
    (images, eventId) => images[eventId]?.toSorted((a,b) => a.position - b.position)
)

export const selectEventsByParent = createSelector(
    [selectEvents, selectId],
    (events, parentId) => events.filter(event => event.parentId === parentId).map(e => e.id)
)

export default eventsSlice.reducer;