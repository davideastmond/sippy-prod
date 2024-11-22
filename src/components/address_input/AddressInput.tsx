"use client";

import debounce from "lodash/debounce";
import { ChangeEvent, useCallback, useState } from "react";
import { InputText } from "../inputText";

const AddressInput = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [suggestionsDropdownOpen, setSuggestionsDropdownOpen] = useState(false);
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/addresses?query=${encodeURIComponent(value)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value?.length > 0) {
      setSuggestionsDropdownOpen(true);
    } else {
      setSuggestionsDropdownOpen(false);
    }
    setQuery(e.target.value);
    setSelectedAddress(null);
    fetchSuggestions(e.target.value);
  };

  const handleSelect = (address: string) => {
    setQuery(address);
    setSelectedAddress(address);
    setSuggestions([]);
    setError("");
    setSuggestionsDropdownOpen(false);
  };

  return (
    <>
      <InputText
        text="Enter your address"
        type="text"
        value={query}
        onChange={handleChange}
      />
      {suggestionsDropdownOpen && (
        <ul className="bg-simmpy-gray-100 rounded p-2">
          {suggestions.length > 0
            ? suggestions.map((address, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(address)}
                  className="hover:cursor-pointe"
                >
                  {address}
                </li>
              ))
            : query && <li>No matching addresses found</li>}
        </ul>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default AddressInput;
