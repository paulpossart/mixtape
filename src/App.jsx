import React, {useState} from 'react';
import Header from './components/1-Header/Header';
import Searchbar from './components/2-Searchbar/Searchbar';
import SearchResults from './components/3-SearchResults/SearchResults';
import Playlist from './components/Playlist';

import './App.scss'


function App() {
const [code, setCode] = useState(false);

  return (
    <div className='App'>
      <Header className='header' code={code} setCode={setCode }/>
      <Searchbar className='searchbar' code={code} setCode={setCode }/>
      <SearchResults className='searchResults' />
      <Playlist className='playlist' />
    </div>
  );
}

export default App
