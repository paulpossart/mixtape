import React from "react";
import { useSelector, useDispatch } from "react-redux";

function Playlist({ className }) {
    const playlist = useSelector((state) => state.playlist);


    return (
        <div className={className}>
            <p>playlist</p>
            <p>{playlist.length}</p>
            {
                playlist.length !== 0 && playlist.map(song => (
                    <div key={song.id}>
                        <p>{song.name}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default Playlist;