import eventsReducer from "./slices/events";
import dealsReducer from "./slices/deals";
import storesReducer from "./slices/stores";
import bannersReducer from "./slices/banners";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        events: eventsReducer,
        deals: dealsReducer,
        stores: storesReducer,
        banners: bannersReducer,
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector