import { createSlice } from "@reduxjs/toolkit";

const searchSubmittedSlice = createSlice({
    name: 'searchSubmitted',
    initialState: false,
    reducers: {
        setSearchSubmitted: (state, action) => {
            return action.payload;
        }
    }
});

export const {setSearchSubmitted} = searchSubmittedSlice.actions;
export default searchSubmittedSlice.reducer;
