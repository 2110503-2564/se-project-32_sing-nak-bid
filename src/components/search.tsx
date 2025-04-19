import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Using react-icons for cleaner SVG

const Input = () => {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleClearInput = () => {
    setSearchText('');
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/search?query=${searchText}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        placeholder="Search..."
        className="input shadow-lg  px-5 py-3 rounded-l-xl w-56 transition-all focus:w-64 outline-none"
        name="search"
        type="search"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {searchText && (
        <button
          onClick={handleClearInput}
          className="absolute top-1/2 right-10 -translate-y-1/2 text-gray-500 focus:outline-none"
        >
        </button>
      )}
      <button
        onClick={handleSearch}
        className="bg-red-300 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-r-xl focus:outline-none focus:shadow-outline"
      >
        <FaSearch className="size-6" />
      </button>
    </div>
  );
};

export default Input;