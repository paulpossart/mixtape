import React, { useEffect, useState } from "react";
import styles from './Playlist.module.scss';
import buttons from '../../styles/buttons.module.scss';

function PlayAll({ playlistName, setPlaylistMessage, listId }) {
    const [iframe, setIframe] = useState(null)
    const [is500, setIs500] = useState(true);

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
                            title={`Spotify Playlist Embed: ${playlistName}`}
                            src={`https://open.spotify.com/embed/playlist/${listId}?utm_source=generator&theme=0`}
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    )}
                </div>
                <div className={styles.iframeFooter}>
                    <button className={buttons.button2} onClick={() => { setIframe(null) }}>Close</button>
                </div>
            </div>
        )

    }

    return (
        <>
            {iframe && iframe}
            <button className={buttons.button2} onClick={handlePlayAll}>Play All</button>
        </>
    );
}

export default PlayAll;
