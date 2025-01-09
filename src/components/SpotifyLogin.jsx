import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, clearToken } from "../redux/tokenSlice";
import { authorise, getTokenAndProfile } from "../api/apiCalls";

import { setuserId, clearUserId } from "../redux/userIdSlice";
import { setErrorMessage, clearErrorMessage } from "../redux/authErrorSlice";
import { setExpirationTime, clearExpirationTime } from "../redux/tokenExpirationTimeSlice";

function SpotifyLogin() {
    const userId = useSelector((state) => state.userId);
    const errorMessage = useSelector((state) => state.authErrorMessage)
    const dispatch = useDispatch();

    useEffect(() => {

        if (!userId) {
            const fetchUserData = async () => {
                const result = await getTokenAndProfile();

                if (result.error) {
                    dispatch(setErrorMessage(result.error));
                    dispatch(clearToken());
                    dispatch(clearExpirationTime());
                } else if (result.userId) {
                    dispatch(setuserId(result.userId));
                    dispatch(setToken(result.token));
                    dispatch(setExpirationTime(result.expirationTime));
                    dispatch(clearErrorMessage());
                }
            };

            fetchUserData();
        }
    }, [userId])

    const handleLogin = () => {
        authorise();
    }

    const handleLogout = () => {
        dispatch(clearUserId());
        dispatch(clearToken());
        dispatch(clearExpirationTime());
        dispatch(clearErrorMessage());


        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration_time');
        localStorage.removeItem('spotify_auth_state');

        window.location.href = '/';
    }

    return (
        <div>
            <p>Welcome, {userId || 'Guest'}</p>
            <p>{errorMessage}</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
}

export default SpotifyLogin;
