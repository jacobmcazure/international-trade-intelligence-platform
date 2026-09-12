"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ allCountryData, onSearchSubmit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const countryData = Array.isArray(allCountryData) ? allCountryData : [];

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = useCallback(
    debounce((term) => {
      if (term.trim() === '') {
        setSearchResults([]);
      } else {
        const results = countryData.filter((c) =>
          c.name?.toLowerCase().includes(term.toLowerCase()),
        );
        setSearchResults(results);
      }
    }, 300),
    [countryData],
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    const exactMatch = countryData.find((c) => c.name?.toLowerCase() === trimmedTerm.toLowerCase());

    onSearchSubmit?.(exactMatch ?? trimmedTerm);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="mb-4 w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full rounded-full border text-black border-gray-200 bg-gray-50 px-5 py-3 pr-25 text-base shadow-md transition-shadow duration-200 hover:shadow-lg focus:border-gray-300 focus:outline-none"
            placeholder="Search Countries..."
          />
          <div className="absolute right-0 top-0 mr-4 mt-3 flex items-center">
            <button type="submit" className="text-blue-500 hover:text-blue-600">
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>

      {searchResults.length > 0 && (
        <div className="w-full max-w-2xl rounded-lg bg-gray-50 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-500">Search Results:</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.iso_code || result.name} className="mb-2">
                <button
                  type="button"
                  onClick={() => onSearchSubmit?.(result)}
                  className="w-full text-left text-blue-600 hover:underline hover:cursor-pointer"
                >
                  {result.name}
                  {result.region ? ` · ${result.region}` : ''}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
