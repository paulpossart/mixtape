import { createSlice } from "@reduxjs/toolkit";

const tokenExpirationTimeSlice = createSlice({
    name: 'tokenExpirationTime',
    initialState: null,
    reducers: {
        setExpirationTime: (state, action) => {
            return action.payload
        },
        clearExpirationTime: (state, action) => {
            return null;        }
    }
});

export const {setExpirationTime, clearExpirationTime} = tokenExpirationTimeSlice.actions;
export default tokenExpirationTimeSlice.reducer;