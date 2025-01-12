import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromPlaylist, clearPlaylist } from "../redux/playlistSlice";
import { createPlaylist } from "../api/saveToSpotify";
import styles from './Playlist.module.scss';
import buttons from '../styles/buttons.module.scss';

function Playlist({ className }) {
    const [userInput, setUserInput] = useState('');
    const [playlistName, setPlaylistName] = useState('Your Playlist');
    const [playlistMessage, setPlaylistMessage] = useState(null);
    const [listId, setListId] = useState(null)
    const [iframe, setIframe] = useState(null)

    const token = useSelector((state) => state.token);
    const playlist = useSelector((state) => state.playlist);
    const userId = useSelector((state) => state.userId);
    const dispatch = useDispatch();

    const handleRemoveTrack = (track) => {
        dispatch(removeFromPlaylist(track))
    }

    const handleRemoveAll = () => {
        dispatch(clearPlaylist());
    }

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    }

    const handleRename = (e) => {
        e.preventDefault();
        if (userInput.length !== 0) {
            setPlaylistName(userInput);
            setUserInput('')
        } else {
            setPlaylistName('Your Playlist');
        }
    }

    const handleSaveToSpotify = async () => {
        setPlaylistMessage('');
        if (!userId) {
            setPlaylistMessage(<p>Please sign in!</p>);
            return;
        }

        if (playlist.length === 0) {
            setPlaylistMessage(<p>Please add some songs!</p>);
            return;
        }
        try {
            setListId(await createPlaylist(token, userId, playlistName, playlist));
            setPlaylistMessage(<p>Playlist creation successful!</p>)
        } catch {
            setPlaylistMessage(<p>Playlist creation unsuccessful</p>)
        }
    }
    console.log(listId)
    const handlePlayAll = () => {
        setPlaylistMessage(<p>This feature is not ready yet!</p>);
        
        /*if (!listId) {
            setPlaylistMessage(<p>Create a playlist first!</p>);
            return;
        }
        setIframe(<iframe
            title="Spotify Embed: Recommendation Playlist "
            src={`https://open.spotify.com/embed/playlist/${listId}?utm_source=generator&theme=0`}
            width="100%"
            height="100%"
            style={{ minHeight: '360px' }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
        />)*/
        //button to resetIframe, ie 'go back'
    }

    return (
        <div className={`${className} ${styles.div}`}>
            <h2>{playlistName}</h2>
            <form className={styles.renamePlaylist} onSubmit={handleRename}>
                <input
                    id="playlist-title"
                    type="text"
                    placeholder="rename playlist"
                    value={userInput}
                    onChange={handleUserInput}
                />
                <br />
                <button className={buttons.button2} type="submit">Rename</button>
            </form>
            <div className={styles.container}>
                <div className={styles.results}>
                    {playlist.length !== 0 && playlist.map(track => (
                        <div className={styles.tracks} key={track.id}>
                            <img src={track.image_url} />
                            <div>
                                <iframe className={styles.iframe}
                                    src={`https://open.spotify.com/embed/track/${track.id}`}
                                    allowtransparency="true"
                                    allow="encrypted-media"
                                />
                            </div>
                            <div className={styles.addOrRemoveTrack}>
                                <p>Remove <i>{track.name}</i> from playlist?</p>
                                <button className={buttons.button2} onClick={() => handleRemoveTrack(track)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            <div className={styles.btns}>
                <button className={buttons.button2} onClick={handleRemoveAll}>Remove All</button>
                <button className={buttons.button1} onClick={handleSaveToSpotify}>Save To Spotify</button>
                <button className={buttons.button2} onClick={handlePlayAll}>Play All</button>
            </div>
            {playlistMessage && playlistMessage}
            {iframe && iframe}
        </div>
    );
}

export default Playlist;