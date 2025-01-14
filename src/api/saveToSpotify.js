export async function createPlaylist(token, userId, playlistName, playlist) {
    const playlistId = await namePlaylist(token, userId, playlistName);
    const listId = await addTracksToPlaylist(token, playlistId, playlist);
    return listId;
}

async function namePlaylist(token, userId, playlistName) {

    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: playlistName,
            public: false,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.log(`namePlaylist failed: ${error}`);
    }

    const data = await response.json();
    return data.id;
}

async function addTracksToPlaylist(token, playlistId, playlist) {
    const trackUris = playlist.map(track => track.uri);

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uris: trackUris,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.log(`FaddTracksToPlaylist failed: ${error}`);
    }

    return playlistId;
}