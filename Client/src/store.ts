import { configureStore } from "@reduxjs/toolkit";
import {apiSlice} from './Slice/Api'
import  tableSlite  from "./Slice/auth";

export const store = configureStore({
    reducer:{
        auth: tableSlite,
        [apiSlice.reducerPath]:apiSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware),
    devTools:true

})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch