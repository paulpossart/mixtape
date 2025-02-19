import { authorise, getToken, getUser } from "../login";

describe('authorise function unit test', () => {
    beforeAll(() => {
        delete global.location;
        delete global.localStorage;
    });

    beforeEach(() => {
        global.TextEncoder = require("util").TextEncoder;
        global.crypto.subtle = {
            digest: jest.fn().mockResolvedValue('mock-SHA-256')
        };
        global.location = {
            href: '',
        };
        global.localStorage = {
            setItem: jest.fn(),
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('redirects to the correct Spotify URL', async () => {
        const expectedUrl = 'https://accounts.spotify.com/authorize';
        await authorise();
        expect(window.location.href).toContain(expectedUrl);
    });

    test('authorise sets code_verifier in localStorage', async () => {
        await authorise();
        const codeVerifier = expect.any(String);
        expect(localStorage.setItem).toHaveBeenCalledWith('code_verifier', codeVerifier);
    });
});

describe('getToken function unit test', () => {
    beforeAll(() => {
        delete global.location;
        delete global.localStorage;
        delete global.fetch;
    });

    beforeEach(() => {
        global.location = {
            href: '',
        };
        global.localStorage = {
            getItem: jest.fn(),
            setItem: jest.fn(),
        };
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('getToken returns current access_token', async () => {
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'access_token') {
                return 'current-access-token';
            }
            if (key === 'expiry_time') {
                return Date.now() + 1000;
            };
            return null
        });

        const result = await getToken();

        expect(result).toBe('current-access-token');
    });

    test('getToken uses refresh_token to generate new access_token', async () => {
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'refresh_token') {
                return 'mock-refresh-token';
            }
            return null;
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                access_token: 'used-refresh-token',
            })
        });

        const result = await getToken();

        expect(result).toBe('used-refresh-token');
    });

    test('getToken uses refresh_token but fails to generate new access_token', async () => {
        localStorage.getItem.mockImplementation((key) => {
            if (key === 'refresh_token') {
                return 'mock-refresh-token';
            }
            return null;
        });

        fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' }
            })
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        await getToken();

        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('getToken failed to refresh:'),
            expect.stringContaining('mock error message')
        );
    });

    test('getToken generates new access token', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                access_token: 'new-access-token',
            })
        });

        const result = await getToken();

        expect(result).toBe('new-access-token');
    });

    test('getToken fails to generate new acces token', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' }
            })
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        await getToken();

        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('getToken failed to generate new token:'),
            expect.stringContaining('mock error message')
        );
    });
});

describe('getUser function unit test', () => {
    beforeAll(() => {
        delete global.fetch;
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('getUser', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                user_id: 'user-id',
            })
        });

        const result = await getUser('access-token');

        expect(result.user_id).toBe('user-id');
    });

    test('getUser fails and logs an error', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' }
            })
        });
        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        await getUser('invalid-token');

        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('getUser failed:'),
            expect.stringContaining('mock error message')
        );
    });
});

