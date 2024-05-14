import React, { useEffect, useState } from 'react';

function Search({ isOpen }) {
  const [content, setContent] = useState('');
  const [recent, setRecent] = useState([]);
  const [searchResults, setSearchResults] = useState(''); // State to store search results

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    if (Array.isArray(history.recent)) {
      setRecent(history.recent);
    }
    console.log(history);
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    if (!content.trim()) return; // Prevent searching empty strings
    setRecent(prev => [content, ...prev.slice(0, 4)]);
    window.localStorage.setItem('history', JSON.stringify({ recent: [content, ...recent.slice(0, 4)] }));

    // Make an API call to search
    fetch(`http://localhost:3000/api/naturalSearch/search?q=${encodeURIComponent(content)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.text()) // Assuming the server responds with text
    .then(data => {
      setSearchResults(data); // Store the search results
    })
    .catch(error => console.error('Error fetching search results:', error));

    setContent(''); // Clear the input after search
  }

  function clearRecent() {
    setRecent([]);
    window.localStorage.setItem('history', JSON.stringify({ recent: [] }));
  }

  return (
    <div
      className={`absolute left-24 flex h-full flex-col items-center rounded-2xl border-solid bg-white shadow-[rgba(0,0,0,0.1)_5px_0px_10px_0px] ${!isOpen ? 'w-0 opacity-0 transition-min-width' : 'w-96 opacity-100 transition-max-width'} z-10 duration-500`}
    >
      <h1 className='w-full p-7 text-left text-3xl font-semibold'>Search</h1>
      <form className='flex-center w-full border-b-2 pb-8' onSubmit={handleSearch}>
        <input
          className='w-[90%] rounded-xl border-solid bg-stone-200 p-3'
          type='search'
          placeholder='Search'
          onChange={(event) => setContent(event.target.value)}
          value={content}
        />
      </form>
      <div className='flex-between w-full p-7'>
        <h1 className='text-md font-medium'>Recent</h1>
        <a className='text-md cursor-pointer font-semibold text-blue-400 hover:text-blue-800' onClick={clearRecent}>
          Clear all
        </a>
      </div>
      <div className='flex-center flex-col'>
        {recent.map((r, index) => (
          <a
            className='cursor-pointer'
            key={index}
            onClick={(event) => setContent(r)}
          >
            {r}
          </a>
        ))}
      </div>
      {searchResults && (
        <div className='w-full p-3'>
          <h2 className='text-md font-medium'>Results:</h2>
          <pre className='whitespace-pre-wrap text-sm'>{searchResults}</pre>
        </div>
      )}
    </div>
  );
}

export default Search;
