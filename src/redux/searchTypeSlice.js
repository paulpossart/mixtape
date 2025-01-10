import { createSlice } from "@reduxjs/toolkit";

const searchTypeSlice = createSlice({
    name: 'searchType',
    initialState: 'name',
    reducers: {
        setSearchType: (state, action) => {
            return action.payload;
        }
    }
});

export const {setSearchType} = searchTypeSlice.actions;
export default searchTypeSlice.reducer;