'use client';

import { useState, useEffect, useCallback } from "react";
import { Search } from 'lucide-react';

const sampleData = [
  {
    id: 1,
    title: 'React Official Documentation',
    url: 'https://reactjs.org/',
  },
  {
    id: 2,
    title: 'Mozilla Developer Network (MDN)',
    url: 'https://developer.mozilla.org/',
  },
  {
    id: 3,
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com/',
  },
  {
    id: 4,
    title: 'GitHub',
    url: 'https://github.com/',
  },
  {
    id: 5,
    title: 'npm',
    url: 'https://www.npmjs.com/',
  },
];

export default function SearchBar({ onSearchSubmit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
        const results = sampleData.filter((item) =>
          item.title.toLowerCase().includes(term.toLowerCase()),
        );
        setSearchResults(results);
      }
    }, 300),
    [],
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit?.(searchTerm.trim() || 'Search query');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-white p-8">
      <form onSubmit={handleSubmit} className="mb-8 w-full max-w-2xl">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 pr-25 text-base shadow-md transition-shadow duration-200 hover:shadow-lg focus:border-gray-300 focus:outline-none"
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
        <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Search Results:</h2>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id} className="mb-2">
                <a
                  href={result.url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}