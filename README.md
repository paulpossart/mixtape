 # mixtape
 ## About
 This SPA project uses the Spotify Web API to fetch user profile data, search for songs, and save a new playlist to a user's account.
 Mixtape is built using React, Redux Toolkit, and SCSS.
 ## Try it out!
 To test search functionality, try searching for 'Foxey Lady'. A name search will return the Jimi Hendrix song. An artist search will return empty. An album search will return various artists.
 ## Issues
 The app originally used Spotify API's preview_url property to allow users to play a preview of a song. That property is now deprecated, so the project uses an embedded Spotify mini-player to allow users to play tracks. While users can still listen to songs, the 
 mini-player allows for less control over the functionality and appearance of the app.
 ## Next-steps
 * Upgrade authentication to PKCE flow
 * Refactor for greater modularity - some of the components got out of control during the later stages of the project!
 * Implement a test suite with Jest
