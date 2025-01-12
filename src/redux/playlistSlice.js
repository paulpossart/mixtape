import { createSlice } from "@reduxjs/toolkit";

const playlistSlice = createSlice({
    name: 'playlist',
    initialState: [],
    reducers: {
        pushToPlaylist: (state, action) => {
            console.log('pushing to playlist', action.payload);
            state.push(action.payload);
        },
        removeFromPlaylist: (state, action) => {
            return state.filter(item => item.id !== action.payload.id);
        },
        clearPlaylist: () => {
            return [];
        },
    }
});



export const { pushToPlaylist, removeFromPlaylist, clearPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
