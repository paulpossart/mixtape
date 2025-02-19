import React, {useState} from 'react';
import Header from './components/1-Header/Header';
import Searchbar from './components/2-Searchbar/Searchbar';
import SearchResults from './components/3-SearchResults/SearchResults';
import Playlist from './components/4-Playlist/Playlist';

import './App.scss'


function App() {

  return (
    <div className='App'>
      <Header className='header' />
      <Searchbar className='searchbar' />
      <SearchResults className='searchResults' />
      <Playlist className='playlist' />
    </div>
  );
}

export default App
