import React, { useState } from "react";
import { Search } from "lucide-react"; // Icon for the search box

const SearchBoxButton = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);

    if (value) {
      setResults([`Result for "${value}"`, "Another result", "Something else"]);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          value={query}
          disabled={true}
          onChange={handleSearch}
          placeholder="Search..."
          className="cursor-pointer bg-transparent border-none outline-none focus:ring-0 flex-grow text-sm text-gray-900 dark:text-gray-100"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <ul>
            {results.map((result, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBoxButton;
