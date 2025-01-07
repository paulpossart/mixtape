import Header from './components/Header';
import Searchbar from './components/Searchbar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';

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
