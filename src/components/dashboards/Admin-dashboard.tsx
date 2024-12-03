"use client";

import SearchRequestsFilterPanel from "@/components/search-requests-filter-panel/Search-requests-filter-panel";
import Spinner from "@/components/spinner/Spinner";
import { formatPhoneNumber } from "@/lib/utils/phone-number/format-phone-number";
import { requestStatusColorMap } from "@/lib/utils/request-status/request-status-color-map";
import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { RequestStatus } from "@prisma/client";
import { ResidentRequestService } from "app/services/resident-request-service";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FormattedTimeSlotDateTime from "../formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";

const MAX_TAKE = 10; // This is the number of requests to fetch per page

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [userRequests, setUserRequests] = useState<
    AllUserRequestsAdminGetResponse[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.isAdmin) {
      fetchAllRequests();
    }
  }, [session?.user?.isAdmin, pageNumber]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const requests = await ResidentRequestService.adminGetAllRequests({
        take: MAX_TAKE,
        skip: pageNumber * MAX_TAKE,
      });
      setUserRequests(requests.residentRequests);
      setTotalCount(requests.count);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleSearch = (query: string, filters: Record<string, boolean>) => {
    //TODO: Implement search and filter
    console.log("51", query, filters);
    fetchSearchResults(query, filters);
  };

  const fetchSearchResults = useCallback(
    debounce(async (query: string, filters: Record<string, boolean>) => {
      if (!query) {
        setUserRequests([]);
        return;
      }

      try {
        await ResidentRequestService.searchRequests({
          stringQuery: query,
          requestStatus: Object.keys(filters).filter((key) => filters[key]),
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
        setUserRequests([]);
      }
    }, 300),
    []
  );

  const handlePagination = (direction: "forward" | "backward") => {
    if (direction === "forward") {
      if ((pageNumber + 1) * MAX_TAKE > totalCount) return;
      setPageNumber((prev) => prev + 1);
    } else {
      if (pageNumber === 0) return;
      setPageNumber((prev) => prev - 1);
    }
  };

  const handleUpdateRequestStatus = async (
    requestStatus: RequestStatus,
    requestId: string
  ) => {
    try {
      setLoading(true);
      // Do an admin update action to the current request
      await ResidentRequestService.patchRequestStatusById(
        requestId,
        requestStatus
      );

      await fetchAllRequests();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError("Failed to update request status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-[10%]">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {session?.user?.isAdmin ? (
        <div className="p-2">
          <h1 className="py-4">Welcome, {session?.user?.name} (Admin) </h1>
          <div>
            <h1 className="text-3xl font-bold text-center">Requests</h1>
          </div>
          <div className="mb-32">
            {/* Search and filter panel */}
            <SearchRequestsFilterPanel onSearch={handleSearch} />
          </div>
          <div className="relative overflow-x-auto mt-6 p-2 lg:flex lg:justify-center">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 bg-simmpy-gray-100 uppercase">
                <tr>
                  <th scope="col" className="py-3">
                    Name
                  </th>
                  <th scope="col" className="py-3 hidden lg:table-cell">
                    Email
                  </th>
                  <th scope="col" className="py-3 hidden lg:table-cell">
                    Phone#
                  </th>
                  <th scope="col" className="py-3">
                    Service Address
                  </th>
                  <th scope="col" className="py-3">
                    Req. Time Slot
                  </th>
                  <th scope="col" className="py-3">
                    Confirmed ETA
                  </th>
                  <th scope="col" className="py-3">
                    Status
                  </th>
                  <th scope="col" className="py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {userRequests?.map((request) => (
                  <tr
                    className="bg-white border-b hover:cursor-pointer hover:bg-gray-50"
                    key={request?.id}
                  >
                    <td>{request.user.name}</td>
                    <td className="hidden lg:table-cell">
                      {request.user.email}
                    </td>
                    <td className="hidden lg:table-cell">
                      {formatPhoneNumber(request.user.phoneNumber!)}
                    </td>
                    <td>
                      {request.address?.streetNumber}{" "}
                      {request.address?.streetName} {request.address?.city}
                    </td>
                    <td>
                      <FormattedTimeSlotDateTime
                        start={request.requestedTimeSlot.startTime}
                        end={request.requestedTimeSlot.endTime}
                      />
                    </td>
                    <td>
                      <FormattedTimeSlotDateTime
                        start={request.assignedTimeSlot?.startTime}
                        end={request.assignedTimeSlot?.endTime}
                      />
                    </td>
                    <td
                      className={`${
                        requestStatusColorMap[request.status]
                      } text-center`}
                    >
                      {request.status}
                    </td>
                    <td>
                      <ActionButtons
                        request={request}
                        onActionButtonClicked={(action: RequestStatus) =>
                          handleUpdateRequestStatus(action, request.id)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {/* Pagination Section */}
            <div className="flex flex-col items-center">
              {/* <!-- Help text --> */}
              <span className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {pageNumber * MAX_TAKE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-900">
                  {pageNumber * MAX_TAKE + userRequests.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalCount}
                </span>{" "}
                Entries
              </span>
              {/* <!-- Buttons --> */}
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  onClick={() => handlePagination("backward")}
                  className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900"
                >
                  Prev
                </button>
                <button
                  onClick={() => handlePagination("forward")}
                  className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900"
                >
                  Next
                </button>
              </div>
            </div>
            <div>
              {/* Errors */}
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-red-500 text-center font-bold text-2xl">
          Access to this page is denied (admin)
        </h1>
      )}
    </>
  );
}

const ActionButtons = ({
  request,
  onActionButtonClicked,
}: {
  request: AllUserRequestsAdminGetResponse;
  onActionButtonClicked: (requestStatus: RequestStatus) => void;
}) => {
  if (request.status === RequestStatus.PENDING) {
    return (
      <div className="flex flex-col">
        <button
          className="px-2 py-1 text-simmpy-green"
          onClick={() => onActionButtonClicked(RequestStatus.COMPLETED)}
        >
          Mark Completed
        </button>
        <button
          onClick={() => onActionButtonClicked(RequestStatus.CANCELED)}
          className="px-2 py-1 text-simmpy-red"
        >
          Mark Canceled
        </button>
      </div>
    );
  }
  if (request.status === RequestStatus.COMPLETED) {
    return (
      <div className="flex justify-center">
        <button
          className="px-2 py-1 text-simmpy-green"
          onClick={() => onActionButtonClicked(RequestStatus.PENDING)}
        >
          Move back to pending
        </button>
      </div>
    );
  }
};
