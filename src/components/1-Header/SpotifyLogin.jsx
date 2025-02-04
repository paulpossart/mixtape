import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, clearToken } from "../../redux/tokenSlice.js";
import { authorise, /**/ getToken, getUser /**/ /*getTokenAndProfile*/ } from "../../api/login.js";

import { setuserId, clearUserId } from "../../redux/userIdSlice.js";
import { setErrorMessage, clearErrorMessage } from "../../redux/authErrorSlice.js";
import { setExpirationTime, clearExpirationTime } from "../../redux/tokenExpirationTimeSlice.js";

import buttons from '../../styles/buttons.module.scss';

function SpotifyLogin() {
    const userId = useSelector((state) => state.userId);
    const token = useSelector((state) => state.token)
    const dispatch = useDispatch();
    const codeVerifier = localStorage.getItem('code_verifier');

    useEffect(() => {
        if (token) {
            getProfile(token);
        } else if (codeVerifier) {
            authenticate();
        }
    }, [token, dispatch]);

    const getProfile = async (accessToken) => {
        const userData = await getUser(accessToken);
        if (userData) {
            dispatch(setuserId(userData.id));
        }
    }

    const authenticate = async () => {
        const tokenData = await getToken();
        if (tokenData) {
            dispatch(setToken(tokenData))
            const userData = await getUser(tokenData);
            dispatch(setuserId(userData.id));

            const newUrl = `${window.location.origin}${window.location.pathname}`;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    const handleLogin = () => {
        try {
            authorise();
        } catch {
            console.log('failed to authorise')
        }
    }

    const handleLogout = () => {
        dispatch(clearUserId());
        dispatch(clearToken());
        dispatch(clearExpirationTime());
        dispatch(clearErrorMessage());

        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration_time');
        localStorage.removeItem('spotify_auth_state');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('code_verifier');
        

        window.location = '/';
    }

    return (
        <div>
            {!token ? (
                <button className={buttons.button1} onClick={handleLogin}>Spotify Login</button>
            ) : (
                <button className={buttons.button1} onClick={handleLogout}>Log Out</button>
            )}


        </div>
    );
}

export default SpotifyLogin;


/*===================================
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
     }, [userId, dispatch])
 
     ======================================*/