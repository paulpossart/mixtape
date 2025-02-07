import React, { useState } from "react";
import { fetchSongs } from "../../api/fetchSongs";
import { useSelector, useDispatch } from "react-redux";
import { setSearchType } from "../../redux/searchTypeSlice";
import { clearTrackList, setTrackList } from "../../redux/trackListSlice";
import { setSearchSubmitted } from "../../redux/searchSubmittedSlice";
import styles from './Searchbar.module.scss';
import buttons from '../../styles/buttons.module.scss';

function Searchbar({ className }) {
    const [userInput, setUserInput] = useState('');
    const [searchErrorMessage, setSearchErrorMessage] = useState(null);

    const searchType = useSelector((state) => state.searchType);
    const userId = useSelector((state) => state.userId);
    const authErrorMessage = useSelector((state) => state.authErrorMessage);
    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();

    let query;
    if (searchType === 'album') {
        query = `album:"${encodeURIComponent(userInput)}"`
    } else if (searchType === 'artist') {
        query = `artist:"${encodeURIComponent(userInput)}"`
    } else if (searchType === 'name') {
        query = `track:"${encodeURIComponent(userInput)}"`
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUserInput('');
        setSearchErrorMessage('');
        dispatch(setSearchSubmitted(false));
        dispatch(clearTrackList());

        if (!userId) {
            setSearchErrorMessage(<p>Please login!</p>);
            return;
        }
        if (!userInput) {
            setSearchErrorMessage(<p>Please enter a search query!</p>);
            return;
        }

        try {
            const returnedTracks = await fetchSongs(token, query);
            dispatch(setTrackList(returnedTracks));
            dispatch(setSearchSubmitted(true));
        } catch {
            setSearchErrorMessage(<p>Error fetching songs</p>);
        }
    }

    return (
        <div className={`${className} ${styles.div}`}>

            <p>{authErrorMessage && authErrorMessage}</p>
            <p>Welcome, <span className={styles.userName}>{userId || 'music lover'}</span>!</p>

            <form onSubmit={handleSubmit}>
                <input
                    className={styles.search}
                    id="searchbar"
                    type="search"
                    placeholder={`search by ${searchType}`}
                    value={userInput}
                    onChange={handleUserInput}
                />
                <br />

                <label htmlFor="radio-name">Search songs by:</label>
                <br />
                <input
                    className={styles.radio}
                    id="radio-name"
                    type="radio"
                    value="name"
                    checked={searchType === 'name'}
                    onChange={() => dispatch(setSearchType('name'))}
                />
                <label htmlFor="radio-name">name</label>

                <input
                    className={styles.radio}
                    id="radio-artist"
                    type="radio"
                    value="artist"
                    checked={searchType === 'artist'}
                    onChange={() => dispatch(setSearchType('artist'))}
                />
                <label htmlFor="radio-artist">artist</label>

                <input
                    className={styles.radio}
                    id="radio-album"
                    type="radio"
                    value="album"
                    checked={searchType === 'album'}
                    onChange={() => dispatch(setSearchType('album'))}
                />
                <label htmlFor="radio-album">album</label>

                <br />
                <button className={buttons.button1} type="submit">Search Spotify</button>
            </form>
            {searchErrorMessage && searchErrorMessage}
        </div>
    );
}

export default Searchbar;
