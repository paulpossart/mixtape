 # mixtape

 *Note: As this is a hobby project, it will not be approved by Spotify for general use.*
 
 *If would like to try it out, send me the email associated with your Spotify account, and I can add it to the list of approved users.*
 
 *Thanks.*
 
 ## About
 This SPA project uses the Spotify Web API to fetch user profile data, search for songs, and save a new playlist to a user's account. I made it to practise API calls and user authentication.  
 
 It is built using React, Redux Toolkit, and SCSS.  
 
 Figma prototype: https://www.figma.com/design/8GNRvuZfj11OSnSM9vvWe3/mixtape?node-id=0-1&t=tiu0QqEOSPnuipns-1
 ## Try it out
 To test search functionality, try searching for 'Foxey Lady'. A *name* search will return the Jimi Hendrix song. An *artist* search will return empty. An *album* search will return various artists.
 ## Issues
 The app originally used Spotify API's preview_url property to allow users to play a preview of a song. 
 That property is now deprecated so, as a work around, I added an embedded Spotify mini-player to allow users to play tracks. 
 ## Next-steps
 * ~Upgrade authentication to PKCE flow~ // Complete
 * ~Refactor for greater modularity - some of the components got out of control during the later stages of the project!~ // Complete
 * Implement a test suite with Jest // In progress...
   * Added unit and integration tests for key API endpoints: user login, song retrieval, and saving to Spotify
