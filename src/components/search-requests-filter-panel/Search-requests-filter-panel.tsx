"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

interface SearchRequestsProps {
  onSearch: (query: string) => void;
}

const SearchRequestsFilterPanel: React.FC<SearchRequestsProps> = ({
  onSearch,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [dropdownHidden, setDropdownHidden] = useState(true);
  const [checkedOptions, setCheckedOptions] = useState<Record<string, boolean>>(
    {
      completed: false,
      pending: false,
      canceled: false,
      all: true,
    }
  );

  const handleSearch = (query: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newSearchParams.set("query", query);
    } else {
      newSearchParams.delete("query");
    }

    // Update the URL with the new query params
    router.push(`${pathname}?${newSearchParams.toString()}`);

    // Call the onSearch prop to filter data
    onSearch(query);
  };

  const handleCheckboxFilterSelectionChanged = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    // Handle the "All" checkbox
    if (e.target.name === "all") {
      const newCheckedOptions = {
        completed: false,
        pending: false,
        canceled: false,
        all: e.target.checked,
      };
      setCheckedOptions(newCheckedOptions);
      return;
    }

    const newCheckedOptions = {
      ...checkedOptions,
      [e.target.name]: e.target.checked,
      all: false,
    };
    setCheckedOptions(newCheckedOptions);
  };

  return (
    <div className="flex mb-4 mt-4">
      <input
        type="text"
        placeholder="Search by name or email"
        className="border border-gray-300 rounded-md px-4 py-2 mr-2" //not sure if i need this...
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div>
        <button
          id="dropdownHelperButton"
          data-dropdown-toggle="dropdownHelper"
          className="text-simmpy-gray-900 focus:ring-2 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center border border-gray-300"
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
            <li>
              <div className="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex items-center h-5">
                  <input
                    id="completed-cb"
                    name="completed"
                    aria-describedby="helper-checkbox-text-1"
                    type="checkbox"
                    checked={checkedOptions.completed}
                    onChange={handleCheckboxFilterSelectionChanged}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="completed-cb"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    <p>Completed</p>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex items-center h-5">
                  <input
                    id="pending-cb"
                    aria-describedby="helper-checkbox-text-1"
                    name="pending"
                    type="checkbox"
                    onChange={handleCheckboxFilterSelectionChanged}
                    checked={checkedOptions.pending}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="pending-cb"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    <p>Pending</p>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex items-center h-5">
                  <input
                    id="canceled-cb"
                    aria-describedby="helper-checkbox-text-1"
                    type="checkbox"
                    name="canceled"
                    onChange={handleCheckboxFilterSelectionChanged}
                    checked={checkedOptions.canceled}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="canceled-cb"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    <p>Canceled</p>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                <div className="flex items-center h-5">
                  <input
                    id="all-cb"
                    aria-describedby="helper-checkbox-text-1"
                    type="checkbox"
                    name="all"
                    onChange={handleCheckboxFilterSelectionChanged}
                    checked={checkedOptions.all}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                </div>
                <div className="ms-2 text-sm">
                  <label
                    htmlFor="all-cb"
                    className="font-medium text-gray-900 dark:text-gray-300"
                  >
                    <p>All</p>
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchRequestsFilterPanel;
