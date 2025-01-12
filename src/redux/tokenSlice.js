import { createSlice } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
    name: 'token',
    initialState: null,
    reducers: {
        setToken: (state, action) => {
            return action.payload
        },
        clearToken: () => {
            return null;
        }
    }
});

export const {setToken, clearToken} = tokenSlice.actions;
export default tokenSlice.reducer;
