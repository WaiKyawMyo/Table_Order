import { createSlice } from "@reduxjs/toolkit"

interface AuthState {
    table:any
}

const initialState:AuthState={
    table:localStorage.getItem("table")? JSON.parse(localStorage.getItem("table")as string):null
}

export const tableSlite = createSlice({
    name:"table",
    initialState,
    reducers:{
        setTableInfo:(state,action)=>{
            state.table= action.payload
            localStorage.setItem('table',JSON.stringify(action.payload))
        },
        ClearTableInfo:(state)=>{
            state.table= null
            localStorage.removeItem('table')
        }
    }
})
export const {setTableInfo,ClearTableInfo}= tableSlite.actions
export default tableSlite.reducer