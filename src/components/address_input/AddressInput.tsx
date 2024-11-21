"use client";

import React, { useState, useCallback, ChangeEvent, FormEvent } from "react";
import debounce from "lodash/debounce";

const AddressInput = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<String | null>(null);
  const [error, setError] = useState("");

  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/addresses?query=${encodeURIComponent(value)}`);
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

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedAddress(null);
    fetchSuggestions(e.target.value);
  };

  const handleSelect = (address:string) => {
    setQuery(address);
    setSelectedAddress(address);
    setSuggestions([]);
    setError("");
  };

  // This should be changed after integration with the request submission form
  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAddress) {
      setError("Please select a valid Los Angeles address.");
      return;
    }
    console.log("Form submitted with the following address: ", selectedAddress);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Enter your address"
      />
      <ul>
        {suggestions.length > 0 ? (
          suggestions.map((address, idx) => (
            <li key={idx} onClick={() => handleSelect(address)}>
              {address}
            </li>
          ))
        ) : (
          query && <li>No matching addresses found</li>
        )}
      </ul>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddressInput;
