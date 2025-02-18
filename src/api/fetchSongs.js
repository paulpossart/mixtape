export async function fetchSongs(token, query) {

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=track&limit=10`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const error = await response.json();
        console.log(`Error fetching songs: `, JSON.stringify(error));
        return;
    }

    const data = await response.json();
    const trackObjects = data.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        uri: track.uri,
        image_url:
            track.album.images[1] ? track.album.images[1].url :
                    track.album.images[0] ? track.album.images[0].url :
                        '../../src/assets/spotify-color-svgrepo-com.svg',

    }));

    return trackObjects;
}
