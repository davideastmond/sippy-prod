"use client";

import dayjs from "dayjs";
import { ChangeEvent, useState } from "react";

interface SearchRequestsProps {
  onSearch: (
    query: string,
    filter: Record<string, boolean>,
    date: string | null,
    sort: SortOption
  ) => void;
}

type SortOption = "createdDate" | "requestedDateAsc" | "requestedDateDesc";

const sortOptions: SortOption[] = [
  "createdDate",
  "requestedDateAsc",
  "requestedDateDesc",
];

const SearchRequestsFilterPanel: React.FC<SearchRequestsProps> = ({
  onSearch,
}) => {
  const [dropdownHidden, setDropdownHidden] = useState(true);
  const [sortDropdownHidden, setSortDropdownHidden] = useState(true);
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    {
      completed: false,
      pending: false,
      canceled: false,
      all: true,
    }
  );

  const [selectedSortOption, setSelectedSortOption] =
    useState<SortOption>("createdDate");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  const handleTextSearchChanged = (query: string) => {
    // Call the onSearch prop to filter data
    setSearchQuery(query);
    onSearch(query, checkedOptions, dateFilter, selectedSortOption);
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
    onSearch(searchQuery, newCheckedOptions, dateFilter!, selectedSortOption);
  };

  const handleSortRadioChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedSortOption(e.target.value as SortOption);
    onSearch(
      searchQuery,
      checkedOptions,
      dateFilter!,
      e.target.value as SortOption
    );
    setSortDropdownHidden(true);
  };

  return (
    <div
      className="flex mb-4 mt-4 flex-col md:flex-row gap-y-2"
      id="search-requests-filter-panel"
    >
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
          } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow`}
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
      {/* Sorter dropdown */}
      <div>
        <button
          id="sortDropdownButton"
          data-dropdown-toggle="sortDropdownHelper"
          className="text-simmpy-gray-200 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border border-gray-300"
          type="button"
          onClick={() => {
            setSortDropdownHidden(!sortDropdownHidden);
            setDropdownHidden(true);
          }}
        >
          Sorted by {SortedDict[selectedSortOption]}
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
          <div
            id="sortHelper"
            className={`${
              sortDropdownHidden ? "hidden" : ""
            } z-10 bg-white divide-y divide-gray-100 rounded-lg shadow`}
          >
            <ul
              className="mt-[1.5rem] p-4 bg-white absolute z-10 space-y-1 text-sm text-gray-700 border border-gray-300 ml-[-200px]"
              aria-labelledby="sortDropdownHelperButton"
            >
              {sortOptions.map((sortOption) => (
                <li key={sortOption}>
                  <div className="flex rounded hover:bg-gray-100">
                    <div className="flex items-center h-5">
                      <input
                        id={`${sortOption}-radio`}
                        name={"sortOption"}
                        type="radio"
                        onChange={handleSortRadioChanged}
                        value={sortOption}
                        checked={selectedSortOption === sortOption}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label
                        htmlFor={`${sortOption}-radio`}
                        className="font-medium text-gray-900"
                      >
                        {SortedDict[sortOption as SortOption]}
                      </label>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </button>
      </div>
      {/* Date picker filter */}
      <div className="flex rounded hover:bg-gray-100 md:self-center md:ml-4">
        <div className="flex items-center h-5">
          <input
            id="date-picker"
            name="dateFilter"
            type="date"
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 w-[20px]"
            onClick={() => {
              setSortDropdownHidden(true);
              setDropdownHidden(true);
            }}
            onChange={(e) => {
              setDateFilter(e.target.value);
              onSearch(
                searchQuery,
                checkedOptions,
                e.target.value,
                selectedSortOption
              );
            }}
            value={dateFilter ?? ""}
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="date-picker" className="text-gray-900">
            {getDateString(dateFilter!)}
          </label>
        </div>
      </div>
    </div>
  );
};

const getDateString = (date: string | null): string => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("MMM-DD-YYYY");
  }
  return "No date selected";
};

const SortedDict: Record<SortOption, string> = {
  createdDate: "Date Created",
  requestedDateAsc: "Reques. Date Asc.",
  requestedDateDesc: "Reques. Date Desc.",
};
export default SearchRequestsFilterPanel;
