"use client";

import { GoogleAddressApiResponse } from "@/types/google-address-api-response";
import debounce from "lodash/debounce";
import { ChangeEvent, useCallback, useState } from "react";
import { InputText } from "../inputText";

interface AddressInputProps {
  validationErrors?: string;
  onSelect?: (data: GoogleAddressApiResponse) => void;
  addressData?: GoogleAddressApiResponse;
}
const AddressInput = ({
  onSelect,
  validationErrors,
  addressData,
}: AddressInputProps) => {
  const [query, setQuery] = useState(getInitialQuery(addressData));

  const [error, setError] = useState("");
  const [suggestionsDropdownOpen, setSuggestionsDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<GoogleAddressApiResponse[]>(
    getInitialGoogleAddressData(addressData)
  );
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
        const data: GoogleAddressApiResponse[] = await response.json();
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
    fetchSuggestions(e.target.value);
  };

  const handleSelect = (address: GoogleAddressApiResponse) => {
    setQuery(address.description);
    setSuggestions([]);
    setError("");
    setSuggestionsDropdownOpen(false);
    onSelect?.(address);
  };

  return (
    <>
      <InputText
        text="Enter your address"
        type="text"
        value={query}
        onChange={handleChange}
        error={validationErrors}
      />
      {suggestionsDropdownOpen && (
        <ul className="bg-simmpy-gray-100 rounded p-2">
          {suggestions.length > 0
            ? suggestions.map((addressSuggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelect(addressSuggestion)}
                  className="hover:cursor-pointe"
                >
                  {addressSuggestion.description}
                </li>
              ))
            : query && <li>No matching addresses found</li>}
        </ul>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

function getInitialGoogleAddressData(
  addressData: GoogleAddressApiResponse | undefined
): GoogleAddressApiResponse[] {
  return addressData ? [addressData] : [];
}

function getInitialQuery(addressData: GoogleAddressApiResponse | undefined) {
  return addressData?.description || "";
}

export default AddressInput;
