import React, { useEffect, useState } from "react";
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
    const [is500, setIs500] = useState(true);

    const token = useSelector((state) => state.token);
    const playlist = useSelector((state) => state.playlist);
    const userId = useSelector((state) => state.userId);
    const dispatch = useDispatch();

    const isHeightPlus500px = () => window.innerHeight > 500;

    useEffect(() => {

        setIs500(isHeightPlus500px())

        const handleResize = () => {
            setIs500(isHeightPlus500px())
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    const handleRemoveTrack = (track) => {
        dispatch(removeFromPlaylist(track))
    }

    const handleRemoveAll = () => {
        setPlaylistMessage(null);
        dispatch(clearPlaylist());
    }

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    }

    const handleRename = (e) => {
        setPlaylistMessage(null);
        e.preventDefault();
        if (userInput.length !== 0) {
            setPlaylistName(userInput);
            setUserInput('')
        } else {
            setPlaylistName('Your Playlist');
        }
    }

    const handleSaveToSpotify = async () => {
        setPlaylistMessage(null);
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

    const handlePlayAll = () => {
        if (!listId) {
            setPlaylistMessage(<p>Create a playlist first!</p>);
            return;
        }
        setIframe(
            <div className={styles.iframeContainer}>
                <div className={styles.iframeCard}>
                    {!is500 ? (
                        <div className={styles.not500}>
                            Sorry, your screen is not large enough to display this content
                        </div>
                    ) : (
                        <iframe
                            className={styles.playlistIframe}
                            title="Spotify Embed: Recommendation Playlist "
                            src={`https://open.spotify.com/embed/playlist/${listId}?utm_source=generator&theme=0`}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    )}
                </div>
                <div className={styles.iframeFooter}>
                    <button className={buttons.button2} onClick={() => { setIframe(null) }}>Go back</button>
                </div>
            </div>
        )

    }

    return (
        <>
            <>
                {iframe && iframe}
            </>
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
                {playlistMessage && playlistMessage}
                <div className={styles.btns}>
                    <button className={buttons.button2} onClick={handleRemoveAll}>Remove All</button>
                    <button className={buttons.button1} onClick={handleSaveToSpotify}>Save To Spotify</button>
                    <button className={buttons.button2} onClick={handlePlayAll}>Play All</button>
                </div>

            </div>
        </>
    );
}

export default Playlist;