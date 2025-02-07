import { createSlice } from "@reduxjs/toolkit";

const authErrorSlice = createSlice({
    name: 'authErrorMessage',
    initialState: '',
    reducers: {
        setErrorMessage: (state, action) => {
            return action.payload
        },
        clearErrorMessage: () => {
            return '';        }
    }
});

export const {setErrorMessage, clearErrorMessage} = authErrorSlice.actions;
export default authErrorSlice.reducer;
