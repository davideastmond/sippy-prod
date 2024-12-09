"use client";

import { ChangeEvent, useState } from "react";

interface SearchRequestsProps {
  onSearch: (query: string, filter: Record<string, boolean>) => void;
}

const SearchRequestsFilterPanel: React.FC<SearchRequestsProps> = ({
  onSearch,
}) => {
  const [dropdownHidden, setDropdownHidden] = useState(true);
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    {
      completed: false,
      pending: false,
      canceled: false,
      all: true,
    }
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleTextSearchChanged = (query: string) => {
    // Call the onSearch prop to filter data
    setSearchQuery(query);
    onSearch(query, checkedOptions);
  };

  const handleCheckboxFilterSelectionChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newCheckedOptions = {
      ...checkedOptions,
      [e.target.name]: e.target.checked,
      all: false,
    };

    const noFiltersSelected =
      !newCheckedOptions.completed &&
      !newCheckedOptions.pending &&
      !newCheckedOptions.canceled;

    if (noFiltersSelected) {
      newCheckedOptions.all = true;
    }

    setCheckedOptions(newCheckedOptions);
    onSearch(searchQuery, newCheckedOptions);
  };

  return (
    <div className="flex mb-4 mt-4">
      <input
        type="text"
        placeholder="Search by name or email"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2" //not sure if i need this...
        onChange={(e) => handleTextSearchChanged(e.target.value)}
      />
      <div>
        <button
          id="dropdownHelperButton"
          data-dropdown-toggle="dropdownHelper"
          className="text-simmpy-gray-200 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border border-gray-300"
          type="button"
          onClick={() => setDropdownHidden(!dropdownHidden)}
        >
          Filters
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {/* Dropdown */}
        <div
          id="dropdownHelper"
          className={`${
            dropdownHidden ? "hidden" : ""
          } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-60`}
        >
          <ul
            className="mt-2 p-4 bg-white absolute z-10 space-y-1 text-sm text-gray-700 border border-gray-300"
            aria-labelledby="dropdownHelperButton"
          >
            {["completed", "pending", "canceled", "all"].map((status) => (
              <li key={status}>
                <div className="flex rounded hover:bg-gray-100">
                  <div className="flex items-center h-5">
                    <input
                      id={`${status}-cb`}
                      name={status}
                      type="checkbox"
                      onChange={handleCheckboxFilterSelectionChanged}
                      checked={checkedOptions[status]}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <div className="ml-2 text-sm">
                    <label
                      htmlFor={`${status}-cb`}
                      className="font-medium text-gray-900"
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchRequestsFilterPanel;
