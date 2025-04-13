import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 2) {
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(value.trim())}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.products);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search for supplements, vitamins, etc."
          className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 box-border input-field"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md cursor-pointer"
        >
          <FiSearch />
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul>
            {suggestions.map((product) => (
              <li key={product.id} className="border-b border-gray-100 last:border-b-0">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${product.slug}`);
                    setShowSuggestions(false);
                  }}
                >
                  {product.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;