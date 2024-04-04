import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import axiosClient from '../axios-client';
import SecretTable from './SecretTable';

const { Search: AntdSearch } = Input;

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [secretSearch, setSecretSearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSecretsData()
  }, [])

  const getSecretsData = () => {
    axiosClient
      .get(`/api/secrets/getAllSecretsForUsers`)
      .then((res) => { setSecretSearch(res.data.data) })
      .catch((err) => {
        console.log("error in searc field")
      })
  }


  const handleSearch = (value) => {
    setSearchText(value);
    if (value.trim() === '') {
      // If the search text is empty, reset search results to show all data
      setSearchResults([]);
    } else {
      // Otherwise, filter the secretSearch data based on the search text
      const filteredResults = secretSearch.filter((item) =>
        item.title && item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  };


  const handleKeyUp = (e) => {
    handleSearch(e.target.value);
  };
  console.log(searchText, "searchText---")
  console.log(searchResults, "searchResultssearchResults")

  return (
    <div>
      <AntdSearch
        placeholder="Search"
        onKeyUp={handleKeyUp}
        style={{ width: 200 }}
      />
      {/* {searchText && (
        <ul>
          {searchResults.length > 0 ? (
            searchResults.map(item => (
              <li key={item.id} className='bg-red-500'>{item.title}</li>
            ))
            
          ) : (
            <li>No matching results found</li>
          )}
        </ul>
      )} */}
      {/* <p>Hello Akash</p> */}
      {/* // Inside the return statement of the Search component */}

      {!loading && (searchText !== '' || searchResults.length > 0) && (
        <SecretTable
          searchText={searchText}
          searchResults={searchResults}
          secret={secretSearch} // Change this line to pass the filtered data
        />
      )}

      {/* <SecretTable searchText={searchText} secretSearch={secretSearch} searchResults={searchResults}/> */}
    </div>
  );
};

export default Search;
