import { configureStore } from "@reduxjs/toolkit";
import tokenSliceReducer from './tokenSlice';
import authErrorSliceReducer from './authErrorSlice';
import tokenExpirationTimeSliceReducer from './tokenExpirationTimeSlice';
import userIdSliceReducer from './userIdSlice';

const store = configureStore({
    reducer: {
        token: tokenSliceReducer,
        tokenExpirationTime: tokenExpirationTimeSliceReducer,
        userId: userIdSliceReducer,
        authErrorMessage: authErrorSliceReducer,
    }
});

export default store;
