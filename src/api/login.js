const clientId = 'e9dcfcba91d74f3aa912153e71f0cd1d';
const redirectUri = 'https://my-mixtape.netlify.app/';  //'http://localhost:5173/';
const stateKey = 'spotify_auth_state';

export async function authorise() {

    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    const state = generateRandomString(16);
    localStorage.setItem(stateKey, state);

    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';

    let url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUri);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
}

export async function getTokenAndProfile() {

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    const expiresIn = params.get('expires_in');
    const returnedState = params.get('state');
    const storedState = localStorage.getItem(stateKey);
    const expirationTime = new Date().getTime() + expiresIn * 1000;

    if (!token || !expiresIn) {
        const savedToken = localStorage.getItem('access_token');
        const savedExpirationTime = localStorage.getItem('token_expiration_time');

        if (savedToken && savedExpirationTime) {
            const currentTime = new Date().getTime();

            if (currentTime < savedExpirationTime) {
                window.location.hash = '';
                return getProfile(savedToken, savedExpirationTime);
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expiration_time');
                return { error: 'Session has expired. Please log in again.' };
            }
        }

        return { error: 'Please login.' }

    }

    if (storedState !== returnedState) {
        return { error: 'State validation failed' }
    }

    localStorage.setItem('access_token', token);
    localStorage.setItem('token_expiration_time', expirationTime);
    window.location.hash = '';
    return getProfile(token, expirationTime);
}

async function getProfile(token, expirationTime) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: `Failed to fetch user data: ${errorData.error.message}` }
        }

        const data = await response.json();
        return { userId: data.id, token, expirationTime }

    } catch {
        return { error: 'Failed to fetch user data' };
    }
}
