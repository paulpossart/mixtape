export async function fetchSongs(token, query) {
    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); 

        if (!response.ok) {
            return {error: 'Error fetching songs.'}
        }

        const data = await response.json();
        const trackObjects = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            uri: track.uri,
            preview_url: track.preview_url,
            image_url: 
                track.album.images[1] ? track.album.images[1].url : 
                track.album.images[2] ? track.album.images[2].url :
                track.album.images[0] ? track.album.images[0].url :
                '../../src/assets/spotify-color-svgrepo-com.svg',
                
        }));

        return {success: trackObjects}

    } catch (error) {
        return {error: `Error fetching songs: ${error}`}
    };
}
