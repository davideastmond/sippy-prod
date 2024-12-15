"use client";

import SearchRequestsFilterPanel from "@/components/search-requests-filter-panel/Search-requests-filter-panel";
import Spinner from "@/components/spinner/Spinner";
import { formatPhoneNumber } from "@/lib/utils/phone-number/format-phone-number";
import { AllUserRequestsAdminGetResponse } from "@/types/api-responses/admin-resident-requests-api-response";
import { RequestStatus } from "@prisma/client";
import { ResidentRequestService } from "app/services/resident-request-service";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormattedTimeSlotDateTime from "../formatted-time-slot-date-time.tsx/FormattedTimeSlotDateTime";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_TAKE = 9; // max cards on page

const statusToColorMap: Record<
  RequestStatus,
  { border: string; bg: string; text: string }
> = {
  COMPLETED: {
    border: "border-green-500",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  PENDING: {
    border: "border-yellow-500",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
  },
  CANCELED: {
    border: "border-red-500",
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

const formatDate = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

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
  const [isSearching, setIsSearch] = useState(false);
  const [date, setDate] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<AllUserRequestsAdminGetResponse | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/authenticate");
    } else if (session?.user?.isAdmin) {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [status, session?.user?.isAdmin, router]);

  useEffect(() => {
    if (session?.user?.isAdmin && !isSearching && !date) {
      fetchAllRequests();
    }
  }, [session?.user?.isAdmin, pageNumber, isSearching, date]);

  useEffect(() => {
    if (session?.user?.isAdmin && date) {
      fetchAllRequestsByDate();
    }
  }, [session?.user?.isAdmin, date]);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      const requests = await ResidentRequestService.adminGetAllRequests({
        date: null,
        take: MAX_TAKE,
        skip: pageNumber * MAX_TAKE,
      });
      setUserRequests(
        requests.residentRequests.sort(
          (a, b) =>
            new Date(a.requestedTimeSlot.startTime).getTime() -
            new Date(b.requestedTimeSlot.startTime).getTime()
        )
      );
      setTotalCount(requests.count);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching all requests:", error);
      setError("Failed to fetch requests");
      setLoading(false);
    }
  };

  const fetchAllRequestsByDate = async () => {
    if (!date) return;
    try {
      setLoading(true);
      const requests = await ResidentRequestService.adminGetAllRequests({
        date,
        take: 999,
        skip: 0,
      });
      const sorted = requests.residentRequests.sort(
        (a, b) =>
          new Date(a.requestedTimeSlot.startTime).getTime() -
          new Date(b.requestedTimeSlot.startTime).getTime()
      );
      setUserRequests(sorted);
      setTotalCount(sorted.length);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching requests by date:", error);
      setError("Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleSearch = async (
    query: string,
    filters: Record<string, boolean>,
    selectedDate: string | null
  ) => {
    setDate(selectedDate!);
    setIsSearch(true);

    try {
      const allRequests = await ResidentRequestService.adminGetAllRequests({
        date: selectedDate,
        take: selectedDate ? 100 : MAX_TAKE,
        skip: selectedDate ? 0 : pageNumber * MAX_TAKE,
      });

      let filteredRequests = allRequests.residentRequests;

      if (!filters.all) {
        filteredRequests = filteredRequests.filter(
          (request) =>
            (filters.completed && request.status === "COMPLETED") ||
            (filters.pending && request.status === "PENDING") ||
            (filters.canceled && request.status === "CANCELED")
        );
      }

      if (query.trim()) {
        filteredRequests = filteredRequests.filter(
          (request) =>
            request.user.name.toLowerCase().includes(query.toLowerCase()) ||
            request.user.email.toLowerCase().includes(query.toLowerCase())
        );
      }

      filteredRequests.sort(
        (a, b) =>
          new Date(a.requestedTimeSlot.startTime).getTime() -
          new Date(b.requestedTimeSlot.startTime).getTime()
      );

      setUserRequests(filteredRequests);
      setTotalCount(filteredRequests.length);
    } catch (error) {
      console.error("Error in handleSearch:", error);
      setUserRequests([]);
      setTotalCount(0);
    }
  };

  const handlePagination = (direction: "forward" | "backward") => {
    if (date) return; // when selecting a date, don't show pagination
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
      await ResidentRequestService.patchRequestStatusById(
        requestId,
        requestStatus
      );
      toast.success(`Request updated to ${requestStatus}`);
      if (date) {
        await fetchAllRequestsByDate();
      } else {
        await fetchAllRequests();
      }
      setLoading(false);
      setSelectedRequest(null);
    } catch (error) {
      console.log("Error updating request status:", error);
      setError("Failed to update request status");
      setLoading(false);
    }
  };

  const handleCancelSearch = async () => {
    setIsSearch(false);
    setDate(null);
    setPageNumber(0);
    await fetchAllRequests();
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setSelectedRequest(null);
      setIsModalClosing(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-[10%]">
        <Spinner />
      </div>
    );
  }

  if (!session?.user?.isAdmin) {
    return (
      <div className="text-red-500 text-center font-bold text-2xl">
        Access to this page is denied (admin)
      </div>
    );
  }

  let morningRequests: AllUserRequestsAdminGetResponse[] = [];
  let noonRequests: AllUserRequestsAdminGetResponse[] = [];
  let eveningRequests: AllUserRequestsAdminGetResponse[] = [];

  if (date) {
    userRequests.forEach((req) => {
      const startTimeValue = req.requestedTimeSlot.startTime;
      const startTimeString =
        typeof startTimeValue === "string"
          ? startTimeValue
          : startTimeValue.toISOString();

      const hour = parseInt(startTimeString.substring(11, 13), 10);

      if (hour == 11) {
        morningRequests.push(req);
      } else if (hour == 14) {
        noonRequests.push(req);
      } else if (hour == 17) {
        eveningRequests.push(req);
      }
    });

    morningRequests = morningRequests.slice(0, 3);
    noonRequests = noonRequests.slice(0, 3);
    eveningRequests = eveningRequests.slice(0, 3);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="py-4 text-2xl font-bold">
        Welcome, {session.user.name} (Admin)
      </h2>
      <div className="flex justify-between items-center flex-wrap gap-2 mb-8">
        <SearchRequestsFilterPanel onSearch={handleSearch} />
        <Link
          className="text-white bg-[#1e3a89] p-2 rounded-md self-center"
          href="/dashboard/admin/route-manager"
        >
          Route Manager
        </Link>
      </div>
      {isSearching && (
        <button
          onClick={handleCancelSearch}
          className="text-simmpy-red text-sm mb-4"
        >
          Clear Search
        </button>
      )}

      {!date && (
        <>
          {userRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No requests found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {userRequests.map((request) => (
                <div
                  key={request.id}
                  className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition border-4 cursor-pointer flex flex-col ${
                    statusToColorMap[request.status].border
                  } ${statusToColorMap[request.status].bg}`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between w-full mb-4">
                    <div className="text-gray-600 font-medium">
                      {request.user.name}
                    </div>
                    <div className="text-gray-600 font-medium">
                      <FormattedTimeSlotDateTime
                        start={request.requestedTimeSlot.startTime}
                        end={request.requestedTimeSlot.endTime}
                      />
                    </div>
                  </div>
                  <div className="text-gray-700 mb-2">
                    {request.address?.city || "Unknown City"},{" "}
                    {request.address?.streetName || "Unknown Street"}
                  </div>
                  <h2
                    className={`text-lg font-bold uppercase ${
                      statusToColorMap[request.status].text
                    }`}
                  >
                    {request.status}
                  </h2>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center">
            {userRequests.length > 0 && (
              <>
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
              </>
            )}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </>
      )}

      {date && (
        <div className="space-y-8">
          {userRequests.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No requests found for {formatDate(date)}.
            </div>
          ) : (
            <>
              <DaySection
                title="Morning"
                requests={morningRequests}
                onCardClick={(req) => setSelectedRequest(req)}
              />
              <DaySection
                title="Noon"
                requests={noonRequests}
                onCardClick={(req) => setSelectedRequest(req)}
              />
              <DaySection
                title="Evening"
                requests={eveningRequests}
                onCardClick={(req) => setSelectedRequest(req)}
              />
            </>
          )}
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl border-t-8 ${
              statusToColorMap[selectedRequest.status].border
            } ${isModalClosing ? "animate-shrink" : "animate-grow"}`}
          >
            <h2
              className={`text-3xl font-bold mb-6 ${
                statusToColorMap[selectedRequest.status].text
              }`}
            >
              {selectedRequest.status} Details
            </h2>
            <div className="space-y-4 text-lg text-gray-700">
              <div>
                <strong>Name:</strong> {selectedRequest.user.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedRequest.user.email}
              </div>
              <div>
                <strong>Phone:</strong>{" "}
                {formatPhoneNumber(selectedRequest.user.phoneNumber!)}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {selectedRequest.address?.streetNumber || "Unknown"}{" "}
                {selectedRequest.address?.streetName || "Unknown"},{" "}
                {selectedRequest.address?.city || "Unknown"}
              </div>
              <div>
                <strong>Requested Time Slot:</strong>
                <FormattedTimeSlotDateTime
                  start={selectedRequest.requestedTimeSlot.startTime}
                  end={selectedRequest.requestedTimeSlot.endTime}
                />
              </div>
              {/*  I see no data assigned to this part  */}

              {/* <div>
                <strong>Assigned Time Slot:</strong>{" "}
                <FormattedTimeSlotDateTime
                  start={selectedRequest.assignedTimeSlot?.startTime}
                  end={selectedRequest.assignedTimeSlot?.endTime}
                />
              </div> */}
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <ActionButtons
                request={selectedRequest}
                onActionButtonClicked={(action: RequestStatus) =>
                  handleUpdateRequestStatus(action, selectedRequest.id)
                }
              />
              <button
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-400 transition ml-auto"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DaySection({
  title,
  requests,
  onCardClick,
}: {
  title: string;
  requests: AllUserRequestsAdminGetResponse[];
  onCardClick: (req: AllUserRequestsAdminGetResponse) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        {requests.length > 1 && (
          // only display "Optimize route" button if we have min 2 requests in that time frame
          <button
            className="text-white bg-[#1e3a89] p-2 rounded-md self-center"
            onClick={() => {
              //!!! TODO: Implement route optimization here !!!
              console.log(`Optimize route for ${title}`);
            }}
          >
            Optimize Route
          </button>
        )}
      </div>
      {requests.length === 0 ? (
        <div className="text-gray-500">
          No requests found in this time period.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className={`rounded-lg shadow-lg p-6 hover:shadow-xl transition border-4 cursor-pointer flex flex-col ${
                statusToColorMap[request.status].border
              } ${statusToColorMap[request.status].bg}`}
              onClick={() => onCardClick(request)}
            >
              <div className="flex justify-between w-full mb-4">
                <div className="text-gray-600 font-medium">
                  {request.user.name}
                </div>
                <div className="text-gray-600 font-medium">
                  <FormattedTimeSlotDateTime
                    start={request.requestedTimeSlot.startTime}
                    end={request.requestedTimeSlot.endTime}
                  />
                </div>
              </div>
              <div className="text-gray-700 mb-2">
                {request.address?.city || "Unknown City"},{" "}
                {request.address?.streetName || "Unknown Street"}
              </div>
              <h2
                className={`text-lg font-bold uppercase ${
                  statusToColorMap[request.status].text
                }`}
              >
                {request.status}
              </h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const ActionButtons = ({
  request,
  onActionButtonClicked,
}: {
  request: AllUserRequestsAdminGetResponse;
  onActionButtonClicked: (requestStatus: RequestStatus) => void;
}) => {
  const statuses: RequestStatus[] = [
    RequestStatus.PENDING,
    RequestStatus.COMPLETED,
    RequestStatus.CANCELED,
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => {
        let bgColor = "";
        let hoverColor = "";

        if (status === RequestStatus.COMPLETED) {
          bgColor = "bg-green-500";
          hoverColor = "hover:bg-green-600";
        } else if (status === RequestStatus.PENDING) {
          bgColor = "bg-yellow-500";
          hoverColor = "hover:bg-yellow-600";
        } else if (status === RequestStatus.CANCELED) {
          bgColor = "bg-red-500";
          hoverColor = "hover:bg-red-600";
        }

        const isCurrent = request.status === status;

        return (
          <button
            key={status}
            className={`${bgColor} ${hoverColor} text-white px-4 py-2 rounded transition ${
              isCurrent ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isCurrent && onActionButtonClicked(status)}
            disabled={isCurrent}
          >
            {status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        );
      })}
    </div>
  );
};
