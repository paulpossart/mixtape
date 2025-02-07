import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { pushToPlaylist } from "../../redux/playlistSlice";
import styles from './SearchResults.module.scss';
import buttons from '../../styles/buttons.module.scss';

function SearchResults({ className }) {
    const trackList = useSelector((state) => state.trackList);
    const playlist = useSelector((state) => state.playlist);
    const searchSubmitted = useSelector((state) => state.searchSubmitted);
    const dispatch = useDispatch();

    const handleAddSong = (track) => {
        if (!playlist.find(item => item.id === track.id))
            dispatch(pushToPlaylist(track));
    }

    return (
        <div className={`${className} ${styles.main}`}>
            <h2>Search Results</h2>
            <div className={styles.container}>
                <div className={styles.results}>
                    {searchSubmitted && trackList.length === 0 ? <div className={styles.noResults}><p>No results</p></div> : (
                        trackList.map(track => (
                            <div className={styles.tracks} key={track.id}>
                                <img src={track.image_url} />
                                <div>
                                    <iframe className={styles.iframe}
                                        src={`https://open.spotify.com/embed/track/${track.id}`}
                                        allowfullscreen=""
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.addOrRemoveTrack}>
                                    <p>Add <i>{track.name}</i> to playlist?</p>
                                    <button className={buttons.button2} onClick={() => handleAddSong(track)}>Add</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
}

export default SearchResults;
