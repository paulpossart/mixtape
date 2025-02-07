import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, clearToken } from "../../redux/tokenSlice.js";
import { authorise, getToken, getUser } from "../../api/login.js";
import { setuserId, clearUserId } from "../../redux/userIdSlice.js";
import { setErrorMessage, clearErrorMessage } from "../../redux/authErrorSlice.js";

import buttons from '../../styles/buttons.module.scss';

function SpotifyLogin({className}) {
    const token = useSelector((state) => state.token)
    const dispatch = useDispatch();
    const codeVerifier = localStorage.getItem('code_verifier');

    useEffect(() => {
        try {
            if (token) {
                getProfile(token);
            } else if (codeVerifier) {
                authenticate();
            }
        } catch {
            dispatch(setErrorMessage(`Failed to authorise account`));
        }
    }, [token]);

    const getProfile = async (accessToken) => {
        try {
            const userData = await getUser(accessToken);
            if (userData) {
                dispatch(setuserId(userData.id));
            }
        } catch {
            dispatch(setErrorMessage(`Failed to get profile data.`));
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
            dispatch(setErrorMessage(`Failed to authorise account`));
        }
    }

    const handleLogout = () => {
        dispatch(clearUserId());
        dispatch(clearToken());
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
                <button className={buttons.button1} onClick={handleLogin}><span className={className}>Spotify</span> Login</button>
            ) : (
                <button className={buttons.button1} onClick={handleLogout}>Log Out</button>
            )}


        </div>
    );
}

export default SpotifyLogin;
