import { fetchSongs } from "../fetchSongs";

describe('fetchSongs function unit test', () => {
    beforeAll(() => {
        delete global.fetch;
    });

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('fetchSongs returns an object of tracks', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({
                tracks: {
                    items: [
                        {
                            id: '123',
                            name: 'song1',
                            artists: [{ name: 'artist1' }],
                            album: {
                                name: 'album1',
                                images: [
                                    { url: 'image1.jpg' },
                                    { url: 'image2.jpg' },
                                ]
                            },
                            uri: 'uri1',
                        },
                        {
                            id: '456',
                            name: 'song2',
                            artists: [{ name: 'artist2' }],
                            album: {
                                name: 'album2',
                                images: [
                                    { url: 'image1.jpg' },
                                ]
                            },
                            uri: 'uri2'
                        },
                        {
                            id: '789',
                            name: 'song3',
                            artists: [{ name: 'artist3' }],
                            album: {
                                name: 'album3',
                                images: [
                                ]
                            },
                            uri: 'uri3',
                        }
                    ]
                }
            })
        });

        const result = await fetchSongs('access-token', 'song-query');

        expect(result).toEqual([
            {
                id: '123',
                name: 'song1',
                artist: 'artist1',
                album: 'album1',
                uri: 'uri1',
                image_url: 'image2.jpg'
            },
            {
                id: '456',
                name: 'song2',
                artist: 'artist2',
                album: 'album2',
                uri: 'uri2',
                image_url: 'image1.jpg'
            },
            {
                id: '789',
                name: 'song3',
                artist: 'artist3',
                album: 'album3',
                uri: 'uri3',
                image_url: '../../src/assets/spotify-color-svgrepo-com.svg'
            }
        ]);

        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.spotify.com/v1/search?q=song-query&type=track&limit=10',
            {
                headers: {
                    Authorization: 'Bearer access-token'
                }
            }
        );
    });

    test('fetchSongs returns an error', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({
                error: { message: 'mock error message' },
            })
        });

        const logSpy = jest.spyOn(console, 'log').mockImplementation();

        await fetchSongs('invalid-token', 'song-query');

        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining('Error fetching songs:'),
            expect.stringContaining('mock error message')
        );
    });
});