import { apiSlice } from "../Api";

export const tableApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        Check: build.mutation({
            query: (data) => ({
                url: 'order',
                method: "POST",
                body: data
            })
            
        }),
        CheckTable:build.mutation({
            query:(data)=>({
                url:"confirm",
                method:"POST",
                body:data
            })
        }),
        GetAllMenu:build.mutation({
            query:()=>({
                url: "allMenu",
                method:"GET",
            })
        }),
        makeOrder:build.mutation({
            query:(data)=>({
                url:"makeOrder",
                method:"POST",
                body:data
            })
        })
    })
})

export const {useGetAllMenuMutation,useMakeOrderMutation ,useCheckMutation,useCheckTableMutation } = tableApiSlice