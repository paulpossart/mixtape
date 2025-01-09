import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken, clearToken } from "../redux/tokenSlice";
import { authorise, getTokenAndProfile } from "../api/apiCalls";

import { setuserId, clearUserId } from "../redux/userIdSlice";
import { setErrorMessage, clearErrorMessage } from "../redux/authErrorSlice";
import { setExpirationTime, clearExpirationTime } from "../redux/tokenExpirationTimeSlice";

import styles from '../styles/buttons.module.scss';

function SpotifyLogin() {
    const userId = useSelector((state) => state.userId);
    const errorMessage = useSelector((state) => state.authErrorMessage);
    const token = useSelector((state) => state.token)
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
    }, [userId, window.location.href])

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

        window.location = '/';
    }

    return (
        <div>
            {!token ? (
                <button className={styles.button1} onClick={handleLogin}>Spotify Login</button>
            ) : (
                <button className={styles.button1} onClick={handleLogout}>Log Out</button>
            )}

            
        </div>
    );
}

export default SpotifyLogin;
