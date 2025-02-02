const clientId = 'e9dcfcba91d74f3aa912153e71f0cd1d';
const redirectUri = 'https://my-mixtape.netlify.app/'; //'http://localhost:5173/';
const stateKey = 'spotify_auth_state';

export async function authorise() {
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    let codeVerifier = generateRandomString(64);

    const sha256 = async (plain) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(plain);
        return window.crypto.subtle.digest('SHA-256', data);
    }

    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    window.localStorage.setItem('code_verifier', codeVerifier);

    const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const authUrl = new URL("https://accounts.spotify.com/authorize");

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
}

export async function getToken() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const tokenExpiry = localStorage.getItem('expiry_time');

    const url = 'https://accounts.spotify.com/api/token';

    if (accessToken && tokenExpiry > Date.now()) {
        console.log(`returned access token`);
        return accessToken;
    } else if (refreshToken) {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_id: clientId
            }),
        }
        const response = await fetch(url, payload);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            const expiryTime = new Date().getTime() + data.expires_in * 1000;
            localStorage.setItem('expiry_time', expiryTime);
            console.log(`returned refresh token`);
            return data.access_token;
        } else {
            console.log(`getToken failed to refresh`);
        }

    } else {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code');

        const codeVerifier = localStorage.getItem('code_verifier');

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        const response = await fetch(url, payload);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            const expiryTime = new Date().getTime() + data.expires_in * 1000;
            localStorage.setItem('expiry_time', expiryTime);
            console.log(`generated new access token`);
            return data.access_token;
        } else {
            console.log(`getToken failed to generate new token`);
        }
    }
}

export async function getUser(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.log(`getUser failed`);
    }
}

export async function refreshToken() {

}





/*===========================================================
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
*/