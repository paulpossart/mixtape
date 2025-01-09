import React, {useState} from 'react';
import Header from './components/Header';
import Searchbar from './components/Searchbar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

import './App.scss'


function App() {
const [code, setCode] = useState(false);

  return (
    <div className='App'>
      <Header className='header' code={code} setCode={setCode }/>
      {<Searchbar className='searchbar' code={code} setCode={setCode }/>}
      <SearchResults className='searchResults' />
      <Playlist className='playlist' />
    </div>
  );
}

export default App
