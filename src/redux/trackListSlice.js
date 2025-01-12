import { createSlice } from "@reduxjs/toolkit";

export const trackListSlice = createSlice({
    name: 'trackList',
    initialState: [],
    reducers: {
        setTrackList: (state, actions) => {
            return actions.payload;
        },
        clearTrackList: () => {
            return [];
        }
    }
});

export const {setTrackList, clearTrackList} = trackListSlice.actions;
export default trackListSlice.reducer;
