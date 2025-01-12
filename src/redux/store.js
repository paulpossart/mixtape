import { configureStore } from "@reduxjs/toolkit";
import tokenSliceReducer from './tokenSlice';
import authErrorSliceReducer from './authErrorSlice';
import tokenExpirationTimeSliceReducer from './tokenExpirationTimeSlice';
import userIdSliceReducer from './userIdSlice';
import searchTypeSliceReducer from './searchTypeSlice';
import trackListSliceReducer from './trackListSlice';
import searchSubmittedSliceReducer from './searchSubmittedSlice';
import playlistSliceReducer from './playlistSlice';

const store = configureStore({
    reducer: {
        token: tokenSliceReducer,
        tokenExpirationTime: tokenExpirationTimeSliceReducer,
        userId: userIdSliceReducer,
        authErrorMessage: authErrorSliceReducer,
        searchType: searchTypeSliceReducer,
        trackList: trackListSliceReducer,
        searchSubmitted: searchSubmittedSliceReducer,
        playlist: playlistSliceReducer,
    }
});

export default store;