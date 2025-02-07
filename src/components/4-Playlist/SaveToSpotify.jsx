import React from "react";
import { useSelector } from "react-redux";
import { createPlaylist } from "../../api/saveToSpotify";
import buttons from '../../styles/buttons.module.scss';

function SaveToSpotify({ playlistName, setPlaylistMessage, setListId }) {
    const token = useSelector((state) => state.token);
    const playlist = useSelector((state) => state.playlist);
    const userId = useSelector((state) => state.userId);
    
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


    return (
        <button className={buttons.button1} onClick={handleSaveToSpotify}>Save To Spotify</button>
    );
}

export default SaveToSpotify;
