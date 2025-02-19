import { createPlaylist } from "../saveToSpotify";

describe('saveToSpotify integration test', () => {
    beforeAll(() => {
        delete global.fetch;
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('successfully create and add tracks to a playlist', async () => {
        const mockToken = 'mock-token';
        const mockUserId = 'mock-user-id';
        const mockPlaylistName = 'mock-playlist-name';
        const mockPlaylist = [{ uri: "uri1" }, { uri: "uri2" }, { uri: "uri3" }];
        const mockPlaylistId = 'mock-playlist-id';

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                id: mockPlaylistId
            })
        });

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({})
        });

        const result = await createPlaylist(mockToken, mockUserId, mockPlaylistName, mockPlaylist);

        expect(fetch).toHaveBeenCalledWith(
            `https://api.spotify.com/v1/users/${mockUserId}/playlists`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                },
                body: JSON.stringify({
                    name: mockPlaylistName,
                    public: false,
                }),
            })
        );

        expect(fetch).toHaveBeenCalledWith(
            `https://api.spotify.com/v1/playlists/${mockPlaylistId}/tracks`,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: ["uri1", "uri2", "uri3"]
                })
            })
        );
        expect(result).toBe(mockPlaylistId)
    });

    test('namePlaylist fails', async () => {
        const mockToken = 'mock-token';
        const mockUserId = 'mock-user-id';
        const mockPlaylistName = 'mock-playlist-name';
        const mockPlaylist = [{ uri: "uri1" }, { uri: "uri2" }, { uri: "uri3" }];

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' },
            })
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        const result = await createPlaylist(mockToken, mockUserId, mockPlaylistName, mockPlaylist);

        expect(result).toBeUndefined();
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('namePlaylist failed:'),
            expect.stringContaining('mock error message')
        );
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('playlistId failed, addTracks will not run')
        );
    });

    test('addTracksToPlaylist fails', async () => {
        const mockToken = 'mock-token';
        const mockUserId = 'mock-user-id';
        const mockPlaylistName = 'mock-playlist-name';
        const mockPlaylist = [{ uri: "uri1" }, { uri: "uri2" }, { uri: "uri3" }];
        const mockPlaylistId = 'mock-playlist-id';

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                id: mockPlaylistId
            })
        });

        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' },
            })
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        const result = await createPlaylist(mockToken, mockUserId, mockPlaylistName, mockPlaylist);

        expect(result).toBeUndefined();
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('addTracksToPlaylist failed:'),
            expect.stringContaining('mock error message')
        );
    });
});
