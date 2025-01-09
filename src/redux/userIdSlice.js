import { createSlice } from "@reduxjs/toolkit";

const userIdSlice = createSlice({
    name: 'userId',
    initialState: '',
    reducers: {
        setuserId: (state, action) => {
            return action.payload
        },
        clearUserId: (state, action) => {
           return '';
        }
    }
});

export const {setuserId, clearUserId} = userIdSlice.actions;
export default userIdSlice.reducer;
