const clientId = 'e9dcfcba91d74f3aa912153e71f0cd1d';
const redirectUri = /*'https://my-mixtape.netlify.app/';*/'http://localhost:5173/';

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

   localStorage.setItem('code_verifier', codeVerifier);

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
};

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
        

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            const expiryTime = new Date().getTime() + data.expires_in * 1000;
            localStorage.setItem('expiry_time', expiryTime);
            console.log(`used refresh token`);
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
        
        if (response.ok) {
            const data = await response.json();
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
};

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
};
