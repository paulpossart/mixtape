import React from "react";
import { useSelector } from "react-redux";

function SearchResults({ className }) {
    const trackList = useSelector((state) => state.trackList)
    return <div className={className}>
        <h3>search results</h3>
        {trackList.length === 0 ? <p>No results</p>
            : (trackList.map(track => (
                <div key={track.id}>
                    <h4>{track.name}</h4>
                    <p>{track.artist} | <i>{track.album}</i></p>
                    <img src={track.image_url} />
                </div>
            )))}

    </div>
}

export default SearchResults;